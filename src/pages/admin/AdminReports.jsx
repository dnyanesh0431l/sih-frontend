import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
  FileBarChart,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  BarChart3,
  PieChart,
} from 'lucide-react';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const summaryCards = [
    { label: 'Total Complaints', value: stats?.totalComplaints || 0, icon: FileText, color: 'text-blue-600' },
    { label: 'Pending', value: stats?.pendingComplaints || 0, icon: Clock, color: 'text-yellow-600' },
    { 
      label: 'Shortages', 
      value: stats?.shortageHotspots?.reduce((sum, h) => sum + h.complaintCount, 0) || 0, 
      icon: AlertTriangle, 
      color: 'text-red-600' 
    },
    { 
      label: 'Price Issues', 
      value: stats?.priceAnomalies?.reduce((sum, h) => sum + h.complaintCount, 0) || 0, 
      icon: TrendingUp, 
      color: 'text-orange-600' 
    },
  ];

  if (loading) {
    return <div className="text-center py-8 text-sm text-gray-500">Loading reports data…</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileBarChart className="w-6 h-6 text-teal-600" />
          Reports & Analytics
        </h1>
        <div className="flex items-center gap-2">
          <button className="bg-teal-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-teal-700 transition flex items-center gap-1">
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* Quick stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryCards.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-lg shadow p-3 flex items-center gap-3">
              <div className={`p-2 rounded-full bg-gray-50 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</div>
                <div className="text-xl font-bold text-gray-800">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report generation */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-teal-600" />
          Generate Reports
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Download comprehensive reports for analysis and policy making.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex items-center gap-2 text-sm">
            <FileSpreadsheet className="w-4 h-4" />
            Complaint Report (PDF)
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm">
            <FileSpreadsheet className="w-4 h-4" />
            Inventory Report (CSV)
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm">
            <BarChart3 className="w-4 h-4" />
            City‑wise Summary
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
          <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
            Coming soon
          </span>
          Full reports with detailed breakdowns by city, medicine, and store will be available.
        </div>
      </div>
    </div>
  );
};

export default AdminReports;