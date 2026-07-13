import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../api';
import { getAllFaculties } from '../../data/hardcodedFaculties';

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

  // Live faculty list (combined hardcoded & API faculties)
  const [faculties, setFaculties] = useState(getAllFaculties());
  useEffect(() => {
    fetch(`${API_URL}/api/faculties`)
      .then(res => res.json())
      .then(data => {
        const apiFaculties = data.faculties || [];
        if (apiFaculties.length > 0) {
          const hardcoded = getAllFaculties();
          const combined = [...hardcoded];
          apiFaculties.forEach(apiFac => {
            const apiSlug = apiFac.slug || `${apiFac.firstName}-${apiFac.lastName}`.toLowerCase().replace(/\s+/g, '-');
            const exists = hardcoded.some(h => h.slug === apiSlug);
            if (!exists) {
              combined.push({
                id: apiFac.id || apiFac._id,
                name: `${apiFac.firstName} ${apiFac.lastName || ''}`.trim(),
                slug: apiSlug,
                image: apiFac.imageUrl || apiFac.image,
                specialization: apiFac.teaches?.[0] || 'Faculty'
              });
            }
          });
          setFaculties(combined);
        }
      })
      .catch(err => console.error('Error loading API faculties in header:', err));
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
      <div className="bg-gray-900 text-white text-xs w-full z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-col xs:flex-row items-center space-y-1 xs:space-y-0 xs:space-x-3 sm:space-x-6 mb-1 sm:mb-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#20b2aa]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-xs sm:text-sm">+91 9693320108</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#20b2aa]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-xs sm:text-sm break-all">support@academywale.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <a href="https://wa.me/+919693320108" target="_blank" rel="noopener noreferrer" className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402.002 9.799-4.382 9.802-9.77.001-2.61-1.01-5.063-2.846-6.9C16.393 2.1 13.94 1.088 11.332 1.087 5.928 1.087 1.53 5.472 1.528 10.86c0 1.561.432 3.09 1.25 4.43l-.329 1.2.04-.017.067.11 1.706-1.127 1.037.615zM17.487 14.39c-.3-.15-1.774-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.493-1.78-1.668-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.925-2.235-.24-.58-.485-.503-.676-.513-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.025-.275.95-1.05 3.098-1.05 3.2 0 .1.1.225.25.4.15.175 1.83 2.795 4.43 3.92.617.267 1.1.425 1.475.545.62.195 1.18.168 1.625.102.495-.073 1.775-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.076-.125-.276-.2-.576-.35z"/>
              </svg>
            </a>
            <a href="https://t.me/CMAspirants_01" target="_blank" rel="noopener noreferrer" className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
              <svg className="w-3.5 h-3.5 text-white mr-[1px] mt-[0.5px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.78 18.65l.28-4.28 7.76-7.01c.34-.3-.07-.47-.52-.17L7.74 12.5 3.59 11.2c-.9-.28-.92-.9.19-1.33L20.1 3.5c.75-.28 1.4.17 1.15 1.16l-2.87 13.5c-.21.99-.8 1.24-1.63.78l-4.42-3.25-2.13 2.05c-.24.24-.44.44-.9.44z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/sourav-pathak-30b385279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition">
              <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Main navigation */}
      <nav className="bg-white z-40 shadow-md sticky top-0">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-1 sm:py-2 relative z-50">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo only */}
            <div className="flex-shrink-0">
              <img src="/academywale.svg" alt="Academywale Logo" className="h-8 sm:h-12 lg:h-16 w-auto object-contain" />
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
                      <Link to="/ca/foundation-papers" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Foundation</Link>
                      <Link to="/ca/inter-papers" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Inter</Link>
                      <Link to="/ca/final-papers" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CA Final</Link>
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
                      <Link to="/cma/foundation-papers" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CMA Foundation</Link>
                      <Link to="/cma/inter-papers" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CMA Inter</Link>
                      <Link to="/cma/final-papers" className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded">CMA Final</Link>
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
                      return (
                        <Link
                          key={fac.slug}
                          to={`/faculties/${fac.slug}`}
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded"
                        >
                          {fac.name}
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
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-gray-100 transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
            <div className="lg:hidden py-3 px-2 border-t border-gray-200 bg-white shadow-lg">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                <Link 
                  to="/" 
                  className="block py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏠 Home
                </Link>
                <div>
                  <button
                    onClick={() => setIsCaDropdownOpen(!isCaDropdownOpen)}
                    className="w-full flex justify-between items-center font-semibold text-primary py-3 px-4 focus:outline-none hover:bg-gray-50 rounded-lg transition"
                  >
                    📚 CA Courses
                    <svg
                      className={`w-5 h-5 ml-1 transform transition-transform duration-200 ${isCaDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isCaDropdownOpen && (
                    <div className="pl-4 space-y-1 bg-gray-50 rounded-lg py-2 mt-1">
                      <Link 
                        to="/ca/foundation-papers" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCaDropdownOpen(false);
                        }}
                      >
                        📝 CA Foundation
                      </Link>
                      <Link 
                        to="/ca/inter-papers" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCaDropdownOpen(false);
                        }}
                      >
                        📊 CA Inter
                      </Link>
                      <Link 
                        to="/ca/final-papers" 
                        className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCaDropdownOpen(false);
                        }}
                      >
                        🎓 CA Final
                      </Link>
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
