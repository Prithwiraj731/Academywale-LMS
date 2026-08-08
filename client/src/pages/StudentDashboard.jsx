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
  FaShieldAlt,
  FaHeadset,
  FaExternalLinkAlt,
  FaChevronRight,
  FaFilter
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
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'pending', 'expired'
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

  // Count metrics
  const activeCount = purchases.filter(p => !p.isExpired && p.paymentStatus === 'completed').length;
  const pendingCount = purchases.filter(p => p.paymentStatus === 'pending_verification' || p.paymentStatus === 'pending').length;
  const expiredCount = purchases.filter(p => p.isExpired).length;

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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden pb-16">
      
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-6 sm:space-y-8 relative z-10">

        {/* 🌟 Modern Hero Banner with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-950/90 border border-slate-800/80 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl">
          
          {/* Subtle Glow Overlay */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Student Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 w-full lg:w-auto">
              
              {/* Avatar Box with Glowing Ring */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-teal-400 shadow-xl overflow-hidden">
                  <span className="text-2xl sm:text-4xl font-black tracking-wider uppercase select-none">
                    {user.name ? user.name[0] : 'S'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-teal-400 text-[11px] font-bold tracking-wider uppercase border border-teal-500/20 backdrop-blur-md">
                  <FaUserGraduate className="text-xs text-teal-400" />
                  <span>Student Panel • AcademyWale</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-200">{user.name || 'Learner'}</span> 👋
                </h1>

                <p className="text-slate-400 text-xs sm:text-sm font-medium flex items-center justify-center sm:justify-start gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Main Navigation Tabs Pill Bar */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner w-full sm:w-auto justify-center">
              <button
                onClick={() => setActiveTab('courses')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'courses'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <FaBookOpen className="text-sm" />
                <span>My Enrollments</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'courses' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {purchases.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('cart')}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'cart'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <FaShoppingCart className="text-sm" />
                <span>Shopping Cart</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${activeTab === 'cart' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {cartCount}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* 📊 Metrics Overview Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          
          {/* Enrolled Card */}
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-5 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-teal-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <FaBookOpen className="text-lg sm:text-xl" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">Total</span>
            </div>
            <div className="mt-3">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Enrolled Courses</p>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight">{purchases.length}</h3>
            </div>
          </div>

          {/* Active Card */}
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-5 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FaCheckCircle className="text-lg sm:text-xl" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-500/20">Active</span>
            </div>
            <div className="mt-3">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Active Access</p>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5 tracking-tight">{activeCount}</h3>
            </div>
          </div>

          {/* Pending Card */}
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-5 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FaClock className="text-lg sm:text-xl" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-400 border border-amber-500/20">Pending</span>
            </div>
            <div className="mt-3">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Verification Pending</p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 tracking-tight">{pendingCount}</h3>
            </div>
          </div>

          {/* In Cart Card */}
          <div 
            onClick={() => setActiveTab('cart')}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-4 sm:p-5 border border-slate-800/80 backdrop-blur-xl shadow-lg hover:border-purple-500/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FaShoppingCart className="text-lg sm:text-xl" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/20">Cart</span>
            </div>
            <div className="mt-3">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Cart Items</p>
              <h3 className="text-2xl sm:text-3xl font-black text-purple-400 mt-0.5 tracking-tight">{cartCount}</h3>
            </div>
          </div>

        </div>

        {/* 📚 ENROLLED COURSES TAB */}
        {activeTab === 'courses' ? (
          <div className="space-y-6">

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800/80 backdrop-blur-xl">
              
              {/* Search Box */}
              <div className="relative flex-1">
                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Search my courses by title, faculty, or term..."
                  className="w-full bg-slate-950/90 text-xs sm:text-sm text-slate-100 placeholder-slate-500 pl-9 sm:pl-10 pr-8 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-teal-500/50 font-medium"
                />
                {courseSearch && (
                  <button
                    onClick={() => setCourseSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All', count: purchases.length },
                  { id: 'active', label: 'Active', count: activeCount },
                  { id: 'pending', label: 'Pending', count: pendingCount },
                  { id: 'expired', label: 'Expired', count: expiredCount }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      statusFilter === filter.id
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                        : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>

            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
                <div className="relative w-12 h-12 mb-3">
                  <div className="absolute inset-0 rounded-full border-2 border-teal-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-semibold">Fetching your enrolled courses...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-950/50 text-red-300 text-center py-8 px-4 rounded-3xl border border-red-800/60 backdrop-blur-xl">
                <FaExclamationCircle className="mx-auto text-3xl mb-2 text-red-400" />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            {/* Empty Enrolled State */}
            {!loading && !error && filteredPurchases.length === 0 && (
              <div className="text-center py-16 sm:py-24 bg-gradient-to-b from-slate-900/80 to-slate-950/90 rounded-3xl border border-slate-800/80 backdrop-blur-xl p-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-teal-500/10 rounded-3xl border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-xl">
                  <FaGraduationCap className="text-4xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">No Enrolled Courses Found</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  {purchases.length === 0
                    ? 'Explore our comprehensive courses from leading CA & CMA faculty to kickstart your preparation.'
                    : 'No courses match your selected search or filter.'}
                </p>
                <button
                  onClick={() => navigate('/courses/all')}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-7 py-3.5 rounded-xl font-extrabold transition-all shadow-lg shadow-teal-500/20 text-xs sm:text-sm cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Explore All Courses</span>
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            )}

            {/* 🎴 Course Cards Grid */}
            {!loading && !error && filteredPurchases.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredPurchases.map((purchase) => {
                  const courseDetails = purchase.courseDetails || purchase.course_details || {};
                  const poster = getCourseImageUrl(courseDetails.posterUrl || courseDetails.poster_url || courseDetails.poster || courseDetails);
                  const isPending = purchase.paymentStatus === 'pending_verification' || purchase.paymentStatus === 'pending';
                  const cleanTag = getCleanTag(courseDetails);

                  return (
                    <div
                      key={purchase.id}
                      className="group bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/80 hover:border-teal-500/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                    >
                      {/* Top Poster Image Area */}
                      <div className="relative h-44 sm:h-48 w-full bg-slate-950 overflow-hidden">
                        <img
                          src={poster}
                          alt={courseDetails.title || courseDetails.subject}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-slate-950/90 text-teal-300 border border-teal-500/30 text-[10px] sm:text-[11px] px-3 py-1 rounded-full font-extrabold tracking-wide backdrop-blur-md">
                            {cleanTag}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 z-10">
                          {isPending ? (
                            <span className="bg-amber-500/90 text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-md border border-amber-400/30 flex items-center gap-1">
                              <FaClock className="text-[10px]" /> Verification Pending
                            </span>
                          ) : purchase.isExpired ? (
                            <span className="bg-red-600/90 text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-md border border-red-400/30">
                              Expired
                            </span>
                          ) : (
                            <span className="bg-emerald-500/90 text-white text-[10px] px-2.5 py-1 rounded-full font-black shadow-md border border-emerald-400/30 flex items-center gap-1">
                              <FaCheckCircle className="text-[10px]" /> Active Course
                            </span>
                          )}
                        </div>

                        {/* Bottom Poster Title Overlay */}
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <p className="text-[11px] text-teal-300 font-bold tracking-wider uppercase mb-0.5 truncate">
                            {courseDetails.facultyName || 'AcademyWale Faculty'}
                          </p>
                          <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-2 leading-snug">
                            {courseDetails.title || courseDetails.subject || 'Enrolled Course'}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                        
                        <div className="space-y-3">
                          {/* Option Pills */}
                          <div className="flex flex-wrap gap-1.5">
                            {courseDetails.mode && (
                              <span className="bg-slate-950/80 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-1 rounded-lg font-semibold">
                                Mode: {courseDetails.mode}
                              </span>
                            )}
                            {(courseDetails.validity || courseDetails.attempt) && (
                              <span className="bg-slate-950/80 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-1 rounded-lg font-semibold">
                                Validity: {courseDetails.validity || courseDetails.attempt}
                              </span>
                            )}
                          </div>

                          {/* Purchase Date & Transaction ID */}
                          <div className="space-y-1 text-[11px] text-slate-400 font-medium">
                            <p>Purchased: <span className="text-slate-200 font-semibold">{formatDate(purchase.purchaseDate || purchase.created_at)}</span></p>
                            {purchase.transactionId && (
                              <p className="font-mono text-[10px] text-slate-400 truncate">
                                Ref: <span className="text-teal-400/80 font-bold">{purchase.transactionId}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Card Footer Action Bar */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                          <div>
                            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Amount Paid</p>
                            <p className="text-lg sm:text-xl font-black text-teal-400 font-mono leading-tight">
                              ₹{Number(purchase.amount || 0).toLocaleString('en-IN')}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedInvoice(purchase)}
                              className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              title="Tax Invoice"
                            >
                              <FaFileInvoiceDollar className="text-teal-400 text-sm" />
                            </button>

                            <button
                              onClick={() => setSelectedOrderDetail(purchase)}
                              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-3 sm:px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-teal-500/10 cursor-pointer flex items-center gap-1"
                            >
                              <span>Details</span>
                              <FaChevronRight className="text-[10px]" />
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        ) : (

          /* 🛒 CART TAB CONTENT */
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl shadow-2xl p-5 sm:p-8 border border-slate-800/80 backdrop-blur-2xl">
            <h2 className="text-xl sm:text-2xl font-black text-white mb-6 flex items-center gap-3">
              <FaShoppingCart className="text-teal-400" />
              <span>My Shopping Cart</span>
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-16 sm:py-20 bg-slate-950/60 rounded-2xl border border-slate-800/80 p-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 border border-purple-500/20">
                  <FaShoppingCart className="text-3xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1">Your cart is empty</h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6">
                  Explore our CA & CMA course catalog to add courses to your cart.
                </p>
                <button
                  onClick={() => navigate('/courses/all')}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => {
                    const poster = getCourseImageUrl(item.posterUrl || item.poster_url || item);
                    return (
                      <div
                        key={item.uniqueId}
                        className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800/80 shadow-md flex flex-col sm:flex-row items-center gap-4 hover:border-teal-500/40 transition-colors"
                      >
                        <div className="w-full sm:w-28 h-24 bg-slate-900 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-800 p-1">
                          <img
                            src={poster}
                            alt={item.title}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                          />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-extrabold text-white text-sm sm:text-base leading-snug line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 font-semibold">Faculty: {item.facultyName}</p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2">
                            <span className="bg-slate-900 border border-slate-800 text-teal-400 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
                              Mode: {item.mode || 'Online'}
                            </span>
                            <span className="bg-slate-900 border border-slate-800 text-purple-400 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
                              Term: {item.attempt || 'Dec 2026'}
                            </span>
                            {item.validity && (
                              <span className="bg-slate-900 border border-slate-800 text-indigo-400 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
                                Validity: {item.validity}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                          <span className="font-black text-white text-xl font-mono">
                            ₹{Number(item.price || 0).toLocaleString()}
                          </span>

                          <button
                            onClick={() => removeFromCart(item.uniqueId)}
                            className="p-2.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary Box */}
                <div className="bg-slate-950/90 rounded-3xl p-6 border border-slate-800/80 h-fit space-y-5">
                  <h3 className="font-extrabold text-white text-lg border-b border-slate-800 pb-3">Order Summary</h3>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-bold text-white font-mono">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Discount</span>
                      <span className="font-bold text-emerald-400 font-mono">₹0</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Payment Method</span>
                      <span className="font-bold text-white">Razorpay / Online</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-800">
                    <span className="text-slate-300 font-extrabold text-sm">Total Amount</span>
                    <span className="text-2xl font-black text-teal-400 font-mono">₹{cartTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white py-3.5 rounded-xl font-black shadow-lg shadow-teal-500/20 transition-all text-center cursor-pointer text-sm"
                  >
                    Proceed to Payment
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

      {/* 📄 TAX INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Tax Invoice</h3>
                <p className="text-xs text-slate-500 font-semibold">AcademyWale LMS Official Receipt</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex justify-between border-b pb-3">
                <div>
                  <p className="font-bold text-slate-900 text-sm">Billed To:</p>
                  <p className="font-semibold text-slate-800">{user.name}</p>
                  <p>{user.email}</p>
                  <p>{user.phone || user.mobile || '+91 9693320108'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">Invoice Ref:</p>
                  <p className="font-mono text-teal-700 font-bold">{selectedInvoice.transactionId || selectedInvoice.id}</p>
                  <p className="mt-1 font-bold text-slate-900">Date:</p>
                  <p>{formatDate(selectedInvoice.purchaseDate || selectedInvoice.purchase_date)}</p>
                </div>
              </div>

              <table className="w-full text-left border-collapse my-4">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-500 uppercase text-[10px]">
                    <th className="py-2">Course Package</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-3">
                      <strong className="text-slate-900 text-sm block">
                        {selectedInvoice.courseDetails?.title || selectedInvoice.courseDetails?.subject || 'Course Access'}
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        Mode: {selectedInvoice.courseDetails?.mode || 'Online'} | Validity: {selectedInvoice.courseDetails?.validity || '1 Year'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      ₹{Number(selectedInvoice.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center pt-2 font-bold text-sm border-t border-slate-300 text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-teal-700 text-lg font-mono font-black">₹{Number(selectedInvoice.amount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow hover:from-teal-600 hover:to-emerald-700 cursor-pointer"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 ORDER & ENROLLMENT DETAILS MODAL */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl shadow-2xl relative border border-slate-800 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    Order Details #{selectedOrderDetail.transactionId || String(selectedOrderDetail.id).slice(0, 12)}
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-md font-bold">
                    {selectedOrderDetail.isExpired ? 'Expired' : 'Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Purchased on {formatDate(selectedOrderDetail.purchaseDate || selectedOrderDetail.purchase_date)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const inv = selectedOrderDetail;
                    setSelectedOrderDetail(null);
                    setSelectedInvoice(inv);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <FaFileInvoiceDollar className="text-teal-400 text-sm" />
                  <span>Invoice</span>
                </button>

                <button
                  onClick={() => setSelectedOrderDetail(null)}
                  className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {(() => {
              const courseDetails = selectedOrderDetail.courseDetails || selectedOrderDetail.course_details || {};
              const poster = getCourseImageUrl(courseDetails.posterUrl || courseDetails.poster_url || courseDetails.poster || courseDetails);
              return (
                <div className="space-y-5">
                  
                  {/* Course Details Card */}
                  <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800/80 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Enrolled Course Info</span>
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded font-bold">Verified</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-24 sm:w-28 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center">
                        <img
                          src={poster}
                          alt={courseDetails.title || courseDetails.subject}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <h4 className="text-base sm:text-lg font-extrabold text-teal-300 leading-snug">
                          {courseDetails.title || courseDetails.subject || 'Course Title'}
                        </h4>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-white font-mono">
                            ₹{Number(selectedOrderDetail.amount || 0).toLocaleString()}
                          </span>
                          <span className="text-xs font-bold text-slate-400">Paid Status: {selectedOrderDetail.paymentStatus || 'Completed'}</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {courseDetails.mode && (
                            <span className="bg-slate-950 text-slate-300 border border-slate-800 text-[11px] px-3 py-1 rounded-lg font-medium">
                              Mode: {courseDetails.mode}
                            </span>
                          )}
                          {courseDetails.validity && (
                            <span className="bg-slate-950 text-slate-300 border border-slate-800 text-[11px] px-3 py-1 rounded-lg font-medium">
                              Validity: {courseDetails.validity}
                            </span>
                          )}
                          {courseDetails.attempt && (
                            <span className="bg-slate-950 text-slate-300 border border-slate-800 text-[11px] px-3 py-1 rounded-lg font-medium">
                              Exam Term: {courseDetails.attempt}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student & Support Details Accordion */}
                  <div className="space-y-3">
                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 text-xs text-slate-300 space-y-2">
                      <p className="font-extrabold text-slate-200 text-sm mb-2">Student Information</p>
                      <p>👤 <strong>Name:</strong> {user?.name || 'Learner'}</p>
                      <p>✉️ <strong>Email:</strong> {user?.email || 'N/A'}</p>
                      <p>📱 <strong>Phone:</strong> {user?.phone || user?.mobile || 'N/A'}</p>
                    </div>

                    <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800/80 text-xs text-slate-300 space-y-2">
                      <p className="font-extrabold text-slate-200 text-sm mb-2">Support & Helpdesk</p>
                      <p>📞 <strong>Support Call:</strong> {courseDetails.supportCall || '+91 9693320108'}</p>
                      <p>📧 <strong>Support Email:</strong> {courseDetails.supportMail || 'support@academywale.com'}</p>
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* Checkout Modal Integration */}
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
