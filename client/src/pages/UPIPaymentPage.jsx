import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaCreditCard } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { API_URL } from '../api';
import { loadRazorpayCheckout } from '../utils/RazorpayCheckout';

const UPIPaymentPage = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  
  // Get details passed from the previous page
  const selectedMode = location.state?.selectedMode || '';
  const selectedValidity = location.state?.selectedValidity || '';
  const selectedAttempt = location.state?.selectedAttempt || '';
  const userDetails = location.state?.userDetails || {};
  const priceFromState = location.state?.price;
  const baseAmount = Number(priceFromState || course?.sellingPrice || 0);
  const payableAmount = Math.max(0, Math.round(baseAmount * (1 - appliedDiscount / 100)));

  const [alreadyPurchased, setAlreadyPurchased] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/courses/details/${courseId}`);
        const data = await res.json();
        
        if (res.ok) {
          setCourse(data.course);
        } else {
          setError(data.message || 'Failed to fetch course details');
        }
      } catch (err) {
        setError('Server error while fetching course details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Check if student has already purchased this course
  useEffect(() => {
    async function checkPurchased() {
      if (!user) return;
      try {
        const uId = user.id || user._id;
        const res = await fetch(`${API_URL}/api/purchase/user/${uId}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.purchases)) {
          const userPurchases = data.purchases;
          const isEnrolled = userPurchases.some(p => {
            const pCourseId = p.course_id;
            const pTitle = (p.course_details?.title || p.course_details?.subject || '').toLowerCase().trim();
            const targetTitle = (course?.title || course?.subject || '').toLowerCase().trim();
            return pCourseId === courseId || (targetTitle && pTitle === targetTitle);
          });

          if (isEnrolled) {
            setAlreadyPurchased(true);
          }
        }
      } catch (err) {
        console.error('Error checking user purchases:', err);
      }
    }
    checkPurchased();
  }, [user, courseId, course]);

  // Authentication check
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login', { 
        state: { 
          from: `/payment/${courseType}/${courseId}`,
          message: 'Please log in to proceed with payment'
        } 
      });
    }
  }, [isAuthenticated, loading, navigate, courseId, courseType]);

  useEffect(() => {
    setCoupon('');
    setCouponStatus('');
    setAppliedDiscount(0);
    setAppliedCouponCode('');
  }, [courseId, priceFromState]);

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
        body: JSON.stringify({ 
          code, 
          courseId: courseId || course?.id || course?._id,
          userId: user?.id || user?._id,
          userEmail: user?.email
        })

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

  const handleInitiatePayment = async () => {
    if (alreadyPurchased) {
      setError('You have already purchased this course! Check your Student Dashboard.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      // Create Razorpay Order on server
      const orderRes = await fetch(`${API_URL}/api/purchase/razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user?.id || user?._id,
          amount: payableAmount,
          courseId: courseId
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        if (orderData.alreadyPurchased) {
          setAlreadyPurchased(true);
        }
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
        courseId: courseId,
        payableAmount: payableAmount,
        coupon: appliedCouponCode || undefined,
        discountPercent: appliedDiscount || undefined,
        userDetails: {
          name: userDetails.fullName || user?.name,
          email: userDetails.email || user?.email,
          phone: userDetails.phone || user?.mobile || '',
          address: userDetails.address
        },
        courseDetails: {
          courseName: course?.title || course?.subject,
          mode: selectedMode,
          validity: selectedValidity,
          attempt: selectedAttempt,
          coupon: appliedCouponCode || '',
          discountPercent: appliedDiscount || 0
        },
        prefillName: userDetails.fullName || user?.name || '',
        prefillEmail: userDetails.email || user?.email || '',
        prefillPhone: userDetails.phone || user?.mobile || '',
        description: course?.title || course?.subject || 'Course Purchase'
      });

      // Show success
      setPaymentSuccess(true);
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 3000);

    } catch (err) {
      console.error('Payment flow error:', err);
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-green-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-green-600 mb-3">Payment Successful!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed font-medium">
            Your payment has been successfully verified. Your course purchase is complete and active.
            You will be redirected to your dashboard shortly.
          </p>
          <button
            onClick={() => navigate('/student-dashboard')}
            className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white py-3 rounded-xl font-bold transition-all shadow-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!course && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-gray-600 font-bold text-xl mb-4">Course not found</div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Checkout Details</h1>
            <p className="opacity-90 text-sm mt-1">Review your summary and complete your payment securely via Razorpay.</p>
          </div>
          
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Course Summary */}
            <div>
              <h3 className="font-extrabold text-gray-800 text-lg mb-4">Order Summary</h3>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-150 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Course Title</label>
                  <p className="text-gray-800 font-extrabold leading-snug">{course?.title || course?.subject}</p>
                </div>
                {selectedMode && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Mode</label>
                    <p className="text-gray-800 font-semibold text-sm">{selectedMode}</p>
                  </div>
                )}
                {selectedValidity && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Validity</label>
                    <p className="text-gray-800 font-semibold text-sm">{selectedValidity}</p>
                  </div>
                )}
                {selectedAttempt && (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Attempt</label>
                    <p className="text-gray-800 font-semibold text-sm">{selectedAttempt}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase">Faculty</label>
                  <p className="text-teal-700 font-bold text-sm">{course?.faculty_name || course?.facultyName}</p>
                </div>
              </div>
            </div>

            {/* Pricing & Checkout */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-gray-800 text-lg mb-4">Payment Summary</h3>
                <div className="bg-gradient-to-tr from-blue-50/50 to-purple-50/50 rounded-2xl p-5 border border-blue-100/50 space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600 font-medium">
                    <span>Base Amount</span>
                    <span>₹{baseAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-{appliedDiscount}%</span>
                    </div>
                  )}
                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                    <span className="font-extrabold text-gray-800">Total Payable</span>
                    <span className="text-2xl font-black text-purple-700">₹{payableAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Coupon Applied Notification Tag */}
                {appliedDiscount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2 text-green-800 text-xs font-bold shadow-xs">
                    <FaCheckCircle className="text-green-500 text-sm shrink-0" />
                    <span>Applied Coupon Discount ({appliedDiscount}% OFF)</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl p-3 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-500 text-sm flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {alreadyPurchased ? (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-6 text-center shadow-lg">
                  <div className="text-4xl mb-2">🎓</div>
                  <h3 className="text-xl font-bold text-amber-800 mb-2">Already Enrolled in this Course!</h3>
                  <p className="text-sm text-amber-700 mb-4">
                    You have already purchased this course. You can access all course materials directly from your Student Dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/student-dashboard')}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold py-3.5 px-6 rounded-xl transition-all shadow-md text-base"
                  >
                    Go to Student Dashboard
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  <FaCreditCard />
                  <span>{submitting ? 'Initiating Checkout...' : `Pay Securely via Razorpay`}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentPage;
