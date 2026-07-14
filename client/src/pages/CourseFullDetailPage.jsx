import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaRegClock, FaBook, FaLanguage, FaCalendarAlt, 
  FaCheckCircle, FaUser, FaGraduationCap, FaChalkboardTeacher,
  FaShoppingCart, FaPhoneAlt, FaEnvelope, FaLaptop, FaQuestionCircle,
  FaExternalLinkAlt, FaBookOpen
} from 'react-icons/fa';
import { MdVideoLibrary } from 'react-icons/md';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCourseImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api';
import { normalizeCoursePricing } from '../utils/coursePricing';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CourseCard from '../components/common/CourseCard/CourseCard';

const CourseFullDetailPage = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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
        
        // Initialize mode, validity, and attempt selection
        if (normalizedCourse.modeAttemptPricing && normalizedCourse.modeAttemptPricing.length > 0) {
          const firstMode = normalizedCourse.modeAttemptPricing[0];
          setSelectedMode(firstMode.mode);
          if (firstMode.attempts && firstMode.attempts.length > 0) {
            const firstAttempt = firstMode.attempts[0];
            setSelectedValidity(firstAttempt.validity || '');
            setSelectedAttempt(firstAttempt.attempt || '');
            setSelectedPrice({ selling: firstAttempt.sellingPrice, cost: firstAttempt.costPrice });
          }
        } else {
          setSelectedPrice({ 
            selling: data.course.sellingPrice || 0, 
            cost: data.course.costPrice || 0 
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err.message || 'Failed to load course details');
        setLoading(false);
      }
    }
    
    fetchCourseDetails();
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
  }, [course]);

  const getUniqueValiditiesForMode = (modeName) => {
    const modeData = course?.modeAttemptPricing?.find(m => m.mode === modeName);
    if (!modeData || !modeData.attempts) return [];
    return Array.from(new Set(modeData.attempts.map(a => a.validity).filter(Boolean)));
  };

  const getAttemptsForSelectedModeAndValidity = () => {
    const modeData = course?.modeAttemptPricing?.find(m => m.mode === selectedMode);
    if (!modeData || !modeData.attempts) return [];
    const validities = getUniqueValiditiesForMode(selectedMode);
    if (validities.length > 0) {
      return modeData.attempts.filter(a => a.validity === selectedValidity);
    }
    return modeData.attempts;
  };

  // Handle mode selection
  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    const modeData = course.modeAttemptPricing.find(m => m.mode === mode);
    if (modeData && modeData.attempts && modeData.attempts.length > 0) {
      const validities = Array.from(new Set(modeData.attempts.map(a => a.validity).filter(Boolean)));
      if (validities.length > 0) {
        const firstValidity = validities[0];
        setSelectedValidity(firstValidity);
        const attemptsForVal = modeData.attempts.filter(a => a.validity === firstValidity);
        if (attemptsForVal.length > 0) {
          const firstAttempt = attemptsForVal[0];
          setSelectedAttempt(firstAttempt.attempt);
          setSelectedPrice({ selling: firstAttempt.sellingPrice, cost: firstAttempt.costPrice });
        }
      } else {
        setSelectedValidity('');
        const firstAttempt = modeData.attempts[0];
        setSelectedAttempt(firstAttempt.attempt);
        setSelectedPrice({ selling: firstAttempt.sellingPrice, cost: firstAttempt.costPrice });
      }
    }
  };

  // Handle validity selection
  const handleValidityChange = (validity) => {
    setSelectedValidity(validity);
    const modeData = course.modeAttemptPricing.find(m => m.mode === selectedMode);
    if (modeData && modeData.attempts) {
      const attemptsForVal = modeData.attempts.filter(a => a.validity === validity);
      if (attemptsForVal.length > 0) {
        const firstAttempt = attemptsForVal[0];
        setSelectedAttempt(firstAttempt.attempt);
        setSelectedPrice({ selling: firstAttempt.sellingPrice, cost: firstAttempt.costPrice });
      }
    }
  };

  // Handle attempt selection  
  const handleAttemptChange = (attempt) => {
    setSelectedAttempt(attempt);
    const modeData = course.modeAttemptPricing.find(m => m.mode === selectedMode);
    if (modeData && modeData.attempts) {
      const attemptData = modeData.attempts.find(a => 
        a.attempt === attempt && 
        (!selectedValidity || a.validity === selectedValidity)
      );
      if (attemptData) {
        setSelectedPrice({ selling: attemptData.sellingPrice, cost: attemptData.costPrice });
      }
    }
  };

  // Handle proceed to payment
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
      alert('Please select mode, validity, and attempt before proceeding.');
      return;
    }
    
    navigate(`/payment/${encodeURIComponent(courseType || 'general')}/${courseId}`, {
      state: {
        selectedMode,
        selectedAttempt,
        selectedValidity,
        price: selectedPrice.selling,
        course: course
      }
    });
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (course.modeAttemptPricing && course.modeAttemptPricing.length > 0 && 
        (!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity))) {
      alert('Please select mode, validity, and attempt before adding to cart.');
      return;
    }

    const added = addToCart(course, selectedMode, selectedAttempt, selectedPrice.selling, selectedValidity);
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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-950/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-md max-w-sm w-full text-center">
          <LoadingSpinner size="lg" />
          <div className="text-gray-400 mt-4 font-semibold">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-900 p-4 flex items-center justify-center">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center text-white">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">{error ? 'Error' : 'Course Not Found'}</h2>
          <p className="text-gray-400 mb-6">{error || "The course you're looking for doesn't exist or has been removed."}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-[#20b2aa] hover:bg-[#17817a] text-white font-bold py-3 rounded-xl transition-all shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Pre-calculated discount percentage
  const discountPercent = selectedPrice.cost > selectedPrice.selling 
    ? Math.round(((selectedPrice.cost - selectedPrice.selling) / selectedPrice.cost) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-[#20b2aa]/30">
      
      {/* 1. Header Banner Area */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-neutral-900 border-b border-neutral-900 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors duration-200 mb-6 bg-slate-900 px-4 py-2 rounded-full border border-neutral-800"
          >
            <FaArrowLeft /> Back to Courses
          </button>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#20b2aa]/10 text-[#20b2aa] px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-[#20b2aa]/20 shadow-sm uppercase">
              {course.category} {course.subcategory}
            </span>
            {course.paper_id && (
              <span className="bg-slate-800 text-neutral-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-neutral-750">
                Paper {course.paper_id}
              </span>
            )}
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            {course.title || course.subject}
          </h1>
          
          <p className="text-neutral-400 mt-2 text-sm sm:text-base max-w-3xl font-medium">
            Master-class preparation course with top faculty and curated curriculum.
          </p>
        </div>
      </div>

      {/* 2. Main content split columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Media, Product Info Table, Highlights */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Banner/Poster container */}
            <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl p-4 sm:p-6 overflow-hidden shadow-2xl backdrop-blur-sm flex justify-center items-center">
              <div className="w-full max-w-[360px] rounded-2xl overflow-hidden bg-slate-950/80 flex items-center justify-center relative border border-neutral-800 group shadow-inner">
                <img 
                  src={getPosterUrl(course)} 
                  alt={course.subject || course.title} 
                  className="w-full max-h-[220px] object-contain p-1 group-hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/logo.svg'; 
                  }}
                />
              </div>
            </div>

            {/* TABBED BOX: Spec table & Highlights */}
            <div className="bg-neutral-900/40 border border-neutral-850 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="flex border-b border-neutral-850 bg-neutral-950/40">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 py-4 px-6 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'info' 
                      ? 'border-[#20b2aa] text-[#20b2aa] bg-neutral-900/30' 
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/10'
                  }`}
                >
                  <FaBookOpen /> Product Info
                </button>
                <button
                  onClick={() => setActiveTab('highlights')}
                  className={`flex-1 py-4 px-6 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'highlights' 
                      ? 'border-[#20b2aa] text-[#20b2aa] bg-neutral-900/30' 
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/10'
                  }`}
                >
                  <FaChalkboardTeacher /> Highlights & Features
                </button>
              </div>

              <div className="p-6 sm:p-8">
                {activeTab === 'info' ? (
                  /* SPECIFICATIONS TABLE */
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-neutral-950 border-b border-neutral-850 text-xs font-bold uppercase tracking-wider text-neutral-400">
                          <th className="py-3.5 px-4 font-bold">Parameter</th>
                          <th className="py-3.5 px-4 font-bold">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-850">
                        <tr className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400 w-1/3">Applicable For</td>
                          <td className="py-3.5 px-4 text-white font-medium">{course.category} {course.subcategory} level exams</td>
                        </tr>
                        <tr className="bg-neutral-900/10 hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400">Lecture Duration</td>
                          <td className="py-3.5 px-4 text-white font-medium">{course.timing || 'Approx 150+ Hours'}</td>
                        </tr>
                        <tr className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400">No. of Lectures</td>
                          <td className="py-3.5 px-4 text-white font-medium">{course.noOfLecture || '50+ comprehensive sessions'}</td>
                        </tr>
                        <tr className="bg-neutral-900/10 hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400">Study Materials</td>
                          <td className="py-3.5 px-4 text-white font-medium">{course.books || 'ICMAI / ICAI based books'}</td>
                        </tr>
                        <tr className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400">Video Run On</td>
                          <td className="py-3.5 px-4 text-white font-medium">{course.videoRunOn || 'Windows Laptop / Android Phone'}</td>
                        </tr>
                        <tr className="bg-neutral-900/10 hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400">Video Language</td>
                          <td className="py-3.5 px-4 text-white font-medium">{course.videoLanguage || 'Hindi + English mix'}</td>
                        </tr>
                        <tr className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400">Doubt Solving Medium</td>
                          <td className="py-3.5 px-4 text-white font-medium">{course.doubtSolving || 'WhatsApp with mentor'}</td>
                        </tr>
                        <tr className="bg-neutral-900/10 hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-neutral-400">Course Support</td>
                          <td className="py-3.5 px-4 text-white font-medium flex flex-wrap gap-x-4 gap-y-1">
                            {course.supportCall && <span className="flex items-center gap-1"><FaPhoneAlt className="text-xs text-[#20b2aa]" /> {course.supportCall}</span>}
                            {course.supportMail && <span className="flex items-center gap-1"><FaEnvelope className="text-xs text-[#20b2aa]" /> {course.supportMail}</span>}
                          </td>
                        </tr>
                        {course.validity_start_from && (
                          <tr className="hover:bg-neutral-900/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-neutral-400">Validity Commences</td>
                            <td className="py-3.5 px-4 text-white font-medium">{course.validity_start_from}</td>
                          </tr>
                        )}
                        {course.instituteName && (
                          <tr className="bg-neutral-900/10 hover:bg-neutral-900/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-neutral-400">Institute Affiliation</td>
                            <td className="py-3.5 px-4 text-[#20b2aa] font-bold">{course.instituteName}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* HIGHLIGHTS & DESCRIPTION */
                  <div className="space-y-6">
                    {course.description && (
                      <div className="prose prose-invert prose-teal max-w-none">
                        <h4 className="text-lg font-bold text-white mb-2">Detailed Overview</h4>
                        <div className="text-neutral-300 space-y-4 text-sm sm:text-base leading-relaxed">
                          {course.description.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-neutral-850 pt-6">
                      <h4 className="text-lg font-bold text-white mb-4">Key Course Benefits</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300 text-sm">
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
          
          {/* RIGHT COLUMN: Selection actions, pricing, faculty card */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            
            {/* ACTION CARD */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#20b2aa]/10 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Purchase Options</span>
                <span className="bg-[#20b2aa] text-black font-extrabold text-[10px] px-2 py-0.5 rounded shadow uppercase tracking-wide">
                  Best Price
                </span>
              </div>
              
              {/* Selectors */}
              {course.modeAttemptPricing && course.modeAttemptPricing.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {/* Mode Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Select Mode</label>
                    <select
                      value={selectedMode}
                      onChange={(e) => handleModeChange(e.target.value)}
                      className="w-full bg-slate-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] text-white font-medium transition-all"
                    >
                      <option value="" disabled>Choose Learning Mode</option>
                      {course.modeAttemptPricing.map((modeData, idx) => (
                        <option key={idx} value={modeData.mode}>
                          {modeData.mode}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Validity Selector */}
                  {selectedMode && getUniqueValiditiesForMode(selectedMode).length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Select Validity</label>
                      <select
                        value={selectedValidity}
                        onChange={(e) => handleValidityChange(e.target.value)}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] text-white font-medium transition-all"
                      >
                        <option value="" disabled>Choose Validity</option>
                        {getUniqueValiditiesForMode(selectedMode).map((val, idx) => (
                          <option key={idx} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Attempt/Exam Term Selector */}
                  {selectedMode && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Exam Term / Attempt</label>
                      <select
                        value={selectedAttempt}
                        onChange={(e) => handleAttemptChange(e.target.value)}
                        className="w-full bg-slate-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] text-white font-medium transition-all"
                      >
                        <option value="" disabled>Choose Exam Term</option>
                        {getAttemptsForSelectedModeAndValidity().map((attempt, idx) => (
                          <option key={idx} value={attempt.attempt}>
                            {attempt.attempt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-neutral-500 bg-neutral-950 p-4 rounded-2xl border border-neutral-850 mb-6">
                  Standard course package pricing applies.
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="border-t border-neutral-850 pt-6 mb-6">
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  {selectedPrice.selling > 0 ? (
                    <>
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#20b2aa] tracking-tight">
                        ₹{selectedPrice.selling.toLocaleString()}
                      </span>
                      {selectedPrice.cost > selectedPrice.selling && (
                        <>
                          <span className="text-base text-neutral-500 line-through">
                            ₹{selectedPrice.cost.toLocaleString()}
                          </span>
                          <span className="bg-[#20b2aa]/15 text-[#20b2aa] text-xs px-2.5 py-0.5 rounded font-bold border border-[#20b2aa]/20">
                            {discountPercent}% OFF
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-neutral-400">
                      Contact for pricing
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-500 font-medium">Inclusive of all local taxes and GST.</p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleProceedToPay}
                  disabled={(!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0}
                  className={`w-full font-bold py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center text-sm transition-all duration-300 ${
                    (!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-850'
                      : 'bg-gradient-to-r from-[#20b2aa] to-[#126862] hover:from-[#17817a] hover:to-[#0f5752] text-white hover:scale-[1.01] hover:shadow-[#20b2aa]/10'
                  }`}
                >
                  {isAuthenticated ? (
                    <span className="flex items-center justify-center gap-2">
                      Buy Course Now <FaExternalLinkAlt className="text-xs" />
                    </span>
                  ) : (
                    'Log in to Enroll'
                  )}
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={(!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0}
                  className={`w-full font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center text-sm border-2 transition-all duration-300 ${
                    (!selectedMode || !selectedAttempt || (getUniqueValiditiesForMode(selectedMode).length > 0 && !selectedValidity)) && course.modeAttemptPricing?.length > 0
                      ? 'bg-neutral-900/30 text-neutral-600 border-neutral-850 cursor-not-allowed'
                      : isInCart(course.id || course._id, selectedMode, selectedAttempt, selectedValidity)
                      ? 'bg-[#20b2aa]/10 text-[#20b2aa] border-[#20b2aa]'
                      : 'bg-transparent text-white border-neutral-750 hover:bg-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <FaShoppingCart className="mr-2 text-xs" />
                  {isInCart(course.id || course._id, selectedMode, selectedAttempt, selectedValidity) ? 'Item in Cart ✓' : 'Add to Cart'}
                </button>
              </div>

              {addedMessage && (
                <div className={`mt-4 text-xs font-semibold p-3 rounded-xl text-center border transition-all duration-300 animate-fade-in ${
                  addedMessage.includes('successfully') 
                    ? 'bg-teal-950/20 text-[#20b2aa] border-teal-900/50' 
                    : 'bg-amber-950/20 text-amber-400 border-amber-900/50'
                }`}>
                  {addedMessage}
                </div>
              )}
            </div>

            {/* FACULTY SHORT CARD */}
            {course.facultyName && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Course Instructor</h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-tr from-[#20b2aa] to-indigo-500 rounded-full flex items-center justify-center text-xl font-extrabold text-white uppercase shrink-0 border border-neutral-700 shadow-md">
                    {course.facultyName[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base leading-snug">{course.facultyName}</h5>
                    <p className="text-xs text-[#20b2aa] font-semibold mt-0.5">Subject Expert</p>
                  </div>
                </div>
              </div>
            )}

            {/* CALLOUT HELPLINE CARD */}
            <div className="bg-[#20b2aa]/5 border border-[#20b2aa]/15 rounded-3xl p-6 shadow-xl backdrop-blur-sm text-center">
              <p className="text-xs text-neutral-300 font-bold mb-3 flex items-center justify-center gap-1.5">
                <FaQuestionCircle className="text-[#20b2aa]" /> Need Guidance or Offers?
              </p>
              <h4 className="text-lg font-extrabold text-white mb-2">+91 9693320108</h4>
              <p className="text-[11px] text-neutral-400">Call or WhatsApp our counselors directly for assistance.</p>
            </div>

          </div>

        </div>

        {/* 3. Related Courses Section */}
        {relatedCourses.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-900">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-8">
              Similar Related Courses
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
              {relatedCourses.map((rCourse) => (
                <CourseCard key={rCourse.id || rCourse._id} course={rCourse} />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default CourseFullDetailPage;
