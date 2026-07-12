import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen, FaShoppingCart, FaUserGraduate, FaTrashAlt, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { API_URL } from '../api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { cartItems, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'cart'

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
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (purchase) => {
    const isExpired = purchase.isExpired;
    const status = purchase.paymentStatus || purchase.payment_status;

    if (isExpired) {
      return (
        <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          Expired
        </span>
      );
    }
    
    if (status === 'completed') {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          Active
        </span>
      );
    }

    if (status === 'pending_verification' || status === 'pending') {
      return (
        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
          Pending Verification
        </span>
      );
    }

    return (
      <span className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
        {status}
      </span>
    );
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Count helper functions
  const activeCount = purchases.filter(p => !p.isExpired && p.paymentStatus === 'completed').length;
  const pendingCount = purchases.filter(p => p.paymentStatus === 'pending_verification' || p.paymentStatus === 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f4] via-purple-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Welcome Glassmorphic Header */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-6 sm:p-8 mb-8 transition-all hover:shadow-2xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-[#20b2aa]/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#20b2aa] to-[#126862] flex items-center justify-center shadow-lg transform rotate-3">
                <span className="text-3xl font-extrabold text-white uppercase select-none">
                  {user.name ? user.name[0] : 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                  Welcome back, <span className="text-[#126862]">{user.name || 'Learner'}</span>!
                </h1>
                <p className="text-gray-600 text-sm sm:text-base mt-1 font-medium">
                  {user.email} | Student Panel
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('courses')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md ${
                  activeTab === 'courses' 
                    ? 'bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white hover:shadow-lg' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                My Courses ({purchases.length})
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md flex items-center ${
                  activeTab === 'cart' 
                    ? 'bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white hover:shadow-lg' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <FaShoppingCart className="mr-2" /> Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border border-teal-50 flex items-center space-x-4">
            <div className="p-3 bg-teal-50 rounded-lg text-[#20b2aa]">
              <FaBookOpen className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Purchased</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-800">{purchases.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-emerald-50 flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <FaCheckCircle className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Active</p>
              <p className="text-lg sm:text-2xl font-bold text-emerald-600">{activeCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-amber-50 flex items-center space-x-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <FaClock className="text-xl animate-pulse" />
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">Pending</p>
              <p className="text-lg sm:text-2xl font-bold text-amber-600">{pendingCount}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-5 border border-purple-50 flex items-center space-x-4 cursor-pointer hover:border-purple-200 transition-colors" onClick={() => setActiveTab('cart')}>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <FaShoppingCart className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wider">In Cart</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">{cartCount}</p>
            </div>
          </div>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'courses' ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-teal-50">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
              <FaUserGraduate className="mr-3 text-[#20b2aa]" /> My Enrolled Courses
            </h2>
            
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20b2aa] mb-3"></div>
                <p className="text-gray-500 text-sm">Loading purchased courses...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-700 text-center py-8 px-4 rounded-xl border border-red-200">
                <FaExclamationCircle className="mx-auto text-3xl mb-2 text-red-500" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            {!loading && !error && purchases.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-teal-50 rounded-full flex items-center justify-center text-[#20b2aa]">
                  <FaBookOpen className="text-3xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-1">No courses purchased yet</h3>
                <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-6">
                  Ready to start learning? Explore our comprehensive courses from leading CA & CMA faculty.
                </p>
                <button 
                  onClick={() => navigate('/courses/all')}
                  className="bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Explore All Courses
                </button>
              </div>
            )}

            {!loading && !error && purchases.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchases.map((purchase) => {
                  const courseDetails = purchase.courseDetails || purchase.course_details || {};
                  const isPending = purchase.paymentStatus === 'pending_verification' || purchase.paymentStatus === 'pending';
                  
                  return (
                    <div 
                      key={purchase.id} 
                      className="bg-white rounded-2xl shadow-md border border-gray-150 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]"
                    >
                      {/* Card Poster Image */}
                      <div className="relative bg-teal-900/5 h-40 flex items-center justify-center overflow-hidden">
                        {courseDetails.posterUrl ? (
                          <img 
                            src={`${API_URL}${courseDetails.posterUrl}`} 
                            alt={courseDetails.subject || 'Course'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-teal-800">
                            <FaBookOpen className="text-4xl opacity-40 mb-2" />
                            <span className="text-xs uppercase font-extrabold tracking-wider opacity-60">AcademyWale</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(purchase)}
                        </div>
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-extrabold text-gray-800 line-clamp-2 leading-snug mb-1">
                            {courseDetails.title || courseDetails.subject || 'Course Detail'}
                          </h3>
                          <p className="text-sm font-semibold text-teal-700 mb-3">
                            Faculty: {courseDetails.facultyName || 'Expert Faculty'}
                          </p>
                          
                          <div className="space-y-1.5 bg-gray-50 rounded-xl p-3 text-xs mb-4">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Mode:</span>
                              <span className="font-bold text-gray-700">{courseDetails.mode || 'Online'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Validity:</span>
                              <span className="font-bold text-gray-700">{courseDetails.validity || '1 Year'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Price Paid:</span>
                              <span className="font-bold text-gray-800">₹{Number(purchase.amount || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mt-auto">
                          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>Purchased:</span>
                            <span className="font-medium text-gray-700">{formatDate(purchase.purchaseDate || purchase.purchase_date)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mb-4">
                            <span>Expiry Date:</span>
                            <span className="font-medium text-gray-700">{formatDate(purchase.accessExpiry || purchase.access_expiry)}</span>
                          </div>
                          
                          {isPending ? (
                            <div className="bg-amber-50 text-amber-800 text-center py-2.5 rounded-xl text-xs font-bold border border-amber-100">
                              Awaiting Verification
                            </div>
                          ) : (
                            <button className="w-full bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-md transition-all">
                              Start Learning
                            </button>
                          )}
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
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-teal-50">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 mb-6 flex items-center">
              <FaShoppingCart className="mr-3 text-[#20b2aa]" /> My Shopping Cart
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 bg-purple-50 rounded-full flex items-center justify-center text-purple-500">
                  <FaShoppingCart className="text-3xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-1">Your cart is empty</h3>
                <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-6">
                  Add courses from CA/CMA detail pages to purchase them collectively here.
                </p>
                <button 
                  onClick={() => navigate('/courses/all')}
                  className="bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div 
                      key={item.uniqueId} 
                      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 hover:border-teal-200 transition-colors"
                    >
                      <div className="w-full sm:w-24 h-16 bg-[#20b2aa]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.posterUrl ? (
                          <img 
                            src={`${API_URL}${item.posterUrl}`} 
                            alt={item.title} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <FaBookOpen className="text-teal-800 opacity-30 text-2xl" />
                        )}
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-gray-800 leading-snug line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Faculty: {item.facultyName}</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                          <span className="bg-teal-50 text-[#126862] text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                            Mode: {item.mode || 'Online'}
                          </span>
                          <span className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded font-extrabold uppercase">
                            Validity: {item.attempt || '1 Year'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                        <span className="font-extrabold text-gray-900 text-lg">
                          ₹{Number(item.price || 0).toLocaleString()}
                        </span>
                        
                        <button
                          onClick={() => removeFromCart(item.uniqueId)}
                          className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Checkout Summary Box */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 h-fit">
                  <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6 border-b border-gray-200 pb-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span className="font-semibold text-gray-800">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Discount</span>
                      <span className="font-semibold text-green-600">₹0</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Payment Method</span>
                      <span className="font-semibold text-gray-800">UPI Scan</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-gray-800 font-bold text-base">Total Price</span>
                    <span className="text-2xl font-extrabold text-[#126862]">₹{cartTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => navigate('/payment/cart')}
                    className="w-full bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white py-3.5 rounded-xl font-bold hover:shadow-lg shadow-md transition-all text-center block"
                  >
                    Proceed to Payment
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
