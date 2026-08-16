import {
  AlertTriangle,
  CheckCircle,
  Edit,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Store,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const StoreDashboard = () => {
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [editData, setEditData] = useState({ quantity: "", price: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    medicineId: "",
    quantity: "",
    price: "",
    batchNumber: "",
    expiryDate: "",
  });
  const [medicines, setMedicines] = useState([]);
  const [complaintsError, setComplaintsError] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchStoreData = async () => {
    try {
      // Get stores owned by this user
      const storesRes = await axios.get("/stores?ownerId=" + user.id);
      const myStore = storesRes.data.data?.[0];
      if (!myStore) {
        setLoading(false);
        return;
      }
      setStore(myStore);

      // Fetch inventory for this store
      const invRes = await axios.get(`/inventory/store/${myStore.id}`);
      setInventory(invRes.data.data || []);

      // Fetch complaints for this store (handle 403 gracefully)
      try {
        const compRes = await axios.get(`/complaints?storeId=${myStore.id}`);
        setComplaints(compRes.data.data || []);
        setComplaintsError(false);
      } catch (compErr) {
        if (compErr.response?.status === 403) {
          console.warn(
            "Access denied to complaints. Only admins can view complaints.",
          );
          setComplaintsError(true);
          setComplaints([]);
        } else {
          throw compErr;
        }
      }

      // Fetch all medicines for add modal
      const medRes = await axios.get("/medicines");
      setMedicines(medRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch store data", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEdit = (item) => {
    setEditingItem(item.id);
    setEditData({ quantity: item.quantity, price: item.price });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.post("/inventory/upsert", {
        storeId: store.id,
        medicineId: id,
        quantity: parseInt(editData.quantity),
        price: parseFloat(editData.price),
      });
      setEditingItem(null);
      fetchStoreData();
    } catch (err) {
      alert(
        "Failed to update inventory: " +
          (err.response?.data?.error || "Unknown error"),
      );
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/inventory/upsert", {
        storeId: store.id,
        medicineId: newItem.medicineId,
        quantity: parseInt(newItem.quantity),
        price: parseFloat(newItem.price),
        batchNumber: newItem.batchNumber,
        expiryDate: newItem.expiryDate
          ? new Date(newItem.expiryDate)
          : undefined,
      });
      setShowAddModal(false);
      setNewItem({
        medicineId: "",
        quantity: "",
        price: "",
        batchNumber: "",
        expiryDate: "",
      });
      fetchStoreData();
    } catch (err) {
      alert(
        "Failed to add item: " + (err.response?.data?.error || "Unknown error"),
      );
    }
  };

  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.reorderLevel,
  );

  if (loading)
    return (
      <div className="text-center py-12 text-sm text-gray-500">
        Loading store data…
      </div>
    );
  if (!store)
    return (
      <div className="text-center py-12 text-red-600">
        You don't own any store yet. Contact admin.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Store className="w-6 h-6 text-teal-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            Store Dashboard
          </h1>
          <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {store.status}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 flex items-center gap-1">
            <User className="w-4 h-4" /> {user.name}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm hover:bg-red-100 transition flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{store.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {store.city}, {store.state}
              </span>
              {store.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {store.phone}
                </span>
              )}
              {store.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {store.email}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              QR: {store.qrCode?.slice(0, 12)}…
            </span>
            <button
              onClick={fetchStoreData}
              className="p-2 rounded hover:bg-gray-100 transition"
            >
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </p>
              <ul className="text-xs text-yellow-700 mt-1 flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <li
                    key={item.id}
                    className="bg-yellow-100 px-2 py-0.5 rounded-full"
                  >
                    {item.medicine?.name}: {item.quantity} left
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Package className="w-4 h-4" /> Inventory ({inventory.length})
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-teal-700 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
          {inventory.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No inventory items yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Medicine
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Batch
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Expiry
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Qty
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.map((item) => {
                    const isLow = item.quantity <= item.reorderLevel;
                    const price = parseFloat(item.price) || 0;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-800">
                          {item.medicine?.name}
                        </td>
                        <td className="px-3 py-2 text-gray-600 text-xs">
                          {item.batchNumber || "—"}
                        </td>
                        <td className="px-3 py-2 text-gray-600 text-xs">
                          {item.expiryDate
                            ? new Date(item.expiryDate).toLocaleDateString(
                                "en-IN",
                              )
                            : "—"}
                        </td>
                        <td className="px-3 py-2">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              value={editData.quantity}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  quantity: e.target.value,
                                })
                              }
                              className="w-16 border rounded px-1 py-0.5 text-sm"
                            />
                          ) : (
                            <span
                              className={
                                isLow
                                  ? "text-red-600 font-medium"
                                  : "text-gray-700"
                              }
                            >
                              {item.quantity}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editData.price}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  price: e.target.value,
                                })
                              }
                              className="w-20 border rounded px-1 py-0.5 text-sm"
                            />
                          ) : (
                            <span>₹{price.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                              isLow
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {isLow ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            {isLow ? "Low" : "In Stock"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          {editingItem === item.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveEdit(item.medicineId)}
                                className="bg-teal-600 text-white px-2 py-0.5 rounded text-xs hover:bg-teal-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingItem(null)}
                                className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 rounded hover:bg-gray-100 text-gray-500 transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Complaints */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Complaints Against Store
            </h3>
          </div>
          {complaintsError ? (
            <div className="p-4 text-center text-yellow-600 text-sm">
              ⚠️ You don't have permission to view complaints. Only admins can
              access this data.
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No complaints yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {complaints.slice(0, 5).map((c) => (
                <li
                  key={c.id}
                  className="px-4 py-2 flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium">{c.medicine?.name}</span>
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                        c.status === "RESOLVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {c.status}
                    </span>
                    <div className="text-xs text-gray-500">
                      {c.description || "—"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Add Modal – unchanged */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Add Inventory Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-4 space-y-3">
              <select
                required
                value={newItem.medicineId}
                onChange={(e) =>
                  setNewItem({ ...newItem, medicineId: e.target.value })
                }
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">Select Medicine</option>
                {medicines.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                required
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: e.target.value })
                }
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                required
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="text"
                placeholder="Batch Number"
                value={newItem.batchNumber}
                onChange={(e) =>
                  setNewItem({ ...newItem, batchNumber: e.target.value })
                }
                className="w-full p-2 border rounded text-sm"
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={newItem.expiryDate}
                onChange={(e) =>
                  setNewItem({ ...newItem, expiryDate: e.target.value })
                }
                className="w-full p-2 border rounded text-sm"
              />
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
              >
                Add Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;
