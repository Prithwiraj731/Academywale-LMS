import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaShoppingBag, FaCreditCard, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { API_URL } from '../api';
import { loadRazorpayCheckout } from '../utils/RazorpayCheckout';

const CartPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [loading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');

  const payableAmount = Math.max(0, Math.round(Number(cartTotal || 0) * (1 - appliedDiscount / 100)));

  const stateUserDetails = location.state?.userDetails || {};
  const [userDetails, setUserDetails] = useState({
    fullName: stateUserDetails.fullName || user?.name || '',
    email: stateUserDetails.email || user?.email || '',
    phone: stateUserDetails.phone || user?.mobile || '',
    address: stateUserDetails.address || null
  });

  // Authentication & Cart Empty check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: `/payment/cart`,
          message: 'Please log in to proceed with payment'
        } 
      });
      return;
    }
    
    if (cartItems.length === 0 && !paymentSuccess) {
      navigate('/student-dashboard');
    }
  }, [isAuthenticated, cartItems, navigate, paymentSuccess]);

  // Sync user details when user state loads or state changes
  useEffect(() => {
    if (location.state?.userDetails) {
      setUserDetails(location.state.userDetails);
    } else if (user) {
      setUserDetails({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.mobile || '',
        address: null
      });
    }
  }, [user, location.state]);

  useEffect(() => {
    setCoupon('');
    setCouponStatus('');
    setAppliedDiscount(0);
    setAppliedCouponCode('');
  }, [cartTotal]);

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    setCouponStatus('');

    if (!code) {
      setCouponStatus('Enter a coupon code.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const discount = Number(data.discountPercent || 0);
        setAppliedDiscount(discount);
        setAppliedCouponCode(code);
        setCouponStatus(`Coupon applied. ${discount}% discount added.`);
      } else {
        setAppliedDiscount(0);
        setAppliedCouponCode('');
        setCouponStatus(data.error || 'Invalid coupon code.');
      }
    } catch {
      setAppliedDiscount(0);
      setAppliedCouponCode('');
      setCouponStatus('Server error while applying coupon.');
    }
  };

  const handleInitiatePayment = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    setError('');
    
    try {
      // Create Razorpay Order on server
      const orderRes = await fetch(`${API_URL}/api/purchase/razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          amount: payableAmount
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to create payment order');
      }

      const { order } = orderData;

      // Load checkout popup
      await loadRazorpayCheckout({
        key: orderData.keyId,
        amount: order.amount,
        currency: order.currency,
        orderId: order.id,
        userId: user?.id || user?._id,
        payableAmount: payableAmount,
        cartItems: cartItems,
        coupon: appliedCouponCode || undefined,
        discountPercent: appliedDiscount || undefined,
        userDetails: {
          name: userDetails.fullName || user?.name,
          email: userDetails.email || user?.email,
          phone: userDetails.phone,
          address: userDetails.address
        },
        prefillName: userDetails.fullName || user?.name || '',
        prefillEmail: userDetails.email || user?.email || '',
        prefillPhone: userDetails.phone || user?.mobile || '',
        description: 'AcademyWale Cart Checkout'
      });

      // Clear cart
      clearCart();
      
      // Show success and redirect
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 3000);

    } catch (err) {
      console.error('Payment verification error:', err);
      setError(err.message || 'Payment initiation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-purple-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-teal-200">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-[#20b2aa] text-5xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Payment Successful!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your payment has been successfully verified. Your course purchases are now active.
            You will be redirected to your dashboard shortly.
          </p>
          <div className="text-sm text-gray-500 animate-pulse font-semibold">
            Redirecting to student dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f4] via-purple-50 to-yellow-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-700 hover:text-teal-800 font-semibold mb-6 transition-all"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-teal-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#20b2aa] to-[#126862] px-6 py-5 text-white flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <FaShoppingBag className="mr-3" /> Checkout Cart
              </h1>
              <p className="text-teal-100 text-sm mt-1">Pay via Razorpay</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-teal-100 block">Payable ({cartItems.length} items)</span>
              <span className="text-2xl font-extrabold">Rs. {payableAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 flex items-center gap-2 font-bold text-xs">
                <FaExclamationTriangle className="text-red-500 text-sm flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Cart summary list */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-150">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Items in Order</h3>
              <div className="divide-y divide-gray-200 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item, i) => (
                  <div key={item.uniqueId || i} className="py-3 flex justify-between items-center text-sm">
                    <div>
                      <p className="font-bold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500">
                        Mode: {item.mode || 'Standard'} | Exam Term: {item.attempt || 'Standard'}{item.validity ? ` | Validity: ${item.validity}` : ''} | Faculty: {item.facultyName}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">Rs. {Number(item.price).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {appliedDiscount > 0 && (
              <div className="bg-green-50/70 rounded-xl p-3 mb-4 border border-green-100 flex items-center gap-2 text-green-800 text-xs font-bold">
                <FaCheckCircle className="text-green-500 text-sm shrink-0" />
                <span>Coupon Applied: {appliedCouponCode} ({appliedDiscount}% OFF)</span>
              </div>
            )}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div className="bg-white rounded-lg border border-green-100 p-3">
                  <span className="block text-gray-500">Cart Total</span>
                  <span className="font-bold text-gray-900">Rs. {Number(cartTotal || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white rounded-lg border border-green-100 p-3">
                  <span className="block text-gray-500">Discount</span>
                  <span className="font-bold text-green-700">{appliedDiscount ? `${appliedDiscount}% (${appliedCouponCode})` : 'No coupon'}</span>
                </div>
                <div className="bg-white rounded-lg border border-green-100 p-3">
                  <span className="block text-gray-500">Payable</span>
                  <span className="font-bold text-gray-900">Rs. {payableAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            
            {/* User Details Verification Info */}
            <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100/50 mb-6">
              <h3 className="font-semibold text-[#126862] mb-3">Billing & Verification Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userDetails.fullName}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Mobile / Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userDetails.phone}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                    readOnly
                    disabled
                  />
                </div>
              </div>

              {userDetails.address && (
                <div className="pt-3 border-t border-teal-100/50">
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Billing & Shipping Address</label>
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                    <p className="font-semibold text-gray-800">{userDetails.address.street}</p>
                    <p className="text-gray-500">{userDetails.address.city}, {userDetails.address.state} - {userDetails.address.pinCode}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleInitiatePayment}
              disabled={submitting}
              className={`w-full font-bold py-4 rounded-xl shadow-md transition-all flex items-center justify-center text-lg gap-2 ${
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#20b2aa] to-[#126862] text-white hover:from-[#17817a] hover:to-[#105c56]'
              }`}
            >
              <FaCreditCard />
              <span>{submitting ? 'Initiating Checkout...' : `Pay Securely via Razorpay`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPaymentPage;
