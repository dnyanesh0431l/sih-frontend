import React from 'react';
import { User } from 'lucide-react';

const Header = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {user?.role || 'ADMIN'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User size={16} />
        <span>{user?.name || 'Admin'}</span>
      </div>
    </header>
  );
};

export default Header;