import { useState } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const dummyStores = [
  { id: 1, name: 'City Pharmacy', owner: 'Rajesh Kumar', location: 'Mumbai', status: 'verified', medicines: 450 },
  { id: 2, name: 'MedPlus', owner: 'Priya Sharma', location: 'Delhi', status: 'pending', medicines: 320 },
  { id: 3, name: 'HealthCare Store', owner: 'Amit Patel', location: 'Bangalore', status: 'verified', medicines: 210 },
  { id: 4, name: 'Family Medical', owner: 'Sneha Reddy', location: 'Hyderabad', status: 'suspended', medicines: 150 },
];

const StoreManagement = () => {
  const [stores, setStores] = useState(dummyStores);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Store Management</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicines</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.owner}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.medicines}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      store.status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : store.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {store.status.charAt(0).toUpperCase() + store.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                  <button className="text-teal-600 hover:text-teal-900"><Eye size={18} /></button>
                  <button className="text-green-600 hover:text-green-900"><CheckCircle size={18} /></button>
                  <button className="text-red-600 hover:text-red-900"><XCircle size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreManagement;