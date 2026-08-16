import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicHeader from './components/public/PublicHeader';
import Footer from './components/public/Footer';
import LandingPage from './pages/public/LandingPage';
import Login from './pages/Login';          // we'll create later
// import Register from './pages/Register';    // we'll create later
// import AdminLayout from './pages/admin/AdminLayout';
// import Dashboard from './pages/admin/Dashboard';
// ... other admin imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with header/footer */}
        <Route path="/" element={
          <>
            <PublicHeader />
            <LandingPage />
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <PublicHeader />
            <Login />
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <PublicHeader />
            {/* <Register /> */}
            <Footer />
          </>
        } />

        {/* Admin routes (no public header/footer) */}
        {/* <Route path="/admin" element={<AdminLayout />}> */}
          {/* <Route index element={<Navigate to="/admin/dashboard" replace />} /> */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          {/* ... other admin routes */}
        {/* </Route> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;