import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft, FaRegClock, FaBook, FaLanguage, FaCalendarAlt,
  FaCheckCircle, FaUser, FaGraduationCap, FaChalkboardTeacher,
  FaShoppingCart, FaPhoneAlt, FaEnvelope, FaLaptop, FaQuestionCircle,
  FaExternalLinkAlt, FaBookOpen, FaTag, FaWhatsapp
} from 'react-icons/fa';
import { MdVideoLibrary } from 'react-icons/md';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCourseImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api';
import { normalizeCoursePricing } from '../utils/coursePricing';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CourseCard from '../components/common/CourseCard/CourseCard';
import CheckoutModal from '../components/common/CheckoutModal';

const CourseFullDetailPage = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedValidity, setSelectedValidity] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState('');
  const [selectedPrice, setSelectedPrice] = useState({ selling: 0, cost: 0 });
  const [addedMessage, setAddedMessage] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'highlights'
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Multi-Coupon Stacking & Visible Coupons State
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Fetch visible public coupons for this course
  useEffect(() => {
    async function fetchVisibleCoupons() {
      try {
        const targetId = course?.id || course?._id || courseId;
        const res = await fetch(`${API_URL}/api/coupons/public?courseId=${encodeURIComponent(targetId)}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setAvailableCoupons(data.coupons || []);
        }
      } catch (err) {
        console.log('Error fetching visible coupons:', err);
      }
    }
    if (course) fetchVisibleCoupons();
  }, [course, courseId]);

  // Handle Apply Coupon with specific code
  const handleApplyCouponWithCode = async (codeToApply) => {
    const code = String(codeToApply || '').trim().toUpperCase();
    setCouponStatus('');
    if (!code) {
      setCouponStatus('Enter a coupon code.');
      return;
    }

    if (appliedCoupons.some(c => c.code === code)) {
      setCouponStatus('This coupon code is already applied.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, courseId: course?.id || course?._id || courseId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const discountPct = Number(data.discountPercent || 0);
        const savingsRupees = Math.round(selectedPrice.selling * (discountPct / 100));
        const newCoupon = {
          code: data.code || code,
          discountPercent: discountPct,
          message: data.message || null
        };
        setAppliedCoupons(prev => [...prev, newCoupon]);
        setCouponCode('');
        setCouponStatus(`✅ Coupon ${code} applied! Saved ₹${savingsRupees.toLocaleString()}!`);
        setTimeout(() => setCouponStatus(''), 3000);
      } else {
        setCouponStatus(data.error || 'Invalid coupon code.');
      }
    } catch (err) {
      setCouponStatus('Server error while applying coupon.');
    }
  };

  const handleApplyCoupon = () => handleApplyCouponWithCode(couponCode);

  const handleRemoveCoupon = (codeToRemove) => {
    setAppliedCoupons(prev => prev.filter(c => c.code !== codeToRemove));
    setCouponStatus('');
  };

  // Stacked discount percent & rupee savings calculation
  const totalCouponDiscountPercent = Math.min(
    95,
    appliedCoupons.reduce((sum, c) => sum + (c.discountPercent || 0), 0)
  );

  const discountedSellingPrice = totalCouponDiscountPercent > 0
    ? Math.round(selectedPrice.selling * (1 - totalCouponDiscountPercent / 100))
    : selectedPrice.selling;

  const totalSavingsInRupees = selectedPrice.selling - discountedSellingPrice;

  // Handle proceed to payment (opens CheckoutModal)
  const handleProceedToPay = () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: `/course/${encodeURIComponent(courseType || 'general')}/${courseId}`,
          message: 'Please log in to purchase this course'
        }
      });
      return;
    }

    if (course.modeAttemptPricing && course.modeAttemptPricing.length > 0 &&
      (!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity))) {
      alert('Please select mode, validity, and batch before proceeding.');
      return;
    }

    setShowCheckoutModal(true);
  };

  const handleCheckoutProceed = (details, address) => {
    setShowCheckoutModal(false);
    navigate(`/payment/${encodeURIComponent(courseType || 'general')}/${courseId}`, {
      state: {
        selectedMode,
        selectedAttempt,
        selectedValidity,
        price: discountedSellingPrice,
        originalPrice: selectedPrice.selling,
        couponCode: appliedCoupons.map(c => c.code).join(', ') || undefined,
        couponDiscount: totalCouponDiscountPercent || undefined,
        appliedCoupons: appliedCoupons,
        course: course,
        userDetails: {
          fullName: details.fullName,
          email: details.email,
          phone: details.phone,
          address
        }
      }
    });
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (course.modeAttemptPricing && course.modeAttemptPricing.length > 0 &&
      (!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity))) {
      alert('Please select mode, validity, and batch before adding to cart.');
      return;
    }

    const added = addToCart(course, selectedMode, selectedAttempt, discountedSellingPrice, selectedValidity);
    if (added) {
      setAddedMessage('Added to cart successfully!');
      setTimeout(() => setAddedMessage(''), 3000);
    } else {
      setAddedMessage('Course option already in cart!');
      setTimeout(() => setAddedMessage(''), 3000);
    }
  };

  const getPosterUrl = (course) => {
    return getCourseImageUrl(course);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white/90 border border-gray-200 p-8 rounded-2xl shadow-xl backdrop-blur-md max-w-sm w-full text-center">
          <LoadingSpinner size="lg" />
          <div className="text-gray-500 mt-4 font-semibold">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 p-4 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-8 max-w-md w-full text-center text-gray-900">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">{error ? 'Error' : 'Course Not Found'}</h2>
          <p className="text-gray-500 mb-6">{error || "The course you're looking for doesn't exist or has been removed."}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatBatchOptionText = (text) => {
    if (!text) return '';
    if (text.includes(' / ')) {
      const parts = text.split(' / ');
      return parts[parts.length - 1].trim();
    }
    if (text.includes('/')) {
      const parts = text.split('/');
      return parts[parts.length - 1].trim();
    }
    return text;
  };

  const formatBatchLabelText = (label) => {
    if (!label || label === 'Exam Term / Attempt' || label === 'Option') return 'Batch';
    if (label.includes('/')) {
      const parts = label.split('/');
      return parts[parts.length - 1].trim();
    }
    return label;
  };

  // Pre-calculated discount percentage
  const discountPercent = selectedPrice.cost > selectedPrice.selling
    ? Math.round(((selectedPrice.cost - selectedPrice.selling) / selectedPrice.cost) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#20b2aa]/30 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Back Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#20b2aa] transition-colors duration-200 bg-gray-100 px-4 py-2 rounded-full border border-gray-200"
          >
            <FaArrowLeft /> Back to Courses
          </button>
        </div>

        {/* 1. TOP 2-COLUMN SECTION (Poster on Left, Title + Options on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12">
          
          {/* LEFT COLUMN: FULL POSTER IMAGE */}
          <div className="lg:col-span-5 order-1">
            <div className="w-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm p-3 flex flex-col items-center justify-center">
              <img
                src={getPosterUrl(course)}
                alt={course.subject || course.title}
                className="w-full h-auto max-h-[550px] object-contain rounded-xl"
                onError={(e) => {
                  e.target.src = '/logo.svg';
                }}
              />
              {course.facultyName && (
                <div className="w-full mt-4 pt-3 border-t border-gray-150 flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                    {course.facultyName[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm leading-snug">{course.facultyName}</h5>
                    <p className="text-xs text-teal-600 font-semibold">Faculty / Educator</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: COURSE TITLE + SUBTITLE + OPTIONS FORM */}
          <div className="lg:col-span-7 order-2 space-y-5">
            
            {/* Category Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-teal-50 text-teal-800 px-3 py-1 rounded-md text-xs font-extrabold uppercase border border-teal-200">
                {course.category} {course.subcategory}
              </span>
              {course.paper_id && (
                <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-md text-xs font-bold border border-purple-200">
                  Paper {course.paper_id}
                </span>
              )}
            </div>

            {/* Course Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
              {course.title || course.subject}
            </h1>

            {/* Red Call or WhatsApp subtitle */}
            <div className="text-red-600 font-bold text-sm sm:text-base flex items-center gap-2 bg-red-50/50 p-2.5 rounded-lg border border-red-100">
              <FaPhoneAlt className="text-xs shrink-0" />
              <span>Call or Whatsapp for more Details or Offers - 9693320108</span>
            </div>

            {/* Options Selection Form (Label on left, Dropdown on right) */}
            {course.modeAttemptPricing && course.modeAttemptPricing.length > 0 && (
              <div className="space-y-4 pt-2">
                
                {/* 1. Mode Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                  <label className="sm:col-span-4 font-bold text-gray-700 text-sm sm:text-base">
                    {course.modeAttemptPricing?.[0]?.modeLabel || 'Mode'}:
                  </label>
                  <div className="sm:col-span-8">
                    <select
                      value={selectedMode}
                      onChange={(e) => handleModeChange(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] font-medium text-gray-900 shadow-xs"
                    >
                      <option value="" disabled>Select Option</option>
                      {course.modeAttemptPricing.map((modeData, idx) => (
                        <option key={idx} value={modeData.mode}>
                          {modeData.mode}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Views & Validity Row */}
                {selectedMode && getUniqueValiditiesForMode(selectedMode).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-4 font-bold text-gray-700 text-sm sm:text-base">
                      {course.modeAttemptPricing?.find(m => m.mode === selectedMode)?.attempts?.[0]?.validityLabel || 'Views & Validity'}:
                    </label>
                    <div className="sm:col-span-8">
                      <select
                        value={selectedValidity}
                        onChange={(e) => handleValidityChange(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] font-medium text-gray-900 shadow-xs"
                      >
                        <option value="" disabled>Select Option</option>
                        {getUniqueValiditiesForMode(selectedMode).map((val, idx) => (
                          <option key={idx} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. Batch Row */}
                {selectedMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                    <label className="sm:col-span-4 font-bold text-gray-700 text-sm sm:text-base">
                      {formatBatchLabelText(course.modeAttemptPricing?.find(m => m.mode === selectedMode)?.attempts?.[0]?.attemptLabel)} :
                    </label>
                    <div className="sm:col-span-8">
                      <select
                        value={selectedAttempt}
                        onChange={(e) => handleAttemptChange(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] font-medium text-gray-900 shadow-xs"
                      >
                        <option value="" disabled>Select Option</option>
                        {getAttemptsForSelectedModeAndValidity().map((attempt, idx) => (
                          <option key={idx} value={attempt.attempt}>
                            {formatBatchOptionText(attempt.attempt)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Description Text Box */}
                {(() => {
                  const modeData = course?.modeAttemptPricing?.find(m => m.mode === selectedMode);
                  const attemptData = modeData?.attempts?.find(a =>
                    a.attempt === selectedAttempt &&
                    (!selectedValidity || a.validity === selectedValidity)
                  );
                  const desc = attemptData?.description || '';
                  if (desc) {
                    return (
                      <div className="bg-teal-50 border border-teal-200 p-3 rounded-lg text-teal-900 text-xs leading-relaxed mt-1">
                        {desc}
                      </div>
                    );
                  }
                  return null;
                })()}

              </div>
            )}

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-gray-200">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><FaTag className="text-teal-600" /> Apply Coupon Code (if any)</span>
                {totalSavingsInRupees > 0 && (
                  <span className="text-xs text-green-700 font-extrabold bg-green-100 px-2 py-0.5 rounded border border-green-200">
                    ₹{totalSavingsInRupees.toLocaleString()} OFF APPLIED
                  </span>
                )}
              </label>

              {/* Clickable Visible Available Coupon Badges */}
              {availableCoupons.length > 0 && (
                <div className="mb-3 space-y-1.5">
                  <div className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider">Available Coupons:</div>
                  <div className="flex flex-wrap gap-2">
                    {availableCoupons.map((coupon) => {
                      const isAlreadyApplied = appliedCoupons.some(c => c.code === coupon.code);
                      const discountAmount = Math.round(selectedPrice.selling * (coupon.discountPercent / 100));
                      return (
                        <button
                          key={coupon.code}
                          type="button"
                          disabled={isAlreadyApplied}
                          onClick={() => {
                            setCouponCode(coupon.code);
                            handleApplyCouponWithCode(coupon.code);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                            isAlreadyApplied
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-300 hover:border-teal-400 cursor-pointer'
                          }`}
                        >
                          <span>Apply <strong className="font-mono text-teal-900">{coupon.code}</strong> to get {discountAmount > 0 ? `₹${discountAmount.toLocaleString()} Off` : `${coupon.discountPercent}% Off`}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter Coupon Code (e.g. ACAD5)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] bg-white font-medium"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#20b2aa] hover:bg-[#1a9690] text-white font-bold text-sm px-5 py-2 rounded-lg transition-all shadow-xs"
                >
                  Apply
                </button>
              </div>

              {couponStatus && (
                <p className={`text-xs mb-2 font-bold ${couponStatus.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {couponStatus}
                </p>
              )}

              {/* Applied Coupons List with Rupee Savings */}
              {appliedCoupons.length > 0 && (
                <div className="space-y-2 mt-2 pt-2 border-t border-gray-150">
                  {appliedCoupons.map((c) => {
                    const couponSavings = Math.round(selectedPrice.selling * (c.discountPercent / 100));
                    return (
                      <div key={c.code} className="bg-green-50 border border-green-200 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <FaCheckCircle className="text-green-500 text-xs shrink-0" />
                            <span className="text-sm font-extrabold text-green-800 font-mono">{c.code}</span>
                            <span className="bg-green-200 text-green-900 text-xs px-2.5 py-0.5 rounded font-extrabold">
                              ₹{couponSavings.toLocaleString()} OFF
                            </span>
                          </div>
                          {c.message && (
                            <p className="text-xs text-teal-800 font-medium mt-1 pl-5">
                              💬 {c.message}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCoupon(c.code)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Price Display */}
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-baseline gap-3">
                {selectedPrice.selling > 0 ? (
                  <>
                    {totalCouponDiscountPercent > 0 ? (
                      <>
                        <span className="text-base text-gray-400 line-through font-semibold">
                          ₹{selectedPrice.selling.toLocaleString()}
                        </span>
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#20b2aa] tracking-tight">
                          ₹{discountedSellingPrice.toLocaleString()}
                        </span>
                        <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded font-extrabold border border-green-200">
                          ₹{totalSavingsInRupees.toLocaleString()} OFF APPLIED
                        </span>
                      </>
                    ) : (
                      <>
                        {selectedPrice.cost > selectedPrice.selling && (
                          <span className="text-lg text-gray-400 line-through font-semibold">
                            ₹{selectedPrice.cost.toLocaleString()}
                          </span>
                        )}
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#20b2aa] tracking-tight">
                          ₹{selectedPrice.selling.toLocaleString()}
                        </span>
                        {selectedPrice.cost > selectedPrice.selling && (
                          <span className="bg-teal-50 text-teal-700 text-xs px-2.5 py-0.5 rounded font-bold border border-teal-200">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-2xl font-extrabold text-gray-400">
                    Contact for pricing
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-3">
              <button
                onClick={handleProceedToPay}
                disabled={(!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0}
                className={`w-full font-bold py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center text-base transition-all duration-200 ${(!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : 'bg-[#20b2aa] hover:bg-[#19958e] text-white hover:shadow-lg'
                  }`}
              >
                {isAuthenticated ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaExternalLinkAlt className="text-xs" /> Buy Now
                  </span>
                ) : (
                  'Login to proceed'
                )}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={(!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0}
                className={`w-full font-bold py-3 px-6 rounded-xl flex items-center justify-center text-sm border-2 transition-all duration-200 ${(!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0
                    ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                    : isInCart(course.id || course._id, selectedMode, selectedAttempt, selectedValidity)
                      ? 'bg-teal-50 text-teal-600 border-[#20b2aa]'
                      : 'bg-transparent text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <FaShoppingCart className="mr-2 text-xs" />
                {isInCart(course.id || course._id, selectedMode, selectedAttempt, selectedValidity) ? 'Item in Cart ✓' : 'Add to Cart'}
              </button>

              {addedMessage && (
                <div className={`mt-2 text-xs font-semibold p-2.5 rounded-lg text-center border transition-all ${addedMessage.includes('successfully')
                    ? 'bg-teal-50 text-teal-850 border-teal-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                  {addedMessage}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* 2. FULL WIDTH DETAILS SECTION BELOW (SPECIFICATIONS TABLE & HIGHLIGHTS) */}
        <div className="order-3 mt-8">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 px-6 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'info'
                    ? 'border-[#20b2aa] text-[#20b2aa] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
              >
                <FaBookOpen /> Product Info
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`flex-1 py-4 px-6 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'highlights'
                    ? 'border-[#20b2aa] text-[#20b2aa] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
              >
                <FaChalkboardTeacher /> Highlights & Features
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'info' ? (
                /* SPECIFICATIONS TABLE */
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse rounded-xl overflow-hidden border border-gray-150">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
                        <th className="py-3.5 px-4 font-bold">Feature</th>
                        <th className="py-3.5 px-4 font-bold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {Array.isArray(course.customDetails) && course.customDetails.length > 0 ? (
                        course.customDetails
                          .filter(detail => detail.visible !== false && detail.value && detail.fieldType !== 'faculty' && detail.fieldType !== 'institute')
                          .map((detail, index) => {
                            const isAlternateColor = index % 2 === 0;
                            const rowClass = isAlternateColor ? "bg-gray-50/50 hover:bg-gray-50 transition-colors" : "hover:bg-gray-50 transition-colors";

                            return (
                              <tr key={index} className={rowClass}>
                                <td className="py-3.5 px-4 font-semibold text-gray-700">{detail.label}</td>
                                <td className="py-3.5 px-4 text-gray-900 font-medium">{detail.value}</td>
                              </tr>
                            );
                          })
                      ) : (
                        <>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700">Lecture Duration</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium">{course.timing || 'Approx 150+ Hours'}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700">No. of Lectures</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium">{course.noOfLecture || '50+ comprehensive sessions'}</td>
                          </tr>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700">Study Materials</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium">{course.books || 'ICMAI / ICAI based books'}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700">Video Run On</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium">{course.videoRunOn || 'Windows Laptop / Android Phone'}</td>
                          </tr>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700">Video Language</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium">{course.videoLanguage || 'Hindi + English mix'}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700">Doubt Solving Medium</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium">{course.doubtSolving || 'WhatsApp with mentor'}</td>
                          </tr>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700">Course Support</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium flex flex-wrap gap-x-4 gap-y-1">
                              {course.supportCall && <span className="flex items-center gap-1"><FaPhoneAlt className="text-xs text-teal-600" /> {course.supportCall}</span>}
                              {course.supportMail && <span className="flex items-center gap-1"><FaEnvelope className="text-xs text-teal-600" /> {course.supportMail}</span>}
                            </td>
                          </tr>
                        </>
                      )}
                      {course.instituteName && (
                        <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-gray-700">Institute Affiliation</td>
                          <td className="py-3.5 px-4 text-teal-600 font-bold">{course.instituteName}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* HIGHLIGHTS & DESCRIPTION */
                <div className="space-y-6">
                  {course.description && (
                    <div className="prose prose-teal max-w-none">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">Detailed Overview</h4>
                      <div className="text-gray-700 space-y-4 text-sm sm:text-base leading-relaxed">
                        {course.description}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-150 pt-6">
                    <h4 className="text-md font-bold text-gray-900 mb-4">Included Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 text-sm">
                      <div className="flex items-center gap-2.5">
                        <FaCheckCircle className="text-green-500 shrink-0" />
                        <span>100% syllabus coverage based on ICAI/ICMAI</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FaCheckCircle className="text-green-500 shrink-0" />
                        <span>Mock tests & exam preparation tips included</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FaCheckCircle className="text-green-500 shrink-0" />
                        <span>Interactive doubts portal access</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <FaCheckCircle className="text-green-500 shrink-0" />
                        <span>High-speed servers for lag-free video stream</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Courses Section */}
        {relatedCourses.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mb-8">
              Similar Related Courses
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 w-full">
              {relatedCourses.map((rCourse) => (
                <CourseCard key={rCourse.id || rCourse._id} course={rCourse} />
              ))}
            </div>
          </div>
        )}

      </div>

      {showCheckoutModal && (
        <CheckoutModal
          user={user}
          onClose={() => setShowCheckoutModal(false)}
          onProceed={handleCheckoutProceed}
          totalAmount={discountedSellingPrice}
          courseInfo={{
            id: courseId,
            title: course?.title,
            subject: course?.subject,
            selectedMode,
            selectedValidity,
            selectedAttempt
          }}
        />
      )}
    </div>
  );
};

export default CourseFullDetailPage;
