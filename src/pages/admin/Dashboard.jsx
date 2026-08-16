import { useEffect, useState } from 'react';
import { Store, Pill, AlertCircle, Users } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';

// Dummy data – will be replaced with API calls
const dummyStats = {
  totalStores: 245,
  totalMedicines: 1278,
  totalComplaints: 89,
  pendingComplaints: 23,
  totalUsers: 567,
};

const Dashboard = () => {
  const [stats, setStats] = useState(dummyStats);

  // In future: fetch from /api/admin/dashboard
  useEffect(() => {
    // setStats(await adminAPI.getDashboard());
  }, []);

  const statItems = [
    { title: 'Total Stores', value: stats.totalStores, icon: Store, color: 'bg-teal-500' },
    { title: 'Total Medicines', value: stats.totalMedicines, icon: Pill, color: 'bg-blue-500' },
    { title: 'Total Complaints', value: stats.totalComplaints, icon: AlertCircle, color: 'bg-yellow-500' },
    { title: 'Pending Complaints', value: stats.pendingComplaints, icon: AlertCircle, color: 'bg-red-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statItems.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Recent Complaints</h3>
          <ul className="mt-4 space-y-2">
            <li className="flex justify-between text-sm">
              <span>Paracetamol shortage at City Pharmacy</span>
              <span className="text-red-500">Pending</span>
            </li>
            <li className="flex justify-between text-sm">
              <span>Price hike on Insulin at MedPlus</span>
              <span className="text-yellow-500">Under review</span>
            </li>
            <li className="flex justify-between text-sm">
              <span>Amoxicillin out of stock at HealthCare Store</span>
              <span className="text-green-500">Resolved</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold text-gray-700">Top Shortage Hotspots</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>🔴 Mumbai Central – 12 complaints</li>
            <li>🟠 Delhi NCR – 9 complaints</li>
            <li>🟡 Bangalore South – 7 complaints</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;