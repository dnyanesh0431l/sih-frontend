import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "./components/public/Footer";
import PublicHeader from "./components/public/PublicHeader";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminReports from "./pages/admin/AdminReports";
import AdminStores from "./pages/admin/AdminStores";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/patient/PatientDashboard";
import LandingPage from "./pages/public/LandingPage";
import StoreDashboard from "./pages/store/StoreDashboard";

// Guards
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const RoleGuard = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <>
              <PublicHeader />
              <LandingPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PublicHeader />
              <Login />
              <Footer />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <PublicHeader />
              <Register />
              <Footer />
            </>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleGuard role="ADMIN">
                <AdminLayout />
              </RoleGuard>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="complaints" element={<AdminComplaints />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="stores" element={<AdminStores />} />
        </Route>

        {/* Store Owner */}
        <Route
          path="/store/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard role="STORE_OWNER">
                <StoreDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        {/* Patient */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute>
              <RoleGuard role="PATIENT">
                <PatientDashboard />
              </RoleGuard>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
