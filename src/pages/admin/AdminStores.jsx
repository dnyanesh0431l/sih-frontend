import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
  Store,
  MapPin,
  User,
  Phone,
  Mail,
  Search,
  CheckCircle,
  XCircle,
  Building2,
  PlusCircle,
  X,
  Edit,
} from 'lucide-react';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    lat: '',
    lng: '',
    phone: '',
    email: '',
    ownerId: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch stores and users separately
  const fetchData = async () => {
    setLoading(true);
    setFetchError('');

    try {
      // 1. Fetch stores
      const storesRes = await axios.get('/stores');
      const storesData = storesRes.data.data || [];
      setStores(storesData);

      // 2. Fetch users (store owners) – if fails, we'll extract from stores
      let usersData = [];
      try {
        const usersRes = await axios.get('/users?role=STORE_OWNER');
        usersData = usersRes.data.data || [];
      } catch (userErr) {
        console.warn('Failed to fetch users, extracting from stores:', userErr.message);
        // Extract unique owners from stores
        const ownersMap = new Map();
        storesData.forEach((store) => {
          if (store.owner && store.owner.id) {
            ownersMap.set(store.owner.id, {
              id: store.owner.id,
              name: store.owner.name,
              email: store.owner.email,
              role: 'STORE_OWNER',
            });
          }
        });
        usersData = Array.from(ownersMap.values());
      }
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setFetchError('Failed to load stores. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter stores
  useEffect(() => {
    let result = stores;
    if (search.trim()) {
      const lower = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name?.toLowerCase().includes(lower) ||
          s.city?.toLowerCase().includes(lower) ||
          s.state?.toLowerCase().includes(lower) ||
          s.pincode?.includes(search) ||
          s.owner?.name?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter) {
      result = result.filter((s) => s.status === statusFilter);
    }
    setFilteredStores(result);
  }, [search, statusFilter, stores]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      lat: '',
      lng: '',
      phone: '',
      email: '',
      ownerId: '',
    });
    setEditingStore(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address || '',
      city: store.city || '',
      state: store.state || '',
      pincode: store.pincode || '',
      lat: store.lat?.toString() || '',
      lng: store.lng?.toString() || '',
      phone: store.phone || '',
      email: store.email || '',
      ownerId: store.ownerId || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        lat: parseFloat(formData.lat) || undefined,
        lng: parseFloat(formData.lng) || undefined,
        ownerId: formData.ownerId || undefined,
      };

      if (editingStore) {
        await axios.put(`/stores/${editingStore.id}`, payload);
      } else {
        await axios.post('/stores', payload);
      }

      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert(
        `Failed to ${editingStore ? 'update' : 'create'} store: ` +
          (err.response?.data?.error || 'Unknown error')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Store className="w-6 h-6 text-teal-600" />
          Stores
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {filteredStores.length}
          </span>
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <button
            onClick={openAddModal}
            className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-teal-700 transition flex items-center gap-1"
          >
            <PlusCircle className="w-4 h-4" />
            Add Store
          </button>
        </div>
      </div>

      {/* Error / Loading / Table */}
      {loading ? (
        <div className="text-center py-8 text-sm text-gray-500">Loading stores…</div>
      ) : fetchError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {fetchError}
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 text-sm">
          No stores found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-800">{store.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {store.city && store.state ? `${store.city}, ${store.state}` : store.city || store.state || '—'}
                      {store.pincode && <span className="text-gray-400 text-xs ml-1">({store.pincode})</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                    <div className="flex flex-col text-xs">
                      {store.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {store.phone}
                        </span>
                      )}
                      {store.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          {store.email}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {store.owner?.name || '—'}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        store.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : store.status === 'INACTIVE'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {store.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {store.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    {store.qrCode ? (
                      <span
                        className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[60px] inline-block"
                        title={store.qrCode}
                      >
                        {store.qrCode.slice(0, 8)}…
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-center">
                    <button
                      onClick={() => openEditModal(store)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 transition"
                      title="Edit Store"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal – Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {editingStore ? 'Edit Store' : 'Add New Store'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 rounded hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Store Name *"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="lat"
                  placeholder="Latitude"
                  value={formData.lat}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
                  step="any"
                />
                <input
                  type="number"
                  name="lng"
                  placeholder="Longitude"
                  value={formData.lng}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
                  step="any"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500"
              />

              {/* Owner dropdown */}
              <div>
                <label className="font-label block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5">
                  Store Owner {users.length === 0 && <span className="text-amber-500">(no store owners found)</span>}
                </label>
                <select
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Select a store owner</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || 'Unnamed'} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
              >
                {submitting ? (editingStore ? 'Updating…' : 'Creating…') : editingStore ? 'Update Store' : 'Create Store'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;