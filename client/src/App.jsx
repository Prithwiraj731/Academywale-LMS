import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import LoadingOverlay from './components/common/LoadingOverlay';
import { useEffect, useState } from 'react';
import FacultiesPage from './pages/FacultiesPage.jsx';
import FacultyDetailPage from './pages/FacultyDetailPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy';
import StudentDashboard from './pages/StudentDashboard';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import CoursesPage from './pages/CoursesPage';
import InstitutesPage from './pages/InstitutesPage';
import InstituteDetailPage from './pages/InstituteDetailPage.jsx';

import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from '@clerk/clerk-react';

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <LoadingOverlay show={loading} />
      <header className="p-4 flex justify-end space-x-4 bg-gray-100">
        <SignedOut>
          {/* Removed SignIn component to prevent sign-in box showing by default */}
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faculties" element={<FacultiesPage />} />
        <Route path="/faculties/:slug" element={<FacultyDetailPage />} />
        <Route path="/payment/:slug/:courseIndex" element={<PaymentPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route
          path="/login"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <SignIn />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <SignUp />
            </div>
          }
        />
        <Route path="/dashboard" element={isSignedIn ? <StudentDashboard /> : <Navigate to="/login" />} />
        <Route path="/student-dashboard" element={isSignedIn ? <StudentDashboard /> : <Navigate to="/login" />} />
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
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
