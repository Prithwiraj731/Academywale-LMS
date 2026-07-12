import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegClock, FaBook, FaLanguage, FaCalendarAlt, 
         FaCheckCircle, FaUser, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { MdVideoLibrary } from 'react-icons/md';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCourseImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api';
import { normalizeCoursePricing } from '../utils/coursePricing';
import { useAuth } from '../context/AuthContext';

const CourseFullDetailPage = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState('');
  const [selectedPrice, setSelectedPrice] = useState({ selling: 0, cost: 0 });

  useEffect(() => {
    async function fetchCourseDetails() {
      setLoading(true);
      setError('');
      try {
        // Build the API URL with courseType as a query parameter if available
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
        
        // Initialize mode and attempt selection
        if (normalizedCourse.modeAttemptPricing && normalizedCourse.modeAttemptPricing.length > 0) {
          const firstMode = normalizedCourse.modeAttemptPricing[0];
          setSelectedMode(firstMode.mode);
          if (firstMode.attempts && firstMode.attempts.length > 0) {
            const firstAttempt = firstMode.attempts[0];
            setSelectedAttempt(firstAttempt.attempt);
            setSelectedPrice({ selling: firstAttempt.sellingPrice, cost: firstAttempt.costPrice });
          }
        } else {
          // Fallback to basic pricing
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

  // Handle mode selection
  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    const modeData = course.modeAttemptPricing.find(m => m.mode === mode);
    if (modeData && modeData.attempts && modeData.attempts.length > 0) {
      const firstAttempt = modeData.attempts[0];
      setSelectedAttempt(firstAttempt.attempt);
      setSelectedPrice({ selling: firstAttempt.sellingPrice, cost: firstAttempt.costPrice });
    }
  };

  // Handle attempt selection  
  const handleAttemptChange = (attempt) => {
    setSelectedAttempt(attempt);
    const modeData = course.modeAttemptPricing.find(m => m.mode === selectedMode);
    if (modeData) {
      const attemptData = modeData.attempts.find(a => a.attempt === attempt);
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
          from: `/course-details/${encodeURIComponent(courseType || 'general')}/${courseId}`,
          message: 'Please log in to purchase this course'
        }
      });
      return;
    }

    if (course.modeAttemptPricing && course.modeAttemptPricing.length > 0 && (!selectedMode || !selectedAttempt)) {
      alert('Please select both mode and attempt before proceeding.');
      return;
    }
    
    navigate(`/payment/${encodeURIComponent(courseType || 'general')}/${courseId}`, {
      state: {
        selectedMode,
        selectedAttempt,
        price: selectedPrice.selling,
        course: course
      }
    });
  };
  
  const getPosterUrl = (course) => {
    return getCourseImageUrl(course);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <LoadingSpinner size="lg" />
          <div className="text-gray-600 mt-4 text-center">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-blue-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Course Not Found</h2>
          <p className="text-gray-600 text-center mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Course Header Side-by-Side Design */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-150 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Poster Image and Faculty info */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[320px] aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-gray-50 flex items-center justify-center relative mb-4">
                <img 
                  src={getPosterUrl(course)} 
                  alt={course.subject || course.title} 
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.target.src = '/logo.svg'; // Fallback image
                  }}
                />
                {course.courseType && (
                  <span className="absolute top-3 left-3 bg-[#20b2aa] text-white px-2.5 py-0.5 rounded text-xs font-semibold shadow">
                    {course.courseType}
                  </span>
                )}
              </div>
              
              {course.facultyName && (
                <div className="w-full text-center md:text-left bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Faculty</div>
                  <div className="text-gray-800 font-bold text-lg flex items-center justify-center md:justify-start gap-2">
                    <FaUser className="text-[#20b2aa]" />
                    {course.facultyName}
                  </div>
                  {course.instituteName && (
                    <div className="text-xs text-gray-600 mt-1">
                      Institute: <span className="font-semibold text-gray-700">{course.instituteName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Title, selectors, price and checkout button */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between h-full">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 leading-tight mb-3">
                  {course.subject || course.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.videoLanguage && (
                    <span className="bg-green-50 text-green-700 border border-green-150 px-3 py-1 rounded-full text-xs font-medium">
                      Language: {course.videoLanguage}
                    </span>
                  )}
                  {course.noOfLecture && (
                    <span className="bg-blue-50 text-blue-700 border border-blue-150 px-3 py-1 rounded-full text-xs font-medium">
                      {course.noOfLecture} Lectures
                    </span>
                  )}
                  {course.timing && (
                    <span className="bg-purple-50 text-purple-700 border border-purple-150 px-3 py-1 rounded-full text-xs font-medium">
                      {course.timing}
                    </span>
                  )}
                </div>

                {/* selectors */}
                {course.modeAttemptPricing && course.modeAttemptPricing.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {/* Mode selector dropdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="sm:w-36 text-sm font-semibold text-gray-700">Mode:</label>
                      <select
                        value={selectedMode}
                        onChange={(e) => handleModeChange(e.target.value)}
                        className="flex-1 max-w-md bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] text-gray-800"
                      >
                        <option value="" disabled>Select Mode</option>
                        {course.modeAttemptPricing.map((modeData, idx) => (
                          <option key={idx} value={modeData.mode}>
                            {modeData.mode}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Attempt selector dropdown */}
                    {selectedMode && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <label className="sm:w-36 text-sm font-semibold text-gray-700">Exam Term / Attempts:</label>
                        <select
                          value={selectedAttempt}
                          onChange={(e) => handleAttemptChange(e.target.value)}
                          className="flex-1 max-w-md bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#20b2aa] text-gray-800"
                        >
                          <option value="" disabled>Select Validity & Attempt</option>
                          {course.modeAttemptPricing
                            .find(m => m.mode === selectedMode)?.attempts.map((attempt, idx) => (
                              <option key={idx} value={attempt.attempt}>
                                {attempt.attempt}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-150 mb-6">
                    Standard pricing structure applies for this course.
                  </div>
                )}
              </div>

              {/* Price display and proceed to pay */}
              <div className="mt-4 border-t border-gray-100 pt-6">
                <div className="flex flex-wrap items-baseline gap-3 mb-6">
                  {selectedPrice.selling > 0 ? (
                    <>
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#20b2aa]">
                        ₹{selectedPrice.selling.toLocaleString()}
                      </span>
                      {selectedPrice.cost > selectedPrice.selling && (
                        <>
                          <span className="text-lg text-gray-400 line-through">
                            ₹{selectedPrice.cost.toLocaleString()}
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-md font-bold">
                            {Math.round(((selectedPrice.cost - selectedPrice.selling) / selectedPrice.cost) * 100)}% OFF
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl sm:text-3xl font-extrabold text-gray-600">
                      Contact for Price
                    </span>
                  )}
                </div>

                <button
                  onClick={handleProceedToPay}
                  disabled={(!selectedMode || !selectedAttempt) && course.modeAttemptPricing?.length > 0}
                  className={`w-full max-w-md font-bold py-3.5 px-6 rounded-xl shadow-md transition-all hover:shadow-lg flex items-center justify-center text-base ${
                    (!selectedMode || !selectedAttempt) && course.modeAttemptPricing?.length > 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#20b2aa] to-[#17817a] text-white hover:from-[#17817a] hover:to-[#126862]'
                  }`}
                >
                  {isAuthenticated ? (
                    <>
                      Proceed to Pay
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    'Log in to proceed'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaGraduationCap className="mr-3 text-blue-500" />
                Course Description
              </h2>
              
              {course.description ? (
                <div className="prose prose-lg max-w-none text-gray-700">
                  {course.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
                  This is a comprehensive course covering all aspects of {course.subject || course.title}. 
                  For detailed curriculum information, please contact our support team.
                </div>
              )}
            </div>
            
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCheckCircle className="mr-3 text-green-500" />
                What You'll Learn
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  `Complete ${course.subject || course.title} curriculum coverage`,
                  course.books ? `Study materials: ${course.books}` : 'Comprehensive study materials',
                  course.doubtSolving || 'Doubt solving sessions',
                  'Practice questions and solutions',
                  'Real-world problem solving',
                  'Exam preparation strategies'
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Course Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaChalkboardTeacher className="mr-3 text-purple-500" />
                Course Features
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <MdVideoLibrary className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Lectures</h4>
                      <p className="text-gray-700">{course.noOfLecture || 'Comprehensive lectures'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaRegClock className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Duration</h4>
                      <p className="text-gray-700">{course.timing || 'Self-paced learning'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaBook className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Study Materials</h4>
                      <p className="text-gray-700">{course.books || 'Comprehensive materials'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaLanguage className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Language</h4>
                      <p className="text-gray-700">{course.videoLanguage || 'Multiple languages available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Course Info Card */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Course Information
              </h3>
              
              <div className="space-y-4">
                {course.videoRunOn && (
                  <div className="flex items-start border-b border-gray-100 pb-3">
                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Video Platform</h4>
                      <p className="text-sm text-gray-600">{course.videoRunOn}</p>
                    </div>
                  </div>
                )}
                
                {course.doubtSolving && (
                  <div className="flex items-start border-b border-gray-100 pb-3">
                    <div className="bg-green-100 p-2 rounded-md mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Doubt Solving</h4>
                      <p className="text-sm text-gray-600">{course.doubtSolving}</p>
                    </div>
                  </div>
                )}
                
                {(course.supportMail || course.supportCall) && (
                  <div className="flex items-start border-b border-gray-100 pb-3">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Support</h4>
                      {course.supportMail && <p className="text-sm text-gray-600">Email: {course.supportMail}</p>}
                      {course.supportCall && <p className="text-sm text-gray-600">Phone: {course.supportCall}</p>}
                    </div>
                  </div>
                )}
                
                <div className="flex items-start border-b border-gray-100 pb-3">
                  <div className="bg-amber-100 p-2 rounded-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Last Updated</h4>
                    <p className="text-sm text-gray-600">
                      {new Date().toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="mb-4 p-3 bg-teal-50 rounded-lg border border-teal-200">
                  <div className="text-sm text-gray-600 mb-1">Selected Package:</div>
                  <div className="font-semibold text-gray-800">
                    {selectedMode || 'No mode selected'}
                  </div>
                  {selectedAttempt && (
                    <div className="text-sm text-gray-600 mt-1">
                      {selectedAttempt}
                    </div>
                  )}
                  <div className="text-lg font-bold text-teal-600 mt-2">
                    ₹{selectedPrice.selling?.toLocaleString()}
                    {selectedPrice.cost > selectedPrice.selling && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        ₹{selectedPrice.cost?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleProceedToPay}
                  disabled={(!selectedMode || !selectedAttempt) && course.modeAttemptPricing?.length > 0}
                  className={`w-full font-bold py-3 px-4 rounded-lg shadow-lg transition-all transform hover:scale-[1.01] flex items-center justify-center ${
                    (!selectedMode || !selectedAttempt) && course.modeAttemptPricing?.length > 0
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:from-teal-600 hover:to-blue-700'
                  }`}
                >
                  {(!selectedMode || !selectedAttempt) && course.modeAttemptPricing?.length > 0
                    ? 'Select Options Above'
                    : 'Enroll Now'
                  }
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFullDetailPage;
