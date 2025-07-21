import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaQrcode, FaMobile, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

// Razorpay script loader
function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const RAZORPAY_KEY_ID = 'rzp_live_yTZxWd8ztKSYk5';

const PaymentPage = () => {
  const { slug, courseIndex } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log('PaymentPage user:', user);
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponStatus, setCouponStatus] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [slug, courseIndex]);

  useEffect(() => {
    if (course) {
      setFinalPrice(course.sellingPrice);
      setAppliedDiscount(0);
      setCoupon('');
      setCouponStatus('');
    }
  }, [course]);

  const handleApplyCoupon = async () => {
    setCouponStatus('');
    if (!coupon.trim()) {
      setCouponStatus('Enter a coupon code.');
      return;
    }
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon.trim().toUpperCase() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const discount = data.discountPercent;
        setAppliedDiscount(discount);
        const discounted = Math.round(course.sellingPrice * (1 - discount / 100));
        setFinalPrice(discounted);
        setCouponStatus(`Coupon applied! ${discount}% off.`);
      } else {
        setAppliedDiscount(0);
        setFinalPrice(course.sellingPrice);
        setCouponStatus(data.error || 'Invalid coupon.');
      }
    } catch {
      setCouponStatus('Server error.');
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/courses/${slug}`);
      console.log('Fetching courses for:', slug);
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);
        const idx = parseInt(courseIndex, 10);
        console.log('Requested course index:', idx);
        if (data.courses && data.courses[idx]) {
          setCourse(data.courses[idx]);
          console.log('Selected course:', data.courses[idx]);
        } else {
          setCourse(null);
          console.warn('No course found at index', idx);
        }
      } else {
        setCourse(null);
        console.warn('API response not ok');
      }
    } catch (error) {
      setCourse(null);
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!user) {
      setError('You must be logged in to purchase.');
      return;
    }
    setError('');
    setIsPaying(true);
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      setError('Failed to load Razorpay SDK.');
      setIsPaying(false);
      return;
    }
    const amount = (finalPrice ?? course.sellingPrice) * 100; // Razorpay expects paise
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount,
      currency: 'INR',
      name: 'AcademyWale',
      description: `Purchase: ${course.subject}`,
      image: '/public/logo.svg',
      handler: async function (response) {
        // On payment success, call backend to record purchase
        try {
          const purchaseRes = await fetch('/api/purchase/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id || user.email, // fallback to email if _id is missing
              facultySlug: slug,
              courseIndex: parseInt(courseIndex, 10),
              amount: finalPrice ?? course.sellingPrice,
              paymentMethod: 'razorpay',
              transactionId: response.razorpay_payment_id,
              coupon: coupon.trim().toUpperCase() || undefined
            })
          });
          const data = await purchaseRes.json();
          if (purchaseRes.ok && data.success) {
            setPaymentSuccess(true);
            setTimeout(() => {
              navigate('/student-dashboard');
            }, 3500);
          } else {
            setError(data.message || 'Payment recorded failed.');
          }
        } catch (err) {
          setError('Payment recorded failed.');
        }
        setIsPaying(false);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.mobile || ''
      },
      theme: { color: '#0e7490' }
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      setError('Payment failed. Please try again.');
      setIsPaying(false);
    });
    rzp.open();
  };

  // Remove all UPI/QR/manual payment logic and related state/handlers
  // Add Razorpay payment button placeholder
  // Add success animation and redirect logic after payment
  // Ensure costPrice and sellingPrice are displayed

  const handleBackToCourse = () => {
    navigate(`/faculties/${slug}`);
  };

  // Calculate discount
  let discount = 0;
  if (course && course.costPrice && course.sellingPrice && course.costPrice > course.sellingPrice) {
    discount = Math.round(((course.costPrice - course.sellingPrice) / course.costPrice) * 100);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Loading...</div>;
  }

  if (!course) {
    console.warn('Rendering: course is null or not found');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-2xl text-red-600 font-bold">
        <div>Course not found or unavailable.</div>
        <button
          onClick={() => navigate('/faculties')}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold shadow"
        >
          Go Back to Faculties
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            {/* Beautiful animated success checkmark */}
            <svg className="mx-auto" width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="#e6fffa" stroke="#10b981" strokeWidth="6" />
              <polyline
                points="35,65 55,85 85,45"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 0,
                  animation: 'dash 1s ease-in-out forwards',
                }}
              />
              <style>{`
                @keyframes dash {
                  from { stroke-dashoffset: 100; }
                  to { stroke-dashoffset: 0; }
                }
              `}</style>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-4 animate-bounce">Payment Successful!</h2>
          <p className="text-gray-600 mb-6 animate-fade-in">
            Your course has been purchased successfully. You will be redirected to your dashboard shortly.
          </p>
          <div className="animate-pulse">
            <div className="h-2 bg-green-200 rounded-full mb-2"></div>
            <div className="h-2 bg-green-200 rounded-full mb-2"></div>
            <div className="h-2 bg-green-200 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={handleBackToCourse}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Course
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Purchase</h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Course Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Subject:</span>
                <span className="text-gray-900">{course.subject}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Faculty:</span>
                <span className="text-gray-900">{course.facultyName}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Attempt:</span>
                <span className="text-gray-900">{location.state?.selectedAttempt || course.duration || 'Not specified'}</span>
              </div>
              {/* Price Section */}
              <div className="mb-4">
                <label className="font-semibold text-gray-700 cursor-pointer">Apply Coupon Code (if any)</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="border border-gray-300 rounded px-3 py-1 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                    style={{ maxWidth: 180 }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 font-semibold"
                  >Apply</button>
                </div>
                {couponStatus && <div className={`mt-1 text-sm ${appliedDiscount ? 'text-green-600' : 'text-red-600'}`}>{couponStatus}</div>}
              </div>
              <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                <span className="text-xl font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
                <span className="text-2xl font-bold text-indigo-700">₹{finalPrice ?? course.sellingPrice}</span>
                {course.costPrice > (finalPrice ?? course.sellingPrice) && (
                  <span className="bg-green-400 text-white font-bold px-4 py-1 rounded-full text-base">
                    {Math.round(((course.costPrice - (finalPrice ?? course.sellingPrice)) / course.costPrice) * 100)}% off
                  </span>
                )}
              </div>
            </div>
            {/* Coupon code info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">What you'll get:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Complete course access</li>
                <li>• Study materials and resources</li>
                <li>• Certificate upon completion</li>
                <li>• 24/7 support</li>
              </ul>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MdPayment className="mr-2 text-indigo-600" />
              Payment Method
            </h2>
            {/* Payment Options */}
            {(!user || isAdmin) ? (
              <div className="text-center mt-6">
                <p className="text-red-600 font-semibold mb-4">
                  {isAdmin ? 'Admins cannot purchase courses.' : 'You must be logged in to proceed with payment.'}
                </p>
                {!isAdmin && (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold"
                  >
                    Login to Pay
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center mt-6">
                <button
                  onClick={handleRazorpayPayment}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg disabled:opacity-60"
                  disabled={isPaying}
                >
                  {isPaying ? 'Processing...' : `Pay ₹${finalPrice ?? course.sellingPrice} Securely`}
                </button>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
                    {error}
                  </div>
                )}
              </div>
            )}
            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <FaCheckCircle className="text-green-500 mr-2" />
                <span>Secure payment powered by UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage; 