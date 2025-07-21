import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import LoadingOverlay from './components/common/LoadingOverlay';
import { useEffect, useState } from 'react';
import FacultiesPage from './pages/FacultiesPage.jsx';
import FacultyDetailPage from './pages/FacultyDetailPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import CoursesPage from './pages/CoursesPage';
import InstitutesPage from './pages/InstitutesPage';
import InstituteDetailPage from './pages/InstituteDetailPage.jsx';


function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <LoadingOverlay show={loading} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faculties" element={<FacultiesPage />} />
        <Route path="/faculties/:slug" element={<FacultyDetailPage />} />
        <Route path="/payment/:slug/:courseIndex" element={<PaymentPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={user ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/student-dashboard" element={user ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/courses/:type" element={<CoursesPage />} />
        <Route path="/courses/:type/:level" element={<CoursesPage />} />
        <Route path="/institutes" element={<InstitutesPage />} />
        <Route path="/institutes/:slug" element={<InstituteDetailPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
