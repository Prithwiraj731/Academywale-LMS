import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Live faculty list
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculties`)
      .then(res => res.json())
      .then(data => setFaculties(data.faculties || []));
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenu(false);
    navigate('/');
  };

  return (
    <>
      {/* Main navigation */}
      <nav className="bg-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo only */}
            <div className="flex items-center">
              <img src="/academywale.svg" alt="Academywale Logo" className="h-16 w-auto object-contain" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link to="/" className="text-gray-800 hover:text-primary transition text-sm xl:text-base">Home</Link>
              <div className="relative group">
                <button className="text-gray-800 hover:text-primary transition flex items-center font-bold text-sm xl:text-base">
                  CA
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-3">
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
                  <div className="p-3">
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
            </div>

            {/* Account/Profile Button */}
            <div className="flex items-center space-x-2 sm:space-x-4 relative">
              {!user ? (
                <Link to="/login" className="px-4 sm:px-8 py-2 sm:py-3 bg-[#20b2aa] text-white font-bold rounded-2xl shadow-lg hover:bg-[#17817a] transition-all text-sm sm:text-lg">
                  Account
                </Link>
              ) : (
                <div className="relative">
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-400 hover:shadow-lg transition focus:outline-none"
                    onClick={() => setProfileMenu((v) => !v)}
                  >
                    <span className="text-blue-700 font-bold text-sm sm:text-lg uppercase">
                      {user.name ? user.name[0] : 'U'}
                    </span>
                  </button>
                  {profileMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setProfileMenu(false)}
                      >
                        Dashboard
                      </Link>
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
            <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
              <div className="space-y-3">
                <Link 
                  to="/" 
                  className="block py-2 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <div className="space-y-2">
                  <div className="font-semibold text-primary py-2 px-2">CA Courses</div>
                  <Link 
                    to="/courses/ca/foundation" 
                    className="block py-2 pl-6 pr-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CA Foundation
                  </Link>
                  <Link 
                    to="/courses/ca/inter" 
                    className="block py-2 pl-6 pr-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CA Inter
                  </Link>
                  <Link 
                    to="/courses/ca/final" 
                    className="block py-2 pl-6 pr-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CA Final
                  </Link>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-primary py-2 px-2">CMA Courses</div>
                  <Link 
                    to="/courses/cma/foundation" 
                    className="block py-2 pl-6 pr-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CMA Foundation
                  </Link>
                  <Link 
                    to="/courses/cma/inter" 
                    className="block py-2 pl-6 pr-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CMA Inter
                  </Link>
                  <Link 
                    to="/courses/cma/final" 
                    className="block py-2 pl-6 pr-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CMA Final
                  </Link>
                </div>
                <a 
                  href="#" 
                  className="block py-2 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                >
                  Test Series
                </a>
                <Link 
                  to="/faculties" 
                  className="block py-2 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Faculties
                </Link>
                <Link 
                  to="/about" 
                  className="block py-2 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="block py-2 px-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
