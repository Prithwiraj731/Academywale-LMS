import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [isCaDropdownOpen, setIsCaDropdownOpen] = useState(false);
  const [isCmaDropdownOpen, setIsCmaDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-menu-container')) {
        setProfileMenu(false);
      };
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live faculty list
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculties`)
      .then(res => res.json())
      .then(data => setFaculties(data.faculties || []));
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileMenu(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col">
      <>
      {/* Top contact bar */}
      <div className="bg-gray-900 text-white text-xs sm:text-sm w-full z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 sm:space-x-6 mb-2 sm:mb-0">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-[#20b2aa]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>+91 9693320108</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-[#20b2aa]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>support@academywale.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://wa.me/+919693320108" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition">
              <svg className="w-4 h-4" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#25D366"/>
                <path d="M21.6 18.7c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.6-.3z" fill="#fff"/>
                <path d="M16 6.2c-5.4 0-9.8 4.4-9.8 9.8 0 1.7.4 3.3 1.2 4.7l-1.3 4.7 4.8-1.3c1.3.7 2.8 1.1 4.3 1.1 5.4 0 9.8-4.4 9.8-9.8S21.4 6.2 16 6.2zm0 17.6c-1.4 0-2.7-.4-3.9-1.1l-.3-.2-2.8.7.7-2.7-.2-.3c-.7-1.2-1.1-2.6-1.1-4 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2z" fill="#fff"/>
              </svg>
            </a>
            <a href="https://t.me/CMAspirants_01" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
              <svg className="w-4 h-4" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#229ED9"/>
                <path d="M23.707 9.293a1 1 0 0 0-1.02-.242l-13 5a1 1 0 0 0 .09 1.89l3.44 1.15 1.32 4.41a1 1 0 0 0 1.77.27l2.02-2.53 3.36 2.48a1 1 0 0 0 1.58-.57l2-9a1 1 0 0 0-.56-1.18zm-2.13 2.14-7.19 4.7a.5.5 0 0 0 .11.89l2.13.71a.5.5 0 0 1 .31.31l.66 2.2a.5.5 0 0 0 .89.13l1.01-1.27a.5.5 0 0 1 .7-.09l1.77 1.31a.5.5 0 0 0 .8-.29l1.5-6.75a.5.5 0 0 0-.74-.55z" fill="#fff"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/sourav-pathak-30b385279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.562 2.838-1.562 3.036 0 3.6 2 3.6 4.59v5.605z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Main navigation */}
      <nav className="bg-white z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-50">
          <div className="flex items-center justify-between h-16">
            {/* Logo only */}
            <div className="flex-shrink-0">
              <img src="/academywale.svg" alt="Academywale Logo" className="h-8 sm:h-16 w-auto object-contain" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link to="/" className="text-gray-800 hover:text-primary transition text-sm xl:text-base">Home</Link>
              <div className="relative group">
                <button className="text-gray-800 hover:text-primary transition flex items-center font-bold text-sm xl:text-base">
                  CA
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <div className="space-y-1 text-sm">
                      <Link to="/courses/ca/foundation" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Foundation</Link>
                      <Link to="/courses/ca/inter" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Inter</Link>
                      <Link to="/courses/ca/final" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Final</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-800 hover:text-primary transition flex items-center font-bold text-sm xl:text-base">
                  CMA
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <div className="space-y-1 text-sm">
                      <Link to="/courses/cma/foundation" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CMA Foundation</Link>
                      <Link to="/courses/cma/inter" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CMA Inter</Link>
                      <Link to="/courses/cma/final" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CMA Final</Link>
                    </div>
                  </div>
                </div>
              </div>
              <a href="#" className="text-gray-800 hover:text-primary transition text-sm xl:text-base">Test Series</a>
              <div className="relative group">
                <button className="text-gray-800 hover:text-primary transition flex items-center font-bold text-sm xl:text-base">
                  Faculties
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {faculties.map(fac => {
                      const name = fac.firstName + (fac.lastName ? ' ' + fac.lastName : '');
                      return (
                        <Link
                          key={fac.slug}
                          to={`/faculties/${fac.slug}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded"
                        >
                          {name.replace(/_/g, ' ')}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Link to="/about" className="text-gray-800 hover:text-primary transition text-sm xl:text-base">About</Link>
              <Link to="/contact" className="text-gray-800 hover:text-primary transition text-sm xl:text-base">Contact</Link>
              {isAuthenticated && (
                <Link
                  to="/student-dashboard"
                  className="px-6 py-3 bg-[#20b2aa] text-white font-bold rounded-xl shadow-lg hover:bg-[#17817a] transition-all text-lg"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Account/Profile Button */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-sm bg-[#20b2aa] text-white font-bold rounded-lg shadow-md hover:bg-[#17817a] transition-all sm:px-6 sm:py-2.5 sm:text-base sm:rounded-xl"
                >
                  Login
                </button>
              ) : (
                <div className="relative profile-menu-container flex items-center gap-2">
                  <Link
                    to="/student-dashboard"
                    className="flex items-center px-3 py-1.5 text-sm bg-[#20b2aa] text-white font-bold rounded-lg shadow-md hover:bg-[#17817a] transition-all sm:flex lg:hidden"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      Dashboard
                    </svg>
                  </Link>
                  <button
                    className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 hover:shadow-lg transition focus:outline-none sm:w-10 sm:h-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileMenu((v) => !v);
                    }}
                  >
                    <span className="text-blue-700 font-bold text-sm uppercase sm:text-base">
                      {user.firstName?.[0] || user.name?.[0] || 'U'}
                    </span>
                  </button>
                  {profileMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden py-3 border-t border-gray-200 bg-white">
              <div className="space-y-1">
                <Link 
                  to="/" 
                  className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <div>
                  <button
                    onClick={() => setIsCaDropdownOpen(!isCaDropdownOpen)}
                    className="w-full flex justify-between items-center font-semibold text-primary py-2 px-4 focus:outline-none"
                  >
                    CA Courses
                    <svg
                      className={`w-5 h-5 ml-1 transform transition-transform duration-200 ${isCaDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isCaDropdownOpen && (
                    <div className="pl-4">
                      <Link to="/courses/ca/foundation" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Foundation</Link>
                      <Link to="/courses/ca/inter" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Inter</Link>
                      <Link to="/courses/ca/final" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Final</Link>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => setIsCmaDropdownOpen(!isCmaDropdownOpen)}
                    className="w-full flex justify-between items-center font-semibold text-primary py-2 px-4 focus:outline-none"
                  >
                    CMA Courses
                    <svg
                      className={`w-5 h-5 ml-1 transform transition-transform duration-200 ${isCmaDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isCmaDropdownOpen && (
                    <div className="pl-4">
                      <Link 
                        to="/cma/foundation-papers" 
                        className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        CMA Foundation
                      </Link>
                      <Link 
                        to="/cma/inter-papers" 
                        className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        CMA Inter</Link>
                      <Link 
                        to="/cma/final-papers" 
                        className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        CMA Final
                      </Link>
                    </div>
                  )}
                </div>
                <a href="#" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition">
                  Test Series
                </a>
                <Link to="/faculties" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition">
                  All Faculties
                </Link>
                <Link to="/about" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition">
                  About
                </Link>
                <Link to="/contact" className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition">
                  Contact
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/dashboard"
                    className="block py-2 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {!isAuthenticated && (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left mt-2 py-2 px-4 bg-[#20b2aa] text-white font-bold rounded-lg shadow-lg hover:bg-[#17817a] transition-all"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
    </div>
  );
}