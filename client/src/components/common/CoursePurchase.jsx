import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MODES = ['Live Watching', 'Recorded Videos'];
const DURATIONS = ['August 2025', 'February 2026', 'August 2026', 'February 2027', 'August 2027'];
const VALIDITIES = ['6 Months', '12 Months', '18 Months'];
const BOOKS = ['Main Book', 'Workbook', 'Color Notes'];

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

export default function CoursePurchase({ course, onPurchaseSuccess, onPurchaseFailure }) {
  const { user } = useAuth ? useAuth() : { user: null };
  const parseOptions = (val, fallback) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.includes(',')) return val.split(',').map(v => v.trim()).filter(Boolean);
    if (typeof val === 'string' && val.length > 0) return [val];
    return fallback;
  };
  const modeOptions = parseOptions(course.modes, MODES);
  const durationOptions = parseOptions(course.durations, DURATIONS);
  const validityOptions = parseOptions(course.validityStartFrom, VALIDITIES);
  const booksOptions = parseOptions(course.books, BOOKS);
  const [selectedMode, setSelectedMode] = useState(modeOptions[0]);
  const [selectedDuration, setSelectedDuration] = useState(durationOptions[0]);
  const [selectedValidity, setSelectedValidity] = useState(validityOptions[0]);
  const [selectedBook, setSelectedBook] = useState(booksOptions[0]);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    const amount = (course.sellingPrice || course.price) * 100;
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount,
      currency: 'INR',
      name: 'AcademyWale',
      description: `Purchase: ${course.subject}`,
      image: '/logo.svg',
      handler: async function (response) {
        try {
          const purchaseRes = await fetch('/api/purchase/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user._id || user.email,
              facultySlug: course.facultySlug || course.facultyName,
              courseIndex: course.index || 0,
              amount: course.sellingPrice || course.price,
              paymentMethod: 'razorpay',
              transactionId: response.razorpay_payment_id,
            })
          });
          const data = await purchaseRes.json();
          if (purchaseRes.ok && data.success) {
            setSuccess(true);
            if (onPurchaseSuccess) onPurchaseSuccess();
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
    rzp.on('payment.failed', function () {
      setError('Payment failed. Please try again.');
      setIsPaying(false);
    });
    rzp.open();
  };

  if (success) {
    useEffect(() => {
      const timer = setTimeout(() => {
        window.location.href = '/student-dashboard';
      }, 3000);
      return () => clearTimeout(timer);
    }, []);
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-green-700">
        <svg width="80" height="80" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="#e6fffa" stroke="#10b981" strokeWidth="6" />
          <polyline
            points="35,65 55,85 85,45"
            fill="none"
            stroke="#10b981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ strokeDasharray: 100, strokeDashoffset: 0, animation: 'dash 1s ease-in-out forwards' }}
          />
        </svg>
        <div className="text-2xl font-bold mt-4">Payment Successful!</div>
        <div className="text-gray-600 mt-2">Redirecting to your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Purchase Course</h3>
      {/* Course Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">{course.subject}</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Faculty:</span>
            <span>{course.facultyName}</span>
          </div>
          <div className="flex justify-between">
            <span>Attempt:</span>
            <span>{course.duration}</span>
          </div>
          <div className="flex justify-between">
            <span>Lectures:</span>
            <span>{course.lectures || course.noOfLecture}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Price:</span>
            <span>
              <span className="text-gray-400 line-through mr-2">₹{course.costPrice}</span>
              <span className="text-green-600">₹{course.sellingPrice || course.price}</span>
            </span>
          </div>
        </div>
        {/* Mode, Duration, Validity, Books Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">Mode</label>
            <select
              value={selectedMode}
              onChange={e => setSelectedMode(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[180px]"
            >
              {modeOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">Attempt</label>
            <select
              value={selectedDuration}
              onChange={e => setSelectedDuration(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 min-w-[180px]"
            >
              {durationOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">Validity</label>
            <select
              value={selectedValidity}
              onChange={e => setSelectedValidity(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[180px]"
            >
              {validityOptions.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-500 mb-1">Books</label>
            <select
              value={selectedBook}
              onChange={e => setSelectedBook(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-400 min-w-[180px]"
            >
              {booksOptions.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>
      {/* Payment Methods */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-800">Choose Payment Method:</h4>
        <button
          onClick={handleRazorpayPayment}
          className="w-full p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
          disabled={isPaying}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Razorpay Payment</div>
                <div className="text-sm text-gray-600">Pay directly with Razorpay</div>
              </div>
            </div>
            <div className="text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
            💡 <strong>Desktop Tip:</strong> Enter your UPI ID to receive a payment request notification on your phone
          </div>
        </button>
        {error && <div className="text-red-600 text-center mt-2">{error}</div>}
      </div>
      {/* Features Included */}
      <div className="bg-green-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-green-800 mb-2">What's included:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>✅ Lifetime access to course content</li>
          <li>✅ {course.lectures || course.noOfLecture} video lectures</li>
          <li>✅ Course materials and resources</li>
          <li>✅ Certificate of completion</li>
          <li>✅ 24/7 support</li>
        </ul>
      </div>
      <div className="text-xs text-gray-500 text-center">
        By purchasing this course, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
} 