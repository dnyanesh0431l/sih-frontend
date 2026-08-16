import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Store,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Menu,
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/complaints', label: 'Complaints', icon: FileText },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/stores', label: 'Stores', icon: Store },
  ];

  return (
    <aside
      className={`bg-teal-800 text-white flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-teal-700">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pharma Admin</h1>
            <p className="text-teal-300 text-xs">Government Dashboard</p>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-teal-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'hover:bg-teal-700/50 text-teal-100'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer – only show user and logout when expanded */}
      <div className={`p-4 border-t border-teal-700 text-teal-300 text-sm ${collapsed ? 'text-center' : ''}`}>
        {!collapsed ? (
          <>
            <div className="flex items-center gap-2 mb-2">
              <User size={16} />
              <span className="truncate">Admin</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 text-red-300 hover:text-red-100 transition-colors w-full"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="text-red-300 hover:text-red-100"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;