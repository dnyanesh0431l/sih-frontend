import {
  AlertTriangle,
  Clock,
  Loader,
  LogOut,
  MapPin,
  Package,
  Search,
  User,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintData, setComplaintData] = useState({
    medicineId: "",
    storeId: "",
    type: "SHORTAGE",
    description: "",
  });
  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);
  const [locationState, setLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | found | error
  const [locationError, setLocationError] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userState, setUserState] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Get user location with reverse geocoding
  useEffect(() => {
    setLocationStatus("loading");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
          setLocationStatus("found");
          setLocationError("");

          // Reverse geocode to get city/state
          try {
            const geoRes = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            );
            const address = geoRes.data.address;
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.hamlet ||
              "";
            const state = address.state || "";
            setUserCity(city);
            setUserState(state);
          } catch (geoErr) {
            console.warn("Reverse geocoding failed:", geoErr);
            setUserCity("Unknown");
            setUserState("");
          }
        },
        (err) => {
          setLocationStatus("error");
          let msg = "Unable to get location. ";
          if (err.code === 1)
            msg += "Please allow location access in your browser.";
          else if (err.code === 2)
            msg += "Location unavailable. Please try again.";
          else if (err.code === 3) msg += "Location request timed out.";
          else msg += "Please enable GPS.";
          setLocationError(msg);
          console.error("Geolocation error:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    } else {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch patient's complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("/complaints/my");
        setMyComplaints(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch complaints", err);
      } finally {
        setLoadingComplaints(false);
      }
    };
    fetchComplaints();
  }, []);

  // Auto‑search if a query param is present AND location is available
  useEffect(() => {
    if (initialSearch && locationState.lat) {
      performSearch(initialSearch);
    }
  }, [initialSearch, locationState.lat]);

  // Fetch medicines and stores for complaint modal
  useEffect(() => {
    if (showComplaintModal) {
      const fetchData = async () => {
        try {
          const [medRes, storeRes] = await Promise.all([
            axios.get("/medicines"),
            axios.get("/stores"),
          ]);
          setMedicines(medRes.data.data || []);
          setStores(storeRes.data.data || []);
        } catch (err) {
          console.error("Failed to fetch data for modal", err);
        }
      };
      fetchData();
    }
  }, [showComplaintModal]);

  const performSearch = async (query) => {
    if (!query.trim() || !locationState.lat) {
      if (!locationState.lat) {
        alert("Location not available. Please allow location access.");
      }
      return;
    }
    setLoadingSearch(true);
    try {
      const res = await axios.get(
        `/search/nearby?medicine=${encodeURIComponent(query)}&lat=${locationState.lat}&lng=${locationState.lng}&radius=10`,
      );
      let results = res.data.data || [];
      // Sort by distance (ascending) – backend should already do this, but ensure
      results.sort((a, b) => a.distance - b.distance);
      // Limit to 10 nearest stores
      results = results.slice(0, 10);
      setSearchResults(results);
    } catch (err) {
      console.error("Search failed", err);
      alert("Search failed. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(searchTerm);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/complaints", {
        ...complaintData,
        lat: locationState.lat,
        lng: locationState.lng,
      });
      setShowComplaintModal(false);
      setComplaintData({
        medicineId: "",
        storeId: "",
        type: "SHORTAGE",
        description: "",
      });
      const res = await axios.get("/complaints/my");
      setMyComplaints(res.data.data || []);
    } catch (err) {
      alert(
        "Failed to submit complaint: " +
          (err.response?.data?.error || "Unknown error"),
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    REVIEWED: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  // Format location display
  const locationDisplay = () => {
    if (userCity && userState) return `${userCity}, ${userState}`;
    if (userCity) return userCity;
    if (userState) return userState;
    if (locationState.lat)
      return `${locationState.lat.toFixed(4)}, ${locationState.lng.toFixed(4)}`;
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-teal-600" />
          <h1 className="text-lg font-semibold text-gray-800">
            Patient Dashboard
          </h1>
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
        {/* Search Section with Location Display */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for medicine (e.g., Paracetamol)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loadingSearch || locationStatus !== "found"}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loadingSearch ? "Searching…" : "Find Nearby"}
              <MapPin className="w-4 h-4" />
            </button>
          </div>

          {/* Location Status – displayed below the search bar */}
          <div className="mt-3 flex items-center gap-3 text-xs border-t border-gray-100 pt-3">
            <span className="font-medium text-gray-500">📍 Location:</span>
            {locationStatus === "loading" && (
              <span className="flex items-center gap-1 text-amber-600">
                <Loader className="w-3.5 h-3.5 animate-spin" />
                Fetching location…
              </span>
            )}
            {locationStatus === "found" && (
              <span className="flex items-center gap-1 text-teal-600">
                <Wifi className="w-3.5 h-3.5" />
                {locationDisplay() ||
                  `${locationState.lat.toFixed(4)}, ${locationState.lng.toFixed(4)}`}
                <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                  Live
                </span>
              </span>
            )}
            {locationStatus === "error" && (
              <span className="flex items-center gap-1 text-red-600">
                <WifiOff className="w-3.5 h-3.5" />
                {locationError || "Location unavailable"}
              </span>
            )}
            {locationStatus === "idle" && (
              <span className="text-gray-400">Waiting for location…</span>
            )}
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  setLocationStatus("loading");
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                      });
                      setLocationStatus("found");
                      setLocationError("");
                    },
                    (err) => {
                      setLocationStatus("error");
                      setLocationError("Unable to refresh location.");
                    },
                  );
                }
              }}
              className="text-teal-600 hover:text-teal-800 text-xs font-medium ml-auto"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Search Results */}
        {loadingSearch ? (
          <div className="text-center py-8 text-sm text-gray-500">
            Searching for medicines…
          </div>
        ) : searchResults.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Nearby Stores ({searchResults.length})
              </h3>
              <span className="text-xs text-gray-500">Closest first</span>
            </div>
            <ul className="divide-y divide-gray-100 text-sm">
              {searchResults.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-3 hover:bg-gray-50 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800">
                      {item.store.name}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{item.medicine.name}</span>
                      <span className="bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-full text-[10px]">
                        {item.quantity} in stock
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {item.store.city}, {item.store.state} ·{" "}
                      {item.distance.toFixed(1)} km
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-teal-700">
                      ₹{parseFloat(item.price).toFixed(2)}
                    </div>
                    {item.quantity <= item.reorderLevel && (
                      <span className="text-xs text-red-500 flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> Low stock
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : searchTerm && !loadingSearch ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 text-sm">
            No results found for "{searchTerm}".
          </div>
        ) : null}

        {/* Quick Action: Report Complaint */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-700">
              Need to report an issue?
            </h3>
            <p className="text-xs text-gray-500">
              Report shortage or unfair pricing.
            </p>
          </div>
          <button
            onClick={() => setShowComplaintModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" /> File Complaint
          </button>
        </div>

        {/* My Complaints */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" /> My Complaints
            </h3>
            <span className="text-xs text-gray-500">{myComplaints.length}</span>
          </div>
          {loadingComplaints ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading…
            </div>
          ) : myComplaints.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              You haven't filed any complaints yet.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm">
              {myComplaints.map((c) => (
                <li
                  key={c.id}
                  className="px-4 py-2 hover:bg-gray-50 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {c.medicine?.name || "Unknown"}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${statusColors[c.status] || "bg-gray-100"}`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.type} · {c.store?.name || "—"} · {c.description || ""}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">File a Complaint</h3>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitComplaint} className="p-4 space-y-3">
              <select
                required
                value={complaintData.medicineId}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    medicineId: e.target.value,
                  })
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
              <select
                required
                value={complaintData.storeId}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    storeId: e.target.value,
                  })
                }
                className="w-full p-2 border rounded text-sm"
              >
                <option value="">Select Store (if applicable)</option>
                <option value="">Not specific</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <select
                required
                value={complaintData.type}
                onChange={(e) =>
                  setComplaintData({ ...complaintData, type: e.target.value })
                }
                className="w-full p-2 border rounded text-sm"
              >
                <option value="SHORTAGE">Shortage</option>
                <option value="PRICE">Price Issue</option>
              </select>
              <textarea
                placeholder="Describe the issue"
                value={complaintData.description}
                onChange={(e) =>
                  setComplaintData({
                    ...complaintData,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded text-sm"
                rows="2"
              />
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Submit Complaint
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
