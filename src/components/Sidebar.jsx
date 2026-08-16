import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Pill,
  AlertCircle,
  Map,
  TrendingUp,
  FileText,
  Users,
  UserCircle,
  LogOut,
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/stores', icon: Store, label: 'Stores' },
    { to: '/admin/medicines', icon: Pill, label: 'Medicines' },
    { to: '/admin/complaints', icon: AlertCircle, label: 'Complaints' },
    { to: '/admin/heatmap', icon: Map, label: 'Shortage Heatmap' },
    { to: '/admin/price-anomalies', icon: TrendingUp, label: 'Price Anomalies' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/profile', icon: UserCircle, label: 'Profile' },
  ];

  return (
    <aside className="bg-teal-800 text-white w-64 flex-shrink-0 flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-teal-700">
        🏥 MediTrack <span className="text-sm font-normal block">Admin Panel</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                    isActive
                      ? 'bg-teal-700 text-white border-r-4 border-teal-300'
                      : 'hover:bg-teal-700/50'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-teal-700">
        <button
          onClick={() => console.log('Logout')}
          className="flex items-center gap-3 text-sm hover:text-teal-200 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;