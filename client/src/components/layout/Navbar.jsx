import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import { API_URL } from '../../api';
import whatsappLogo from '../../assets/whatsapp.png';
import telegramLogo from '../../assets/telegram.png';
import linkedinLogo from '../../assets/linkedin.png';
import { MorphyButton } from '../ui/morphy-button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [isCaDropdownOpen, setIsCaDropdownOpen] = useState(false);
  const [isCmaDropdownOpen, setIsCmaDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Live faculty list (API faculties)
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/faculties`)
      .then(res => res.json())
      .then(data => {
        const apiFaculties = data.faculties || [];
        const mapped = apiFaculties.map(apiFac => {
          const apiSlug = apiFac.slug || `${apiFac.firstName || apiFac.first_name}-${apiFac.lastName || apiFac.last_name || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const fullName = `${apiFac.first_name || apiFac.firstName || ''} ${apiFac.last_name || apiFac.lastName || ''}`.trim();
          const sequenceVal = apiFac.mongo_id !== undefined && apiFac.mongo_id !== null && String(apiFac.mongo_id).trim() !== ''
            ? Number(apiFac.mongo_id)
            : 999;
          
          return {
            id: apiFac.id || apiFac._id,
            name: fullName,
            slug: apiSlug,
            image: apiFac.image_url || apiFac.imageUrl || apiFac.image || '',
            specialization: (Array.isArray(apiFac.teaches) ? apiFac.teaches[0] : apiFac.teaches) || '',
            sequence: sequenceVal
          };
        });

        mapped.sort((a, b) => a.sequence - b.sequence);
        setFaculties(mapped);
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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 sm:py-2 flex flex-row justify-start sm:justify-between items-center gap-3 overflow-x-auto whitespace-nowrap">
          <div className="flex flex-row items-center gap-3 sm:gap-6 shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#20b2aa]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold">+91 9693320108</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#20b2aa]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold">support@academywale.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a href="https://wa.me/+919693320108" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block">
              <img src={whatsappLogo} alt="WhatsApp" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </a>
            <a href="https://t.me/CMAspirants_01" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block">
              <img src={telegramLogo} alt="Telegram" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </a>
            <a href="https://www.linkedin.com/in/sourav-pathak-30b385279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block">
              <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </a>
          </div>
        </div>
      </div>
      {/* Main navigation */}
      <nav className="bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800 z-40 shadow-md sticky top-0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-1 sm:py-2 relative z-50">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo only */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img src="/academywale.svg" alt="Academywale Logo" className="h-8 sm:h-12 lg:h-16 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <Link to="/" className="text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-[#20b2aa] transition text-sm xl:text-base font-medium">Home</Link>
              <div className="relative group">
                <button className="text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-[#20b2aa] transition flex items-center font-bold text-sm xl:text-base">
                  CA
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <div className="space-y-1 text-sm">
                      <Link to="/ca/foundation-papers" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded">CA Foundation</Link>
                      <Link to="/ca/inter-papers" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded">CA Inter</Link>
                      <Link to="/ca/final-papers" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded">CA Final</Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-[#20b2aa] transition flex items-center font-bold text-sm xl:text-base">
                  CMA
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-2">
                    <div className="space-y-1 text-sm">
                      <Link to="/cma/foundation-papers" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded">CMA Foundation</Link>
                      <Link to="/cma/inter-papers" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded">CMA Inter</Link>
                      <Link to="/cma/final-papers" className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded">CMA Final</Link>
                    </div>
                  </div>
                </div>
              </div>
              <Link to="/test-series" className="text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-[#20b2aa] transition font-bold text-sm xl:text-base">Test Series</Link>

              <div className="relative group">
                <button className="text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-[#20b2aa] transition flex items-center font-bold text-sm xl:text-base">
                  Faculties
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {faculties.map(fac => {
                      return (
                        <Link
                          key={fac.slug}
                          to={`/faculties/${fac.slug}`}
                          className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded"
                        >
                          {fac.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              <Link to="/about" className="text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-[#20b2aa] transition text-sm xl:text-base font-medium">About</Link>
              <Link to="/contact" className="text-gray-800 dark:text-gray-100 hover:text-primary dark:hover:text-[#20b2aa] transition text-sm xl:text-base font-medium">Contact</Link>
              {isAuthenticated && (
                <MorphyButton asChild size="default" className="shadow-lg font-bold">
                  <Link to={user?.role === 'admin' ? "/admin-dashboard" : "/student-dashboard"}>
                    Dashboard
                  </Link>
                </MorphyButton>
              )}
            </div>

            {/* Account/Profile Button & Theme Toggle */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 focus:outline-none flex items-center justify-center border border-gray-200 dark:border-neutral-700 shadow-sm"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <FaSun className="w-4 h-4 text-amber-400" />
                ) : (
                  <FaMoon className="w-4 h-4 text-slate-700" />
                )}
              </button>

              {!isAuthenticated ? (
                <MorphyButton
                  onClick={() => navigate('/login', { state: { from: location.pathname + location.search } })}
                  size="default"
                  className="shadow-md font-bold"
                >
                  Login
                </MorphyButton>
              ) : (
                <div className="relative profile-menu-container flex items-center gap-2">
                  <MorphyButton asChild size="sm" className="shadow-md font-bold sm:flex lg:hidden flex">
                    <Link to={user?.role === 'admin' ? "/admin-dashboard" : "/student-dashboard"}>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                  </MorphyButton>
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
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-lg shadow-lg py-2 z-50">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa]"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all"
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
            <div className="lg:hidden py-3 px-2 border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg">
              <div className="space-y-1 max-h-96 overflow-y-auto">
                <Link 
                  to="/" 
                  className="block py-3 px-4 text-gray-700 dark:text-gray-200 hover:text-primary hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <div>
                  <button
                    onClick={() => setIsCaDropdownOpen(!isCaDropdownOpen)}
                    className="w-full flex justify-between items-center font-semibold text-primary dark:text-[#20b2aa] py-3 px-4 focus:outline-none hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition"
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
                    <div className="pl-4 space-y-1 bg-gray-50 dark:bg-neutral-800/80 rounded-lg py-2 mt-1">
                      <Link 
                        to="/ca/foundation-papers" 
                        className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded-lg transition font-semibold"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCaDropdownOpen(false);
                        }}
                      >
                        CA Foundation
                      </Link>
                      <Link 
                        to="/ca/inter-papers" 
                        className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded-lg transition font-semibold"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCaDropdownOpen(false);
                        }}
                      >
                        CA Inter
                      </Link>
                      <Link 
                        to="/ca/final-papers" 
                        className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-neutral-700 hover:text-blue-700 dark:hover:text-[#20b2aa] rounded-lg transition font-semibold"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsCaDropdownOpen(false);
                        }}
                      >
                        CA Final
                      </Link>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => setIsCmaDropdownOpen(!isCmaDropdownOpen)}
                    className="w-full flex justify-between items-center font-semibold text-primary dark:text-[#20b2aa] py-2 px-4 focus:outline-none hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition"
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
                    <div className="pl-4 space-y-1 bg-gray-50 dark:bg-neutral-800/80 rounded-lg py-2 mt-1">
                      <Link 
                        to="/cma/foundation-papers" 
                        className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-700 rounded transition font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        CMA Foundation
                      </Link>
                      <Link 
                        to="/cma/inter-papers" 
                        className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-700 rounded transition font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        CMA Inter</Link>
                      <Link 
                        to="/cma/final-papers" 
                        className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-700 rounded transition font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        CMA Final
                      </Link>
                    </div>
                  )}
                </div>
                <Link 
                  to="/test-series" 
                  className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-800 rounded transition font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Test Series
                </Link>

                <Link to="/faculties" className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-800 rounded transition font-semibold">
                  All Faculties
                </Link>
                <Link to="/about" className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-800 rounded transition font-semibold">
                  About
                </Link>
                <Link to="/contact" className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-800 rounded transition font-semibold">
                  Contact
                </Link>
                {isAuthenticated && (
                  <Link
                    to={user?.role === 'admin' ? "/admin-dashboard" : "/student-dashboard"}
                    className="block py-2 px-4 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-[#20b2aa] hover:bg-gray-50 dark:hover:bg-neutral-800 rounded transition font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                {!isAuthenticated && (
                  <div className="mt-2 flex justify-start w-full">
                    <MorphyButton
                      onClick={() => {
                        navigate('/login', { state: { from: location.pathname + location.search } });
                        setIsMenuOpen(false);
                      }}
                      size="default"
                      className="shadow-lg font-bold w-full"
                    >
                      Login
                    </MorphyButton>
                  </div>
                )}
                <div className="pt-3 mt-2 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between px-4">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Theme</span>
                  <button
                    onClick={toggleTheme}
                    className="py-1.5 px-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200 border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900"
                    aria-label="Toggle Theme"
                  >
                    {theme === 'dark' ? (
                      <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold"><FaSun className="w-3.5 h-3.5" /> Light Mode</span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-slate-700 font-bold"><FaMoon className="w-3.5 h-3.5" /> Dark Mode</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
    </div>
  );
}
