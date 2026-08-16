import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../utils/axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cityData, setCityData] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch dashboard stats
        const [statsRes, complaintsRes] = await Promise.all([
          axios.get('/admin/dashboard'),
          axios.get('/complaints?limit=5&sort=createdAt:desc')
        ]);

        setStats(statsRes.data.data);
        setRecentComplaints(complaintsRes.data.data || []);

        // Fetch all complaints for city-wise analysis
        const allComplaints = await axios.get('/complaints?limit=100');
        const complaints = allComplaints.data.data || [];
        const cityMap = {};
        complaints.forEach(c => {
          const city = c.store?.city || 'Unknown';
          if (!cityMap[city]) cityMap[city] = { total: 0, shortages: 0, price: 0, meds: new Set() };
          cityMap[city].total += 1;
          if (c.type === 'SHORTAGE') cityMap[city].shortages += 1;
          else cityMap[city].price += 1;
          if (c.medicine?.name) cityMap[city].meds.add(c.medicine.name);
        });
        const sorted = Object.entries(cityMap)
          .map(([city, d]) => ({ city, ...d, meds: Array.from(d.meds).slice(0, 3) }))
          .sort((a, b) => b.total - a.total);
        setCityData(sorted);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) return <div className="text-center py-8 text-sm text-gray-500">Loading dashboard…</div>;
  if (!stats) return <div className="text-red-600 text-sm">Error loading data.</div>;

  const statusColor = (status) => {
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REVIEWED: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return map[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Top stats – compact horizontal row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Stores', value: stats.totalStores, icon: '🏪' },
          { label: 'Medicines', value: stats.totalMedicines, icon: '💊' },
          { label: 'Complaints', value: stats.totalComplaints, icon: '📝' },
          { label: 'Pending', value: stats.pendingComplaints, icon: '⏳', highlight: true }
        ].map((item) => (
          <div key={item.label} className="bg-white rounded shadow p-3 flex items-center justify-between border-l-4 border-teal-500">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</div>
              <div className={`text-xl font-bold ${item.highlight ? 'text-red-600' : 'text-gray-800'}`}>{item.value}</div>
            </div>
            <div className="text-2xl opacity-60">{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Two‑column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* City hotspots – compact table */}
        <div className="lg:col-span-2 bg-white rounded shadow overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">🔥 Shortage Hotspots (by City)</h3>
            <span className="text-xs text-gray-500">{cityData.length} cities</span>
          </div>
          {cityData.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No complaints yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Shortage</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Top Medicines</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cityData.map((city) => (
                    <tr key={city.city} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-800">{city.city}</td>
                      <td className="px-3 py-2 text-center text-gray-700">{city.total}</td>
                      <td className="px-3 py-2 text-center text-red-600">{city.shortages}</td>
                      <td className="px-3 py-2 text-center text-orange-600">{city.price}</td>
                      <td className="px-3 py-2 text-xs text-gray-600 truncate max-w-[120px]">
                        {city.meds.length > 0 ? city.meds.join(', ') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent complaints – compact list */}
        <div className="bg-white rounded shadow overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">🔄 Recent Complaints</h3>
            <Link to="/admin/complaints" className="text-xs text-teal-600 hover:underline">View all</Link>
          </div>
          {recentComplaints.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">No recent complaints.</div>
          ) : (
            <ul className="divide-y divide-gray-100 text-sm max-h-[300px] overflow-y-auto">
              {recentComplaints.map((c) => (
                <li key={c.id} className="px-4 py-2 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800 truncate">{c.medicine?.name || 'Unknown'}</span>
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${statusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {c.store?.name || '—'} · {c.type}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Quick actions – now using Link */}
      <div className="bg-white rounded shadow p-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-500 mr-2">Quick:</span>
        <Link
          to="/admin/complaints"
          className="text-xs bg-teal-50 text-teal-700 px-3 py-1.5 rounded hover:bg-teal-100 transition"
        >
          View All Complaints
        </Link>
        <Link
          to="/admin/reports"
          className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-100 transition"
        >
          Generate Reports
        </Link>
        <Link
          to="/admin/stores"
          className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-100 transition"
        >
          Manage Stores
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;