import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicHeader from './components/public/PublicHeader';
import Footer from './components/public/Footer';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminComplaints from './pages/admin/AdminComplaints';
import AdminReports from './pages/admin/AdminReports';
import AdminStores from './pages/admin/AdminStores';

// Simple guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// Role guard – only ADMIN
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<><PublicHeader /><LandingPage /><Footer /></>} />
        <Route path="/login" element={<><PublicHeader /><Login /><Footer /></>} />
        <Route path="/register" element={<><PublicHeader /><div>Register</div><Footer /></>} />

        {/* Admin – wrapped in both guards */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="stores" element={<AdminStores />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;