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

// Helper to split numbered lists (1. ... 2. ...) and multiline strings into clean line-by-line blocks
const renderFormattedText = (val) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') {
    try {
      val = JSON.stringify(val);
    } catch {
      return '';
    }
  }
  const str = String(val).trim();
  if (!str) return '';

  // If web URL
  if (/^https?:\/\//i.test(str)) {
    return (
      <a
        href={str}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#20b2aa] hover:underline font-semibold break-all inline-flex items-center gap-1"
      >
        {str} <FaExternalLinkAlt className="text-[10px] shrink-0 inline" />
      </a>
    );
  }

  // 1. First split by newlines if present
  let lines = str.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 2. If single line, check if it contains inline numbered items like "1. ... 2. ... 3. ..."
  if (lines.length === 1) {
    const splitRegex = /(?=\b\d+[\.\)]\s+)/;
    const parts = str.split(splitRegex).map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
      lines = parts;
    }
  }

  // If multiple items, render line-by-line numberwise
  if (lines.length > 1) {
    return (
      <div className="flex flex-col gap-1.5 py-0.5 w-full">
        {lines.map((line, idx) => (
          <div key={idx} className="text-gray-900 font-medium leading-relaxed flex items-start gap-1.5">
            <span>{line}</span>
          </div>
        ))}
      </div>
    );
  }

  return <span className="whitespace-pre-wrap leading-relaxed">{str}</span>;
};

const safeFormatPrice = (val) => {
  const num = Number(val);
  if (isNaN(num)) return '0';
  return num.toLocaleString();
};

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

  const [selectedSubOptions, setSelectedSubOptions] = useState([]);

  // Dynamic Multi-Option Helper Functions
  const getCurrentModeData = (targetCourse = course, modeName = selectedMode) => {
    if (!targetCourse || !targetCourse.modeAttemptPricing || !modeName) return null;
    return targetCourse.modeAttemptPricing.find(m => m.mode === modeName) || null;
  };

  const getSubOptionLabels = (targetCourse = course, modeName = selectedMode) => {
    const modeData = getCurrentModeData(targetCourse, modeName);
    if (!modeData || !modeData.attempts || modeData.attempts.length === 0) return [];
    const firstAttempt = modeData.attempts[0];
    const labelStr = firstAttempt.attemptLabel || firstAttempt.validityLabel || 'Option';
    return labelStr.split(' / ').map(s => s.trim());
  };

  const getSubOptionValuesForModeAndSelections = (modeObj, index, currentSelections) => {
    if (!modeObj || !modeObj.attempts) return [];
    const matchingAttempts = modeObj.attempts.filter(a => {
      const parts = (a.attempt || '').split(' / ').map(s => s.trim());
      for (let k = 0; k < index; k++) {
        if (currentSelections[k] && parts[k] !== currentSelections[k]) {
          return false;
        }
      }
      return true;
    });

    const valuesAtIndex = matchingAttempts
      .map(a => {
        const parts = (a.attempt || '').split(' / ').map(s => s.trim());
        return parts[index] || '';
      })
      .filter(Boolean);

    return Array.from(new Set(valuesAtIndex));
  };

  const updatePriceAndAttemptFromSubOptions = (modeObj, subOpts) => {
    if (!modeObj || !modeObj.attempts) return;
    const matching = modeObj.attempts.find(a => {
      const parts = (a.attempt || '').split(' / ').map(s => s.trim());
      return subOpts.every((val, idx) => !val || parts[idx] === val);
    }) || modeObj.attempts[0];

    if (matching) {
      setSelectedAttempt(matching.attempt || '');
      setSelectedValidity(matching.validity || subOpts[0] || '');
      setSelectedPrice({
        selling: Number(matching.sellingPrice || 0),
        cost: Number(matching.costPrice || 0)
      });
    }
  };

  const initializeSubOptionsForMode = (targetCourse, modeName) => {
    if (!targetCourse || !targetCourse.modeAttemptPricing) return;
    const modeObj = targetCourse.modeAttemptPricing.find(m => m.mode === modeName);
    if (!modeObj || !modeObj.attempts || modeObj.attempts.length === 0) {
      setSelectedSubOptions([]);
      setSelectedValidity('');
      setSelectedAttempt('');
      setSelectedPrice({ selling: 0, cost: 0 });
      return;
    }

    const labels = (modeObj.attempts[0].attemptLabel || modeObj.attempts[0].validityLabel || 'Option')
      .split(' / ').map(s => s.trim());

    const newSubOptions = [];
    for (let i = 0; i < labels.length; i++) {
      const availableVals = getSubOptionValuesForModeAndSelections(modeObj, i, newSubOptions);
      newSubOptions.push(availableVals.length > 0 ? availableVals[0] : '');
    }

    setSelectedSubOptions(newSubOptions);
    updatePriceAndAttemptFromSubOptions(modeObj, newSubOptions);
  };

  const handleModeChange = (newMode) => {
    setSelectedMode(newMode);
    initializeSubOptionsForMode(course, newMode);
  };

  const handleSubOptionChange = (index, value) => {
    const modeObj = getCurrentModeData();
    if (!modeObj) return;

    const labels = getSubOptionLabels();
    const updatedSubOpts = [...selectedSubOptions];
    updatedSubOpts[index] = value;

    for (let j = index + 1; j < labels.length; j++) {
      const avail = getSubOptionValuesForModeAndSelections(modeObj, j, updatedSubOpts);
      updatedSubOpts[j] = avail.length > 0 ? avail[0] : '';
    }

    setSelectedSubOptions(updatedSubOpts);
    updatePriceAndAttemptFromSubOptions(modeObj, updatedSubOpts);
  };

  // Legacy fallback helpers
  const getUniqueValiditiesForMode = (mode) => {
    if (!course || !course.modeAttemptPricing) return [];
    const modeObj = course.modeAttemptPricing.find(m => m.mode === mode);
    if (!modeObj || !modeObj.attempts) return [];
    const validities = modeObj.attempts
      .map(a => a.validity)
      .filter(v => v !== undefined && v !== null && v !== '');
    return Array.from(new Set(validities));
  };

  const getAttemptsForSelectedModeAndValidity = () => {
    if (!course || !course.modeAttemptPricing || !selectedMode) return [];
    const modeObj = course.modeAttemptPricing.find(m => m.mode === selectedMode);
    if (!modeObj || !modeObj.attempts) return [];
    return modeObj.attempts;
  };

  // Fetch course details
  useEffect(() => {
    async function fetchCourseDetails() {
      setLoading(true);
      setError('');
      try {
        let apiUrl = `${API_URL}/api/courses/details/${courseId}`;
        if (courseType) {
          apiUrl += `?courseType=${encodeURIComponent(courseType)}`;
        }

        console.log(`Fetching course details from: ${apiUrl}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch course details: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.course) {
          throw new Error('Invalid course data received');
        }

        const normalizedCourse = normalizeCoursePricing(data.course);
        setCourse(normalizedCourse);

        // Initialize mode, validity, attempt and sub-options selection
        if (normalizedCourse.modeAttemptPricing && normalizedCourse.modeAttemptPricing.length > 0) {
          const firstMode = normalizedCourse.modeAttemptPricing[0];
          setSelectedMode(firstMode.mode);
          initializeSubOptionsForMode(normalizedCourse, firstMode.mode);
        } else {
          setSelectedPrice({
            selling: Number(data.course.sellingPrice || data.course.selling_price || 0),
            cost: Number(data.course.costPrice || data.course.cost_price || 0)
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err.message || 'Failed to load course details');
        setLoading(false);
      }
    }


    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, courseType]);

  // Fetch related courses
  useEffect(() => {
    if (course) {
      async function fetchRelated() {
        try {
          const res = await fetch(`${API_URL}/api/courses/all`);
          const data = await res.json();
          if (res.ok && data.courses) {
            const filtered = data.courses.filter(c =>
              c.category === course.category &&
              c.subcategory === course.subcategory &&
              c._id !== (course.id || course._id) &&
              c.id !== (course.id || course._id)
            );
            setRelatedCourses(filtered.slice(0, 4));
          }
        } catch (err) {
          console.log('Error fetching related courses:', err);
        }
      }
      fetchRelated();
    }
  }, [course?.id, course?._id, course?.category, course?.subcategory]);

  // Reset coupons when option choices change
  useEffect(() => {
    setAppliedCoupons([]);
    setCouponStatus('');
    setCouponCode('');
  }, [selectedMode, selectedValidity, selectedAttempt]);

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
  }, [course?.id, course?._id, courseId]);

  // Coupon Modal State
  const [showApplyCouponModal, setShowApplyCouponModal] = useState(false);
  const [couponModalInput, setCouponModalInput] = useState('');
  const [modalCouponError, setModalCouponError] = useState('');

  // Handle Apply Coupon with specific code
  const handleApplyCouponWithCode = async (codeToApply) => {
    const code = String(codeToApply || '').trim().toUpperCase();
    setModalCouponError('');
    if (!code) {
      setModalCouponError('Please enter a coupon code.');
      return;
    }


    try {
      const res = await fetch(`${API_URL}/api/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          courseId: course?.id || course?._id || courseId,
          userId: user?.id || user?._id,
          userEmail: user?.email
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const discountPct = Number(data.discountPercent || 0);
        const newCoupon = {
          code: data.code || code,
          discountPercent: discountPct,
          message: data.message || null
        };
        setAppliedCoupons([newCoupon]); // Replace applied coupon (no duplicate stacking!)
        setShowApplyCouponModal(false);
        setCouponModalInput('');
        setModalCouponError('');
        setCouponStatus(`✅ Coupon ${code} applied successfully!`);
        setTimeout(() => setCouponStatus(''), 3000);
      } else {
        setModalCouponError(data.error || 'The coupon is not applicable for the selected products!');
      }
    } catch (err) {
      setModalCouponError('Server error while applying coupon.');
    }
  };

  const handleApplyCoupon = () => handleApplyCouponWithCode(couponCode);

  const handleRemoveCoupon = (codeToRemove) => {
    setAppliedCoupons(prev => prev.filter(c => c.code !== codeToRemove));
    setCouponStatus('');
  };


  const baseSellingPrice = Number(selectedPrice?.selling || 0);
  const baseCostPrice = Number(selectedPrice?.cost || 0);

  // Stacked discount percent & rupee savings calculation
  const totalCouponDiscountPercent = Math.min(
    95,
    appliedCoupons.reduce((sum, c) => sum + (c.discountPercent || 0), 0)
  );

  const discountedSellingPrice = totalCouponDiscountPercent > 0
    ? Math.round(baseSellingPrice * (1 - totalCouponDiscountPercent / 100))
    : baseSellingPrice;

  const totalSavingsInRupees = Math.max(0, baseSellingPrice - discountedSellingPrice);

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
      (!selectedMode || !selectedAttempt || selectedSubOptions.some(s => !s))) {
      alert('Please select all course options before proceeding.');
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
      (!selectedMode || !selectedAttempt || selectedSubOptions.some(s => !s))) {
      alert('Please select all course options before adding to cart.');
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
                </div>                {/* Dynamic Sub-Options Rows (Batch, Exam Term, Mode of Books, etc.) */}
                {selectedMode && getSubOptionLabels().map((label, optIdx) => {
                  const modeObj = getCurrentModeData();
                  const availableVals = getSubOptionValuesForModeAndSelections(modeObj, optIdx, selectedSubOptions);
                  if (availableVals.length === 0) return null;

                  return (
                    <div key={optIdx} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2 sm:gap-4">
                      <label className="sm:col-span-4 font-bold text-gray-700 text-sm sm:text-base">
                        {label}:
                      </label>
                      <div className="sm:col-span-8">
                        <select
                          value={selectedSubOptions[optIdx] || ''}
                          onChange={(e) => handleSubOptionChange(optIdx, e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] font-medium text-gray-900 shadow-xs"
                        >
                          <option value="" disabled>Select Option</option>
                          {availableVals.map((val, vIdx) => (
                            <option key={vIdx} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}


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
              {appliedCoupons.length === 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyCouponModal(true);
                    setModalCouponError('');
                  }}
                  className="text-teal-700 hover:text-teal-800 text-sm font-extrabold flex items-center gap-2 transition-colors duration-200 py-1"
                >
                  <FaTag className="text-teal-600" /> Apply Coupon Code (if any)
                </button>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <div className="text-xs text-gray-500 font-semibold">Applied Coupon:</div>
                  <div className="flex flex-wrap gap-2">
                    {appliedCoupons.map((c, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                        🏷️ {c.code} ({c.discountPercent}% OFF)
                        <button
                          type="button"
                          onClick={() => setAppliedCoupons(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-green-800 hover:text-red-600 ml-1 font-bold"
                          title="Remove coupon"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {couponStatus && (
                <p className={`text-xs mt-1 font-bold ${couponStatus.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>
                  {couponStatus}
                </p>
              )}
            </div>

            {/* Final Price Block */}
            <div className="pt-2">
              <div className="flex items-baseline gap-3">
                {selectedPrice.selling > 0 ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-teal-800 tracking-tight">
                      ₹{safeFormatPrice(discountedSellingPrice)}
                    </span>

                    {selectedPrice.cost > selectedPrice.selling && (
                      <>
                        <span className="text-base sm:text-lg font-bold text-gray-400 line-through">
                          ₹{safeFormatPrice(selectedPrice.cost)}
                        </span>
                        <span className="bg-red-50 text-red-600 border border-red-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                          {discountPercent}% OFF
                        </span>
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
                        <th className="py-3.5 px-4 font-bold w-1/3 sm:w-1/4">Feature</th>
                        <th className="py-3.5 px-4 font-bold w-2/3 sm:w-3/4">Details</th>
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
                                <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">{detail.label}</td>
                                <td className="py-3.5 px-4 text-gray-900 font-medium align-top">{renderFormattedText(detail.value)}</td>
                              </tr>
                            );
                          })
                      ) : (
                        <>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">Lecture Duration</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium align-top">{renderFormattedText(course.timing || 'Approx 150+ Hours')}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">No. of Lectures</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium align-top">{renderFormattedText(course.noOfLecture || '50+ comprehensive sessions')}</td>
                          </tr>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">Study Materials</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium align-top">{renderFormattedText(course.books || 'ICMAI / ICAI based books')}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">Video Run On</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium align-top">{renderFormattedText(course.videoRunOn || 'Windows Laptop / Android Phone')}</td>
                          </tr>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">Video Language</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium align-top">{renderFormattedText(course.videoLanguage || 'Hindi + English mix')}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">Doubt Solving Medium</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium align-top">{renderFormattedText(course.doubtSolving || 'WhatsApp with mentor')}</td>
                          </tr>
                          <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">Course Support</td>
                            <td className="py-3.5 px-4 text-gray-900 font-medium flex flex-wrap gap-x-4 gap-y-1 align-top">
                              {course.supportCall && <span className="flex items-center gap-1"><FaPhoneAlt className="text-xs text-teal-600" /> {course.supportCall}</span>}
                              {course.supportMail && <span className="flex items-center gap-1"><FaEnvelope className="text-xs text-teal-600" /> {course.supportMail}</span>}
                            </td>
                          </tr>
                        </>
                      )}
                      {course.instituteName && (
                        <tr className="bg-gray-50/50 hover:bg-gray-50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-gray-700 align-top">Institute Affiliation</td>
                          <td className="py-3.5 px-4 text-teal-600 font-bold align-top">{course.instituteName}</td>
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
                        {renderFormattedText(course.description)}
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

            {/* Mobile 2-Card Horizontal Sliding Carousel */}
            <div className="sm:hidden relative">
              <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 px-1 -mx-1 scroll-smooth">
                {relatedCourses.map((rCourse) => (
                  <div key={rCourse.id || rCourse._id} className="w-[calc(50%-6px)] shrink-0 snap-start transition-all duration-300">
                    <CourseCard course={rCourse} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-1 mt-1">
                <span className="text-[11px] text-teal-700 font-semibold flex items-center gap-1">
                  👈 Swipe horizontally for more courses 👉
                </span>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5 w-full">
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

      {/* Apply Coupon Modal */}
      {showApplyCouponModal && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <FaTag className="text-[#20b2aa] text-lg" />
                <h3 className="text-xl font-bold text-gray-900">Apply Coupon</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowApplyCouponModal(false);
                  setModalCouponError('');
                  setCouponModalInput('');
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Error Alert (Matching Screenshot #5) */}
            {modalCouponError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs font-semibold shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠️</span>
                  <span>{modalCouponError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalCouponError('')}
                  className="text-red-400 hover:text-red-700 font-bold shrink-0 text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Input Row (Matching Screenshot #3) */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponModalInput}
                onChange={(e) => {
                  setCouponModalInput(e.target.value);
                  setModalCouponError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyCouponWithCode(couponModalInput);
                  }
                }}
                className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] font-mono font-bold uppercase ${
                  modalCouponError ? 'border-red-400 bg-red-50/30' : 'border-gray-300 bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => handleApplyCouponWithCode(couponModalInput)}
                className="bg-[#20b2aa] hover:bg-[#1a9690] text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Apply
              </button>
            </div>

            {/* Available Coupon Codes List (Matching Screenshot #3) */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">
                Available Coupon Codes
              </h4>

              {(() => {
                const currentCourseId = String(course?.id || course?._id || courseId || '').trim();
                const currentCourseMongoId = String(course?.mongo_id || '').trim();
                const validCoupons = availableCoupons.filter(c => {
                  if (c.isVisible === false) return false;
                  if (Array.isArray(c.courseIds) && c.courseIds.length > 0) {
                    return c.courseIds.some(id => {
                      const sId = String(id).trim();
                      return sId === currentCourseId || (currentCourseMongoId && sId === currentCourseMongoId);
                    });
                  }
                  return true;
                });

                if (validCoupons.length === 0) {
                  return <p className="text-xs text-gray-400 italic">No available coupon codes at this time.</p>;
                }

                return (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {validCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setCouponModalInput(c.code);
                          setModalCouponError('');
                        }}
                        className="w-full text-left bg-gradient-to-r from-teal-50/50 via-emerald-50/30 to-white hover:from-teal-100/60 hover:to-teal-50/60 border border-teal-200 hover:border-[#20b2aa] rounded-2xl p-3.5 flex items-center justify-between transition-all group shadow-xs cursor-pointer"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-extrabold text-teal-950 text-base group-hover:text-teal-700 transition-colors">
                            {c.code}
                          </span>
                          {c.message ? (
                            <span className="text-xs text-teal-800 font-semibold">{c.message}</span>
                          ) : (
                            <span className="text-xs text-gray-500 font-medium">{c.discountPercent}% OFF</span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-[#20b2aa] group-hover:underline">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseFullDetailPage;
