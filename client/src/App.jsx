import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';

// Import your pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import CoursesPage from './pages/CoursesPage';
import FacultiesPage from './pages/FacultiesPage';
import FacultyDetailPage from './pages/FacultyDetailPage';
import InstitutesPage from './pages/InstitutesPage';
import InstituteDetailPage from './pages/InstituteDetailPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CAFoundationPapers from './pages/CAFoundationPapers';
import CAInterPapers from './pages/CAInterPapers';
import CAFinalPapers from './pages/CAFinalPapers';
import CMAFoundationPapers from './pages/CMAFoundationPapers';
import CMAInterPapers from './pages/CMAInterPapers';
import CMAFinalPapers from './pages/CMAFinalPapers';

const App = () => {
  const cld = new Cloudinary({ cloud: { cloudName: 'drlqhsjgm' } });

  // This is the sample image from the Cloudinary example
  const img = cld
    .image('cld-sample-5')
    .format('auto')
    .quality('auto')
    .resize(auto().gravity(autoGravity()).width(500).height(500));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/faculties" element={<FacultiesPage />} />
        <Route path="/faculties/:slug" element={<FacultyDetailPage />} />
        <Route path="/institutes" element={<InstitutesPage />} />
        <Route path="/institutes/:slug" element={<InstituteDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/ca-foundation-papers" element={<CAFoundationPapers />} />
        <Route path="/ca-inter-papers" element={<CAInterPapers />} />
        <Route path="/ca-final-papers" element={<CAFinalPapers />} />
        <Route path="/cma-foundation-papers" element={<CMAFoundationPapers />} />
        <Route path="/cma-inter-papers" element={<CMAInterPapers />} />
        <Route path="/cma-final-papers" element={<CMAFinalPapers />} />

        {/* This is the route for the Cloudinary example you provided */}
        <Route path="/cloudinary-example" element={<AdvancedImage cldImg={img} />} />
      </Routes>
    </Router>
  );
};

export default App;