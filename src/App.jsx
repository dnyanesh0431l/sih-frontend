import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';           // We'll create later
import Register from './pages/Register';     // We'll create later
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import StoreManagement from './pages/admin/StoreManagement';
import MedicineCatalog from './pages/admin/MedicineCatalog';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import ShortageHeatmap from './pages/admin/ShortageHeatmap';
import PriceAnomalyReport from './pages/admin/PriceAnomalyReport';
import Reports from './pages/admin/Reports';
import UserManagement from './pages/admin/UserManagement';
import Profile from './pages/admin/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes (nested with layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="stores" element={<StoreManagement />} />
          <Route path="medicines" element={<MedicineCatalog />} />
          <Route path="complaints" element={<ComplaintManagement />} />
          <Route path="heatmap" element={<ShortageHeatmap />} />
          <Route path="price-anomalies" element={<PriceAnomalyReport />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;