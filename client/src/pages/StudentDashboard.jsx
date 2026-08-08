import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import {
  FaBookOpen,
  FaShoppingCart,
  FaUserGraduate,
  FaTrashAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaFileInvoiceDollar,
  FaTimes,
  FaSearch,
  FaArrowRight,
  FaGraduationCap,
  FaHeadset,
  FaChevronRight,
  FaSlidersH,
  FaEllipsisH,
  FaBell,
  FaCog,
  FaPlay,
  FaDownload,
  FaHome
} from 'react-icons/fa';
import { API_URL } from '../api';
import CheckoutModal from '../components/common/CheckoutModal';
import { getCourseImageUrl } from '../utils/imageUtils';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'cart'
  const [courseSearch, setCourseSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const handleCheckoutProceed = (details, address) => {
    setShowCheckoutModal(false);
    navigate('/payment/cart', {
      state: {
        userDetails: {
          fullName: details.fullName,
          email: details.email,
          phone: details.phone,
          address
        }
      }
    });
  };

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const userId = user.id || user._id;
      const response = await fetch(`${API_URL}/api/purchase/user/${userId}`);
      const data = await response.json();

      if (data.success) {
        setPurchases(data.purchases || []);
      } else {
        setError(data.message || 'Failed to fetch purchases');
      }
    } catch (err) {
      setError('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCleanTag = (details) => {
    if (!details) return 'Online Course';
    const raw = details.category || details.level || details.subject || details.title || '';
    if (/CMA\s*Final/i.test(raw)) return 'CMA Final';
    if (/CMA\s*Inter/i.test(raw)) return 'CMA Inter';
    if (/CMA\s*Foundation/i.test(raw)) return 'CMA Foundation';
    if (/CA\s*Final/i.test(raw)) return 'CA Final';
    if (/CA\s*Inter/i.test(raw)) return 'CA Inter';
    if (/CA\s*Foundation/i.test(raw)) return 'CA Foundation';

    if (raw.length > 0 && raw.length <= 18) return raw;
    return 'Online Course';
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Stats
  const activeCount = purchases.filter(p => !p.isExpired && p.paymentStatus === 'completed').length;
  const pendingCount = purchases.filter(p => p.paymentStatus === 'pending_verification' || p.paymentStatus === 'pending').length;
  const expiredCount = purchases.filter(p => p.isExpired).length;
  const totalSpent = purchases.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Filtered courses
  const filteredPurchases = purchases.filter(p => {
    const details = p.courseDetails || p.course_details || {};
    const title = (details.title || details.subject || '').toLowerCase();
    const faculty = (details.facultyName || '').toLowerCase();
    const query = courseSearch.toLowerCase();
    const matchesSearch = !query || title.includes(query) || faculty.includes(query);

    const isPending = p.paymentStatus === 'pending_verification' || p.paymentStatus === 'pending';
    if (statusFilter === 'active') return matchesSearch && !p.isExpired && p.paymentStatus === 'completed';
    if (statusFilter === 'pending') return matchesSearch && isPending;
    if (statusFilter === 'expired') return matchesSearch && p.isExpired;

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 font-sans selection:bg-teal-500 selection:text-black relative overflow-hidden pb-12">
      
      {/* Background Soft Teal & Blue Ambient Orbs (Official Brand Palette) */}
      <div className="absolute top-[-100px] left-[15%] w-[650px] h-[650px] bg-teal-500/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-100px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-50px] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Main Container Frame */}
      <div className="max-w-[1440px] mx-auto p-3 sm:p-6 lg:p-8">
        
        {/* Layout Grid: Left Vertical Glass Dock + Right Content Area */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* 📱 / 💻 Left Floating Vertical Glass Dock (Sidebar) */}
          <aside className="hidden md:flex flex-col justify-between items-center py-8 px-4 bg-[#111c38]/80 backdrop-blur-2xl border border-teal-500/15 rounded-[32px] w-20 shrink-0 min-h-[85vh] sticky top-6 shadow-2xl z-30">
            
            {/* Top Home Link Icon (Clean Brand Replacement - AW Logo Removed as Requested) */}
            <button
              onClick={() => navigate('/')}
              title="Back to Home"
              className="p-3.5 rounded-2xl text-teal-400 hover:text-white bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/20 transition-all cursor-pointer shadow-lg shadow-teal-500/10"
            >
              <FaHome className="text-xl" />
            </button>

            {/* Middle Nav Icons */}
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={() => setActiveTab('courses')}
                title="My Enrollments"
                className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${
                  activeTab === 'courses'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FaBookOpen className="text-xl" />
              </button>

              <button
                onClick={() => setActiveTab('cart')}
                title="Shopping Cart"
                className={`p-3.5 rounded-2xl transition-all duration-300 relative cursor-pointer ${
                  activeTab === 'cart'
                    ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FaShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-pulse" />
                )}
              </button>

              <button
                onClick={() => navigate('/courses/all')}
                title="Browse Courses"
                className="p-3.5 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <FaGraduationCap className="text-xl" />
              </button>

              <a
                href="https://wa.me/919693320108"
                target="_blank"
                rel="noreferrer"
                title="Support Helpdesk"
                className="p-3.5 rounded-2xl text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
              >
                <FaHeadset className="text-xl" />
              </a>
            </div>

            {/* Bottom Student Avatar Indicator */}
            <div className="flex flex-col items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-300 font-bold text-sm">
                {user.name ? user.name[0].toUpperCase() : 'S'}
              </div>
            </div>
          </aside>

          {/* 🚀 Main Content Dashboard Canvas */}
          <main className="flex-1 space-y-6 min-w-0">

            {/* Top Navigation & Header Row */}
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#111c38]/70 backdrop-blur-2xl border border-teal-500/15 rounded-[28px] p-4 sm:p-5 shadow-xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Student Dashboard
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  Welcome back, <span className="text-teal-300 font-semibold">{user.name || 'Learner'}</span>
                </p>
              </div>

              {/* Top Header Right Controls */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {/* Search Bar Input */}
                <div className="relative flex-1 sm:w-64">
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full bg-[#0b1329]/80 text-xs text-slate-200 placeholder-slate-400 pl-9 pr-3 py-2 rounded-full border border-teal-500/20 focus:outline-none focus:border-teal-400/60"
                  />
                </div>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 bg-[#0b1329]/80 border border-teal-500/20 rounded-full px-3 py-1.5 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'S'}
                  </div>
                  <span className="text-xs font-bold text-slate-200 hidden sm:inline">{user.name?.split(' ')[0]}</span>
                </div>
              </div>
            </header>

            {/* 🌟 TOP HERO CARD + SHOPPING CART SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Large Glass Hero Banner */}
              <div className="lg:col-span-8 bg-[#111c38]/80 backdrop-blur-2xl border border-teal-500/20 rounded-[36px] p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[300px]">
                
                {/* Background Ambient Teal Lighting */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/20 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

                <div>
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1.5">Learning Analytics</p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                    Welcome to Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-200">
                      AcademyWale Learning Portal
                    </span>
                  </h2>
                  <button
                    onClick={() => navigate('/courses/all')}
                    className="bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 px-6 py-2.5 rounded-full font-black text-xs tracking-wide shadow-xl shadow-teal-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Browse All Courses</span>
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>

                {/* 🧊 FLOATING FROSTED GLASS STAT CAPSULE OVERLAY */}
                <div className="mt-8 bg-slate-950/40 backdrop-blur-2xl border border-teal-500/20 rounded-2xl p-4 sm:p-5 grid grid-cols-4 gap-2 text-center shadow-2xl">
                  <div>
                    <p className="text-lg sm:text-2xl font-black text-white font-mono">{purchases.length}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" /> Enrolled
                    </p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-black text-emerald-400 font-mono">{activeCount}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active
                    </p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-black text-amber-300 font-mono">{pendingCount}</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400" /> Pending
                    </p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-black text-teal-300 font-mono">₹{(totalSpent / 1000).toFixed(1)}k</p>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-300 flex items-center justify-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400" /> Investment
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Side Glass Card: Shopping Cart Status (Graph removed as requested) */}
              <div className="lg:col-span-4 flex flex-col justify-between gap-6">

                {/* Shopping Cart Status Widget */}
                <div 
                  onClick={() => setActiveTab('cart')}
                  className="bg-[#111c38]/80 backdrop-blur-2xl border border-teal-500/20 rounded-[36px] p-6 shadow-2xl flex-1 flex flex-col justify-between cursor-pointer hover:border-teal-400/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-extrabold text-teal-400 uppercase tracking-wider">Shopping Cart Status</p>
                    <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                      {cartCount} Items
                    </span>
                  </div>

                  <div className="space-y-2 my-2">
                    <p className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">₹{cartTotal.toLocaleString()}</p>
                    <p className="text-xs font-semibold text-slate-300">
                      {cartCount === 0 ? 'Your cart is currently empty' : `${cartCount} Course(s) Ready for Checkout`}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-teal-500/15 flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-300 group-hover:underline flex items-center gap-1.5">
                      <span>View Cart</span>
                      <FaChevronRight className="text-[10px]" />
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xl group-hover:scale-110 transition-transform">
                      <FaShoppingCart />
                    </div>
                  </div>
                </div>

                {/* Helpdesk Quick Contact Pill Card */}
                <div className="bg-[#111c38]/80 backdrop-blur-2xl border border-teal-500/20 rounded-[28px] p-4 shadow-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <FaHeadset className="text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Need Assistance?</p>
                      <p className="text-[11px] text-slate-400">AcademyWale Support Team</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/919693320108"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all"
                  >
                    Chat
                  </a>
                </div>

              </div>

            </div>

            {/* 📋 BOTTOM SECTION: "MY ENROLLED COURSES" */}
            {activeTab === 'courses' ? (
              <div className="bg-[#111c38]/80 backdrop-blur-2xl border border-teal-500/20 rounded-[36px] p-5 sm:p-8 shadow-2xl space-y-6">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-teal-500/15">
                  <div>
                    <h3 className="text-xl font-extrabold text-white">My Enrolled Courses</h3>
                    <p className="text-xs text-slate-400">Manage and access your purchased lectures</p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {[
                      { id: 'all', label: 'All Courses' },
                      { id: 'active', label: 'Active Access' },
                      { id: 'pending', label: 'Pending' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setStatusFilter(f.id)}
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                          statusFilter === f.id
                            ? 'bg-teal-500 text-slate-950 font-black shadow-lg shadow-teal-500/20'
                            : 'bg-slate-900/60 text-slate-400 hover:text-white border border-teal-500/15'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="py-16 text-center text-slate-400 text-xs font-semibold">
                    Loading your enrollments...
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredPurchases.length === 0 && (
                  <div className="py-16 text-center space-y-3">
                    <p className="text-slate-400 text-sm">No courses enrolled yet.</p>
                    <button
                      onClick={() => navigate('/courses/all')}
                      className="bg-teal-500 text-slate-950 px-6 py-2.5 rounded-full text-xs font-extrabold cursor-pointer hover:bg-teal-400 shadow-lg shadow-teal-500/20"
                    >
                      Explore Courses
                    </button>
                  </div>
                )}

                {/* 🎴 Course Rows List */}
                {!loading && !error && filteredPurchases.length > 0 && (
                  <div className="space-y-3">
                    {filteredPurchases.map((purchase) => {
                      const courseDetails = purchase.courseDetails || purchase.course_details || {};
                      const poster = getCourseImageUrl(courseDetails.posterUrl || courseDetails.poster_url || courseDetails.poster || courseDetails);
                      const isPending = purchase.paymentStatus === 'pending_verification' || purchase.paymentStatus === 'pending';
                      const cleanTag = getCleanTag(courseDetails);

                      return (
                        <div
                          key={purchase.id}
                          className="group bg-[#0b1329]/70 border border-teal-500/15 hover:border-teal-400/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-300 hover:bg-[#111c38]"
                        >
                          {/* Thumbnail + Title + Faculty */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-20 h-16 rounded-xl bg-slate-950 border border-teal-500/20 overflow-hidden shrink-0">
                              <img
                                src={poster}
                                alt={courseDetails.title || courseDetails.subject}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="bg-teal-500/15 border border-teal-500/25 text-teal-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                                  {cleanTag}
                                </span>
                                {isPending ? (
                                  <span className="text-amber-300 text-[10px] font-bold">● Pending</span>
                                ) : (
                                  <span className="text-emerald-400 text-[10px] font-bold">● Active</span>
                                )}
                              </div>

                              <h4 className="text-sm font-extrabold text-white truncate max-w-xs sm:max-w-md">
                                {courseDetails.title || courseDetails.subject || 'Enrolled Course'}
                              </h4>

                              <p className="text-xs text-slate-400 font-medium">
                                Faculty: <span className="text-slate-200 font-semibold">{courseDetails.facultyName || 'AcademyWale Faculty'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Middle Specs & Price */}
                          <div className="flex flex-wrap items-center gap-4 text-xs">
                            {courseDetails.mode && (
                              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                                <span className="w-2 h-2 rounded-full bg-teal-400" />
                                Mode: {courseDetails.mode}
                              </span>
                            )}
                            {(courseDetails.validity || courseDetails.attempt) && (
                              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                                Term: {courseDetails.validity || courseDetails.attempt}
                              </span>
                            )}
                            <span className="font-mono text-base font-extrabold text-white">
                              ₹{Number(purchase.amount || 0).toLocaleString()}
                            </span>
                          </div>

                          {/* Right Actions */}
                          <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-teal-500/15 pt-3 md:pt-0">
                            <button
                              onClick={() => setSelectedInvoice(purchase)}
                              className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/25 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <FaFileInvoiceDollar className="text-teal-400" />
                              <span>Invoice</span>
                            </button>

                            <button
                              onClick={() => setSelectedOrderDetail(purchase)}
                              className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-teal-500/20"
                            >
                              Details
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            ) : (

              /* 🛒 CART CONTENT */
              <div className="bg-[#111c38]/80 backdrop-blur-2xl border border-teal-500/20 rounded-[36px] p-6 sm:p-8 shadow-2xl space-y-6">
                <h3 className="text-xl font-extrabold text-white">Shopping Cart</h3>

                {cartItems.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    Your cart is empty.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.uniqueId} className="bg-[#0b1329]/80 p-4 rounded-2xl border border-teal-500/15 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-400">Faculty: {item.facultyName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-base font-extrabold text-white">₹{Number(item.price || 0).toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item.uniqueId)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer">
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 border-t border-teal-500/15 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-400">Total Price</p>
                        <p className="text-2xl font-black text-teal-300 font-mono">₹{cartTotal.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => setShowCheckoutModal(true)}
                        className="bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3 rounded-full font-black text-xs cursor-pointer shadow-xl shadow-teal-500/20"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>

        </div>
      </div>

      {/* 📄 TAX INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111c38] text-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative border border-teal-500/25 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-teal-500/20 mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-white">Tax Invoice</h3>
                <p className="text-xs text-slate-400">AcademyWale LMS Official Receipt</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex justify-between border-b border-teal-500/20 pb-3">
                <div>
                  <p className="font-bold text-white text-sm">Billed To:</p>
                  <p className="font-semibold text-slate-200">{user.name}</p>
                  <p>{user.email}</p>
                  <p>{user.phone || user.mobile || '+91 9693320108'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">Invoice Ref:</p>
                  <p className="font-mono text-teal-300 font-bold">{selectedInvoice.transactionId || selectedInvoice.id}</p>
                  <p className="mt-1 font-bold text-white">Date:</p>
                  <p>{formatDate(selectedInvoice.purchaseDate || selectedInvoice.purchase_date)}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 font-bold text-sm text-white">
                <span>Total Amount Paid:</span>
                <span className="text-teal-300 text-xl font-mono font-black">₹{Number(selectedInvoice.amount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-teal-500/20 flex justify-end">
              <button
                onClick={() => window.print()}
                className="bg-teal-500 text-slate-950 hover:bg-teal-400 px-6 py-2.5 rounded-full text-xs font-black shadow cursor-pointer"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 ORDER DETAILS MODAL */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111c38] text-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative border border-teal-500/25 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-teal-500/20 mb-5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Order #{selectedOrderDetail.transactionId || String(selectedOrderDetail.id).slice(0, 12)}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Purchased on {formatDate(selectedOrderDetail.purchaseDate || selectedOrderDetail.purchase_date)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {(() => {
              const courseDetails = selectedOrderDetail.courseDetails || selectedOrderDetail.course_details || {};
              return (
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="bg-[#0b1329]/80 p-4 rounded-2xl border border-teal-500/20 space-y-2">
                    <h4 className="text-base font-extrabold text-teal-300 leading-snug">
                      {courseDetails.title || courseDetails.subject || 'Course Title'}
                    </h4>
                    <p>Faculty: <strong className="text-white">{courseDetails.facultyName || 'AcademyWale Faculty'}</strong></p>
                    <p>Mode: <strong className="text-white">{courseDetails.mode || 'Online'}</strong></p>
                    <p>Validity: <strong className="text-white">{courseDetails.validity || 'Dec 2026'}</strong></p>
                  </div>

                  <div className="flex justify-between items-center pt-2 font-bold text-sm text-white">
                    <span>Amount Paid:</span>
                    <span className="text-teal-300 text-lg font-mono font-black">₹{Number(selectedOrderDetail.amount || 0).toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          user={user}
          onClose={() => setShowCheckoutModal(false)}
          onProceed={handleCheckoutProceed}
          totalAmount={cartTotal}
          itemsSummary={cartItems.map(item => item.subject || item.title)}
        />
      )}

    </div>
  );
}
