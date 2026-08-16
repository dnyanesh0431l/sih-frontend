import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import {
  Search,
  CheckCircle,
  PlusCircle,
  Clock,
  AlertCircle,
  MapPin,
  User,
  Store,
  FileText,      // ✅ added
} from 'lucide-react';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  // Fetch complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`/complaints?status=${filter || ''}`);
      setComplaints(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply client-side search
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredComplaints(complaints);
    } else {
      const lower = search.toLowerCase();
      const filtered = complaints.filter(
        (c) =>
          c.medicine?.name?.toLowerCase().includes(lower) ||
          c.store?.name?.toLowerCase().includes(lower) ||
          c.patient?.name?.toLowerCase().includes(lower) ||
          c.description?.toLowerCase().includes(lower)
      );
      setFilteredComplaints(filtered);
    }
  }, [search, complaints]);

  // Refetch when filter changes
  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const handleResolve = async (id) => {
    const note = prompt('Add a resolution note (optional):');
    try {
      await axios.put(`/complaints/${id}/resolve`, { note });
      fetchComplaints();
    } catch (err) {
      alert('Failed to resolve complaint.');
    }
  };

  const handleAddNote = async (id) => {
    const content = prompt('Enter your note:');
    if (content) {
      try {
        await axios.post(`/complaints/${id}/notes`, { content });
        fetchComplaints();
      } catch {
        alert('Failed to add note.');
      }
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    REVIEWED: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    PENDING: Clock,
    REVIEWED: AlertCircle,
    RESOLVED: CheckCircle,
    REJECTED: AlertCircle,
  };

  return (
    <div className="space-y-4">
      {/* Header + Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-teal-600" />
          Complaints
          <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {filteredComplaints.length}
          </span>
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {/* Filter dropdown */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-sm text-gray-500">Loading complaints…</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500 text-sm">
          No complaints found.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredComplaints.map((c) => {
                const StatusIcon = statusIcons[c.status] || Clock;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        c.type === 'SHORTAGE' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-800">
                      {c.medicine?.name || '—'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                      <div className="flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-gray-400" />
                        {c.store?.name || '—'}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {c.patient?.name || 'Anonymous'}
                      </div>
                    </td>
                    <td className="px-3 py-2 max-w-[150px] truncate text-gray-600" title={c.description || ''}>
                      {c.description || '—'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {c.store?.city || '—'}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${statusColors[c.status] || 'bg-gray-100 text-gray-800'}`}>
                        <StatusIcon className="w-3 h-3" />
                        {c.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                        {c.adminNotes?.length || 0}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        {c.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleResolve(c.id)}
                            className="p-1.5 rounded hover:bg-teal-50 text-teal-600 transition-colors"
                            title="Resolve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleAddNote(c.id)}
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
                          title="Add note"
                        >
                          <PlusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;