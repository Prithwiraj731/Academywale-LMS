import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaShoppingCart, FaUserGraduate, FaTrashAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaFileInvoiceDollar, FaTimes } from 'react-icons/fa';
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
        setPurchases(data.purchases);
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Count helper functions
  const activeCount = purchases.filter(p => !p.isExpired && p.paymentStatus === 'completed').length;
  const pendingCount = purchases.filter(p => p.paymentStatus === 'pending_verification' || p.paymentStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Welcome Glassmorphic Header */}
        <div className="relative overflow-hidden bg-neutral-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-neutral-800 p-6 sm:p-8 mb-8">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-36 h-36 bg-[#20b2aa]/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#20b2aa] to-[#126862] flex items-center justify-center shadow-lg transform rotate-2">
                <span className="text-3xl font-extrabold text-white uppercase select-none">
                  {user.name ? user.name[0] : 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, <span className="text-[#20b2aa]">{user.name || 'Learner'}</span>!
                </h1>
                <p className="text-neutral-400 text-sm sm:text-base mt-1 font-medium">
                  {user.email} | Student Panel
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('courses')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                  activeTab === 'courses' 
                    ? 'bg-[#20b2aa] text-white hover:bg-[#1a9690]' 
                    : 'bg-neutral-850 text-neutral-300 border border-neutral-750 hover:bg-neutral-800'
                }`}
              >
                My Enrollments ({purchases.length})
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center ${
                  activeTab === 'cart' 
                    ? 'bg-[#20b2aa] text-white hover:bg-[#1a9690]' 
                    : 'bg-neutral-850 text-neutral-300 border border-neutral-750 hover:bg-neutral-800'
                }`}
              >
                <FaShoppingCart className="mr-2" /> Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-neutral-900/90 rounded-2xl shadow-xl p-5 border border-neutral-800 flex items-center space-x-4">
            <div className="p-3 bg-[#20b2aa]/10 rounded-xl text-[#20b2aa]">
              <FaBookOpen className="text-xl" />
            </div>
            <div>
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Purchased</p>
              <p className="text-xl sm:text-2xl font-black text-white">{purchases.length}</p>
            </div>
          </div>
          
          <div className="bg-neutral-900/90 rounded-2xl shadow-xl p-5 border border-neutral-800 flex items-center space-x-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
              <FaCheckCircle className="text-xl" />
            </div>
            <div>
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Active</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-400">{activeCount}</p>
            </div>
          </div>
          
          <div className="bg-neutral-900/90 rounded-2xl shadow-xl p-5 border border-neutral-800 flex items-center space-x-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <FaClock className="text-xl animate-pulse" />
            </div>
            <div>
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">Pending</p>
              <p className="text-xl sm:text-2xl font-black text-amber-400">{pendingCount}</p>
            </div>
          </div>
          
          <div className="bg-neutral-900/90 rounded-2xl shadow-xl p-5 border border-neutral-800 flex items-center space-x-4 cursor-pointer hover:border-teal-500/40 transition-colors" onClick={() => setActiveTab('cart')}>
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
              <FaShoppingCart className="text-xl" />
            </div>
            <div>
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">In Cart</p>
              <p className="text-xl sm:text-2xl font-black text-purple-400">{cartCount}</p>
            </div>
          </div>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'courses' ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center">
                <FaUserGraduate className="mr-3 text-[#20b2aa]" /> My Purchased Courses
              </h2>
            </div>
            
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 bg-neutral-900/50 rounded-3xl border border-neutral-800">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20b2aa] mb-3"></div>
                <p className="text-neutral-400 text-sm">Loading enrolled courses...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-950/40 text-red-400 text-center py-8 px-4 rounded-2xl border border-red-800">
                <FaExclamationCircle className="mx-auto text-3xl mb-2 text-red-400" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {!loading && !error && purchases.length === 0 && (
              <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-neutral-800">
                <div className="w-20 h-20 mx-auto mb-4 bg-teal-500/10 rounded-full flex items-center justify-center text-[#20b2aa]">
                  <FaBookOpen className="text-3xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">No enrolled courses yet</h3>
                <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-6">
                  Explore our comprehensive courses from leading CA & CMA faculty.
                </p>
                <button 
                  onClick={() => navigate('/courses/all')}
                  className="bg-[#20b2aa] hover:bg-[#1a9690] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all cursor-pointer"
                >
                  Explore All Courses
                </button>
              </div>
            )}

            {/* Clean 3-Column Responsive Grid Cards for Purchased Courses */}
            {!loading && !error && purchases.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((purchase) => {
                  const courseDetails = purchase.courseDetails || purchase.course_details || {};
                  const poster = getCourseImageUrl(courseDetails.posterUrl || courseDetails.poster_url || courseDetails);
                  
                  return (
                    <div 
                      key={purchase.id} 
                      className="bg-[#141416] border border-neutral-800 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all hover:border-neutral-700 hover:shadow-teal-900/10 transform hover:-translate-y-1"
                    >
                      {/* Card Poster Image with Status Badge */}
                      <div className="relative bg-neutral-900 h-44 flex items-center justify-center overflow-hidden border-b border-neutral-800">
                        <img 
                          src={poster} 
                          alt={courseDetails.title || courseDetails.subject || 'Course'}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                        />
                        <div className="absolute top-3 right-3">
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold shadow-md">
                            {purchase.isExpired ? 'Expired' : 'Active'}
                          </span>
                        </div>
                      </div>

                      {/* Content: Title, Faculty, Price & View Details Button */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="text-base sm:text-lg font-extrabold text-white line-clamp-2 leading-snug mb-1">
                            {courseDetails.title || courseDetails.subject || 'Course Title'}
                          </h3>
                          <p className="text-xs text-neutral-400 font-semibold">
                            Faculty: <span className="text-[#38bdf8] font-bold">{courseDetails.facultyName || 'Expert Faculty'}</span>
                          </p>
                        </div>

                        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Price Paid</p>
                            <p className="text-lg font-black text-white font-mono">
                              ₹{Number(purchase.amount || 0).toLocaleString()}
                            </p>
                          </div>

                          <button
                            onClick={() => setSelectedOrderDetail(purchase)}
                            className="bg-[#20b2aa] hover:bg-[#1a9690] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (

          /* Cart Tab Content */
          <div className="bg-neutral-900/90 rounded-3xl shadow-2xl p-6 sm:p-8 border border-neutral-800">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6 flex items-center">
              <FaShoppingCart className="mr-3 text-[#20b2aa]" /> My Shopping Cart
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-20 bg-neutral-950/40 rounded-2xl border border-neutral-850">
                <div className="w-20 h-20 mx-auto mb-4 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400">
                  <FaShoppingCart className="text-3xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Your cart is empty</h3>
                <p className="text-neutral-400 text-sm sm:text-base max-w-md mx-auto mb-6">
                  Add courses from CA/CMA detail pages to purchase them collectively here.
                </p>
                <button 
                  onClick={() => navigate('/courses/all')}
                  className="bg-[#20b2aa] hover:bg-[#1a9690] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => {
                    const poster = getCourseImageUrl(item.posterUrl || item.poster_url || item);
                    return (
                      <div 
                        key={item.uniqueId} 
                        className="bg-neutral-950 rounded-2xl p-4 border border-neutral-800 shadow-md flex flex-col sm:flex-row items-center gap-4 hover:border-teal-500/40 transition-colors"
                      >
                        <div className="w-full sm:w-28 h-20 bg-neutral-900 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-neutral-800">
                          <img 
                            src={poster} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                          />
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-extrabold text-white text-base leading-snug line-clamp-1">{item.title}</h4>
                          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Faculty: {item.facultyName}</p>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                            <span className="bg-neutral-900 border border-neutral-800 text-[#20b2aa] text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
                              Mode: {item.mode || 'Online'}
                            </span>
                            <span className="bg-neutral-900 border border-neutral-800 text-purple-400 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
                              Exam Term: {item.attempt || 'Dec 2026'}
                            </span>
                            {item.validity && (
                              <span className="bg-neutral-900 border border-neutral-800 text-indigo-400 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">
                                Validity: {item.validity}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-neutral-850 pt-3 sm:pt-0">
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

                {/* Checkout Summary Box */}
                <div className="bg-neutral-950 rounded-3xl p-6 border border-neutral-800 h-fit">
                  <h3 className="font-extrabold text-white text-lg mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6 border-b border-neutral-800 pb-4 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-bold text-white font-mono">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Discount</span>
                      <span className="font-bold text-emerald-400 font-mono">₹0</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Payment Method</span>
                      <span className="font-bold text-white">Razorpay / Online</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-neutral-300 font-bold text-sm">Total Price</span>
                    <span className="text-2xl font-black text-[#38bdf8] font-mono">₹{cartTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-full bg-[#20b2aa] hover:bg-[#1a9690] text-white py-3.5 rounded-xl font-bold shadow-lg transition-all text-center block cursor-pointer"
                  >
                    Proceed to Payment
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Invoice Printable Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white text-gray-900 rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-2xl relative border border-gray-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Tax Invoice</h3>
                  <p className="text-xs text-gray-500">AcademyWale LMS Official Receipt</p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4 text-xs text-gray-700">
                <div className="flex justify-between border-b pb-3">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Billed To:</p>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                    <p>{user.phone || '+91 7557021866'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">Invoice No:</p>
                    <p className="font-mono text-teal-700">{selectedInvoice.transactionId || selectedInvoice.id}</p>
                    <p className="mt-1 font-bold text-gray-900">Date:</p>
                    <p>{formatDate(selectedInvoice.purchaseDate || selectedInvoice.purchase_date)}</p>
                  </div>
                </div>

                <table className="w-full text-left border-collapse my-4">
                  <thead>
                    <tr className="border-b border-gray-300 text-gray-500 uppercase text-[10px]">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3">
                        <strong className="text-gray-900 text-sm block">
                          {selectedInvoice.courseDetails?.title || selectedInvoice.courseDetails?.subject || 'Course Access'}
                        </strong>
                        <span className="text-gray-500 text-[11px]">
                          Mode: {selectedInvoice.courseDetails?.mode || 'Online'} | Validity: {selectedInvoice.courseDetails?.validity || '1 Year'}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-gray-900">
                        ₹{Number(selectedInvoice.amount || 0).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-between items-center pt-2 font-bold text-sm border-t border-gray-300 text-gray-900">
                  <span>Total Paid:</span>
                  <span className="text-teal-700 text-lg font-mono">₹{Number(selectedInvoice.amount || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="bg-[#20b2aa] text-white px-5 py-2 rounded-xl text-xs font-bold shadow hover:bg-[#1a9690]"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Order & Enrollment Details Modal */}
        {selectedOrderDetail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#141416] text-white rounded-3xl p-5 sm:p-7 w-full max-w-2xl shadow-2xl relative border border-neutral-800 max-h-[90vh] overflow-y-auto">
              
              {/* Top Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      Order #{selectedOrderDetail.transactionId || String(selectedOrderDetail.id).slice(0, 14)}
                    </h3>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs px-3 py-0.5 rounded-md font-bold">
                      {selectedOrderDetail.isExpired ? 'Expired' : 'Placed'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 italic font-mono">
                    {formatDate(selectedOrderDetail.purchaseDate || selectedOrderDetail.purchase_date)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const inv = selectedOrderDetail;
                      setSelectedOrderDetail(null);
                      setSelectedInvoice(inv);
                    }}
                    className="bg-neutral-850 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FaFileInvoiceDollar className="text-teal-400 text-sm" />
                    <span>Invoice</span>
                  </button>

                  <button
                    onClick={() => setSelectedOrderDetail(null)}
                    className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center font-bold text-sm cursor-pointer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Order Details Body */}
              {(() => {
                const courseDetails = selectedOrderDetail.courseDetails || selectedOrderDetail.course_details || {};
                const poster = getCourseImageUrl(courseDetails.posterUrl || courseDetails.poster_url || courseDetails);
                return (
                  <div className="space-y-5">
                    {/* Order Details Card */}
                    <div className="bg-[#1a1a1e] rounded-2xl p-4 sm:p-5 border border-neutral-800/80">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-extrabold text-neutral-300 uppercase tracking-wider">Order Details</span>
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded font-bold">Placed</span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-24 sm:w-28 h-24 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 flex items-center justify-center">
                          <img
                            src={poster}
                            alt={courseDetails.title || courseDetails.subject}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                          />
                        </div>

                        <div className="flex-1 space-y-2">
                          <h4 className="text-base sm:text-lg font-extrabold text-[#38bdf8] leading-snug">
                            {courseDetails.title || courseDetails.subject || 'Course Title'}
                          </h4>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-neutral-500 line-through">
                              ₹{Number((selectedOrderDetail.amount || 0) * 1.25).toLocaleString()}
                            </span>
                            <span className="text-lg font-black text-white font-mono">
                              ₹{Number(selectedOrderDetail.amount || 0).toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-neutral-400">x1</span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {courseDetails.mode && (
                              <span className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[11px] px-3 py-1 rounded-lg font-medium">
                                Mode: {courseDetails.mode}
                              </span>
                            )}
                            {courseDetails.validity && (
                              <span className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[11px] px-3 py-1 rounded-lg font-medium">
                                Course Validity: {courseDetails.validity}
                              </span>
                            )}
                            {courseDetails.books && (
                              <span className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[11px] px-3 py-1 rounded-lg font-medium">
                                Mode of Delivery of Books: {courseDetails.books}
                              </span>
                            )}
                            {courseDetails.attempt && (
                              <span className="bg-neutral-800 text-neutral-300 border border-neutral-700 text-[11px] px-3 py-1 rounded-lg font-medium">
                                Exam Term: {courseDetails.attempt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                        <span className="font-semibold text-neutral-400">Price Breakdown</span>
                        <span className="font-extrabold text-[#38bdf8] text-base font-mono">₹{Number(selectedOrderDetail.amount || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Enrollments Card */}
                    <div className="bg-[#1a1a1e] rounded-2xl p-4 sm:p-5 border border-neutral-800/80">
                      <div className="flex items-center gap-2 mb-3 text-sm font-extrabold text-neutral-200">
                        <span className="text-lg text-[#20b2aa]">🎓</span> Enrollments (1)
                      </div>

                      <div className="bg-[#121214] rounded-xl p-4 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <h5 className="font-extrabold text-white text-sm sm:text-base">
                            {courseDetails.title || courseDetails.subject}
                          </h5>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="bg-neutral-900 text-neutral-300 text-[10px] px-2.5 py-0.5 rounded font-medium border border-neutral-800">
                              Mode: {courseDetails.mode || 'Online'}
                            </span>
                            <span className="bg-neutral-900 text-neutral-300 text-[10px] px-2.5 py-0.5 rounded font-medium border border-neutral-800">
                              Course Validity: {courseDetails.validity || '1 Year'}
                            </span>
                          </div>
                        </div>

                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs px-3.5 py-1 rounded-md font-bold shrink-0">
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Student & Transaction Accordions */}
                    <div className="space-y-3">
                      <details className="group bg-[#1a1a1e] rounded-2xl border border-neutral-800/80 overflow-hidden" open>
                        <summary className="p-4 flex items-center justify-between cursor-pointer text-sm font-extrabold text-white select-none">
                          <div className="flex items-center gap-2">
                            <span>Student Details</span>
                          </div>
                          <span className="transition-transform group-open:rotate-180 text-neutral-400 text-xs">▼</span>
                        </summary>
                        <div className="p-4 pt-0 border-t border-neutral-800/60 text-xs text-neutral-300 space-y-2 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400">👤</span> <strong className="text-white text-sm">{user.name || 'Learner'}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400">✉️</span> <strong className="text-white text-sm underline">{user.email}</strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-400">📱</span> <strong className="text-white text-sm underline">{user.phone || '+917557021866'}</strong>
                          </div>
                        </div>
                      </details>

                      <details className="group bg-[#1a1a1e] rounded-2xl border border-neutral-800/80 overflow-hidden" open>
                        <summary className="p-4 flex items-center justify-between cursor-pointer text-sm font-extrabold text-white select-none">
                          <div className="flex items-center gap-2">
                            <span>Transaction Details</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase">Success</span>
                            <span className="transition-transform group-open:rotate-180 text-neutral-400 text-xs">▼</span>
                          </div>
                        </summary>
                        <div className="p-4 pt-0 border-t border-neutral-800/60 text-xs text-neutral-300 space-y-2.5 mt-2">
                          <div className="flex justify-between">
                            <span className="text-neutral-400">ID:</span>
                            <span className="font-mono text-white font-bold">{selectedOrderDetail.transactionId || selectedOrderDetail.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Payment Gateway:</span>
                            <span className="text-white font-semibold">paid</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Payment Mode:</span>
                            <span className="text-white font-semibold">Online / Razorpay</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-400">Payment Status:</span>
                            <span className="text-emerald-400 font-bold">success</span>
                          </div>
                          <div className="flex justify-between pt-2.5 border-t border-neutral-800">
                            <span className="text-white font-bold text-sm">Total of multiple orders:</span>
                            <span className="text-[#38bdf8] font-black text-base font-mono">₹{Number(selectedOrderDetail.amount || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        )}


      </div>
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

