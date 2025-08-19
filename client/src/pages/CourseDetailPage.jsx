import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegClock, FaBook, FaLanguage, FaCalendarAlt } from 'react-icons/fa';
import { MdVideoLibrary, MdModeEdit } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const API_URL = import.meta.env.VITE_API_URL || 'https://academywale-lms.onrender.com';

const CourseDetailPage = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedValidity, setSelectedValidity] = useState('');
  const [price, setPrice] = useState({ original: 0, final: 0 });
  
  // User details for checkout
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  // Fetch the course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        console.log(`Fetching course details for courseId: ${courseId}`);
        
        // Log the full URL for debugging
        const apiUrl = `${API_URL}/api/courses/details/${courseId}`;
        console.log(`API URL: ${apiUrl}`);
        
        const res = await fetch(apiUrl);
        const data = await res.json();
        console.log('API Response:', data);
        
        if (res.ok && data.course) {
          console.log('Course data received:', data.course);
          setCourse(data.course);
          
          // Set default mode and validity if available
          if (data.course.modeAttemptPricing && data.course.modeAttemptPricing.length > 0) {
            // Set default mode from modeAttemptPricing
            const firstMode = data.course.modeAttemptPricing[0].mode;
            setSelectedMode(firstMode);
            console.log('Setting default mode:', firstMode);
            
            // Set default attempt/validity
            if (data.course.modeAttemptPricing[0].attempts && 
                data.course.modeAttemptPricing[0].attempts.length > 0) {
              const firstAttempt = data.course.modeAttemptPricing[0].attempts[0].attempt;
              setSelectedValidity(firstAttempt);
              console.log('Setting default validity:', firstAttempt);
              
              // Set initial price
              setPrice({
                original: data.course.modeAttemptPricing[0].attempts[0].costPrice || 0,
                final: data.course.modeAttemptPricing[0].attempts[0].sellingPrice || 0
              });
              console.log('Setting initial price:', {
                original: data.course.modeAttemptPricing[0].attempts[0].costPrice,
                final: data.course.modeAttemptPricing[0].attempts[0].sellingPrice
              });
            }
          } else {
            console.warn('Course has no modeAttemptPricing data');
            // Fallback to old structure
            if (data.course.modes && data.course.modes.length > 0) {
              setSelectedMode(data.course.modes[0]);
            }
            if (data.course.durations && data.course.durations.length > 0) {
              setSelectedValidity(data.course.durations[0]);
            }
            // Set initial price
            setPrice({
              original: data.course.costPrice || 0,
              final: data.course.sellingPrice || 0
            });
          }
        } else {
          console.error('API Error:', data);
          setError(data.error || data.message || 'Failed to fetch course details');
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

  // Fill user details if authenticated
  useEffect(() => {
    if (user) {
      setUserDetails({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    
    // Reset validity selection when mode changes
    setSelectedValidity(null);
    
    // Set default validity if available for this mode
    if (course?.modeAttemptPricing) {
      const modeData = course.modeAttemptPricing.find(m => m.mode === mode);
      if (modeData && modeData.attempts && modeData.attempts.length > 0) {
        setSelectedValidity(modeData.attempts[0].attempt);
        
        // Update price based on the selected mode and first validity option
        setPrice({
          original: modeData.attempts[0].costPrice || 0,
          final: modeData.attempts[0].sellingPrice || 0
        });
      } else {
        // Reset price if no valid attempts found
        setPrice({ original: 0, final: 0 });
      }
    } else if (course.sellingPrice) {
      // Fallback to course level pricing
      setPrice({
        original: course.costPrice || 0,
        final: course.sellingPrice || 0
      });
    }
  };

  const handleValidityChange = (validity) => {
    setSelectedValidity(validity);
    
    // Update price based on selected validity
    if (course?.modeAttemptPricing && selectedMode) {
      const modeData = course.modeAttemptPricing.find(m => m.mode === selectedMode);
      if (modeData) {
        const attemptData = modeData.attempts.find(a => a.attempt === validity);
        if (attemptData) {
          setPrice({
            original: attemptData.costPrice || 0,
            final: attemptData.sellingPrice || 0
          });
        }
      }
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login', { 
        state: { 
          from: `/course/${courseType}/${courseId}`,
          message: 'Please log in to purchase this course'
        } 
      });
      return;
    }
    
    // Show checkout modal
    setShowCheckoutModal(true);
  };

  const handleUserDetailsChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceedToPayment = () => {
    // Validate user details
    if (!userDetails.fullName || !userDetails.email || !userDetails.phone) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Send user details to backend (API call to save in database)
    saveUserDetails().then(() => {
      // Navigate to payment page with course info
      navigate(`/payment/${courseType}/${courseId}`, { 
        state: { 
          selectedMode,
          selectedValidity,
          price: price.final,
          userDetails
        }
      });
    });
  };
  
  const saveUserDetails = async () => {
    try {
      // Send email notification
      await fetch(`${API_URL}/api/notify/course-interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseName: course.title,
          courseId: courseId,
          userDetails: userDetails,
          selectedMode,
          selectedValidity,
          price: price.final
        }),
      });
      
      return true;
    } catch (error) {
      console.error('Failed to save user details:', error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-4">
        <div className="text-red-600 font-bold text-xl mb-4">Error: {error}</div>
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!course) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-4 md:py-8">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 md:mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Course header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{course.title || course.subject}</h1>
            <div className="flex flex-wrap gap-2 md:gap-4 items-center text-sm">
              <div>
                <span className="opacity-80">Category:</span> {course.category || 'N/A'}
              </div>
              <div>
                <span className="opacity-80">Paper:</span> {course.paperName || 'N/A'}
              </div>
              <div>
                <span className="opacity-80">Faculty:</span> {course.facultyName || 'N/A'}
              </div>
              {course.institute && (
                <div>
                  <span className="opacity-80">Institute:</span> {course.institute}
                </div>
              )}
            </div>
          </div>
          
          {/* Course content */}
          <div className="p-4 md:p-8">
            {/* Mobile/Tablet - Purchase options first for smaller screens */}
            <div className="block lg:hidden mb-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4">Course Options</h3>
                
                {/* Mode selection */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mode:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {course.modeAttemptPricing 
                      ? course.modeAttemptPricing.map((modeData) => (
                          <button
                            key={modeData.mode}
                            type="button"
                            onClick={() => handleModeChange(modeData.mode)}
                            className={`py-2 px-3 rounded-md text-sm font-medium ${
                              selectedMode === modeData.mode
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {modeData.mode}
                          </button>
                        ))
                      : (course.modes || ['Recorded', 'Live', 'Pendrive']).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => handleModeChange(mode)}
                            className={`py-2 px-3 rounded-md text-sm font-medium ${
                              selectedMode === mode
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {mode}
                          </button>
                        ))
                    }
                  </div>
                </div>
                
                {/* Validity selection */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Views & Validity:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedMode && course.modeAttemptPricing 
                      ? course.modeAttemptPricing
                          .find(m => m.mode === selectedMode)?.attempts.map((attempt) => (
                            <button
                              key={attempt.attempt}
                              type="button"
                              onClick={() => handleValidityChange(attempt.attempt)}
                              className={`py-2 px-3 rounded-md text-sm font-medium ${
                                selectedValidity === attempt.attempt
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {attempt.attempt}
                            </button>
                          ))
                      : (course.durations || ['1.5 Views & 12 Months Validity', '2.5 Views & 24 Months Validity']).map((validity) => (
                          <button
                            key={validity}
                            type="button"
                            onClick={() => handleValidityChange(validity)}
                            className={`py-2 px-3 rounded-md text-sm font-medium ${
                              selectedValidity === validity
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {validity}
                          </button>
                        ))
                    }
                  </div>
                </div>
                
                {/* Price */}
                <div className="flex items-baseline mb-4 md:mb-6">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{price.final}</span>
                  {price.original > price.final && price.original > 0 && (
                    <>
                      <span className="text-sm md:text-lg text-gray-400 line-through ml-2">₹{price.original}</span>
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {Math.round(((price.original - price.final) / price.original) * 100)}% Off
                      </span>
                    </>
                  )}
                </div>
                
                {/* Buy Now button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 md:py-3 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  {isAuthenticated ? 'Buy Now' : 'Login to Purchase'}
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
              {/* Left column - Course details */}
              <div className="lg:col-span-2">
                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Course Details</h2>
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <p className="text-gray-700 mb-4 md:mb-6">{course.description || 'No description available for this course.'}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex items-start">
                        <MdVideoLibrary className="text-blue-600 text-lg md:text-xl mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-800">Lectures</h4>
                          <p className="text-gray-600">{course.noOfLecture || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaRegClock className="text-blue-600 text-lg md:text-xl mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-800">Duration</h4>
                          <p className="text-gray-600">{course.timing || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaBook className="text-blue-600 text-lg md:text-xl mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-800">Study Materials</h4>
                          <p className="text-gray-600">{course.books || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaLanguage className="text-blue-600 text-lg md:text-xl mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-800">Language</h4>
                          <p className="text-gray-600">{course.videoLanguage || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <FaCalendarAlt className="text-blue-600 text-lg md:text-xl mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-800">Validity</h4>
                          <p className="text-gray-600">{course.validityStartFrom || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <MdModeEdit className="text-blue-600 text-lg md:text-xl mt-1 mr-2" />
                        <div>
                          <h4 className="font-medium text-gray-800">Doubt Solving</h4>
                          <p className="text-gray-600">{course.doubtSolving || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Syllabus information (if available) */}
                {course.syllabus && course.syllabus.trim() !== '' && (
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Syllabus</h2>
                    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.syllabus }}></div>
                    </div>
                  </div>
                )}
                
                {/* Additional course information if needed */}
                {course.highlights && course.highlights.trim() !== '' && (
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Highlights</h2>
                    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                      <ul className="list-disc pl-5 space-y-2">
                        {course.highlights.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                          <li key={index} className="text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right column - Purchase options (hidden on mobile/tablet, shown on desktop) */}
              <div className="hidden lg:block">
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 sticky top-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Course Options</h3>
                  
                  {/* Mode selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.modeAttemptPricing 
                        ? course.modeAttemptPricing.map((modeData) => (
                            <button
                              key={modeData.mode}
                              type="button"
                              onClick={() => handleModeChange(modeData.mode)}
                              className={`py-2 px-3 rounded-md text-sm font-medium ${
                                selectedMode === modeData.mode
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {modeData.mode}
                            </button>
                          ))
                        : (course.modes || ['Recorded', 'Live', 'Pendrive']).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => handleModeChange(mode)}
                              className={`py-2 px-3 rounded-md text-sm font-medium ${
                                selectedMode === mode
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {mode}
                            </button>
                          ))
                      }
                    </div>
                  </div>
                  
                  {/* Validity selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Views & Validity:</label>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedMode && course.modeAttemptPricing 
                        ? course.modeAttemptPricing
                            .find(m => m.mode === selectedMode)?.attempts.map((attempt) => (
                              <button
                                key={attempt.attempt}
                                type="button"
                                onClick={() => handleValidityChange(attempt.attempt)}
                                className={`py-2 px-3 rounded-md text-sm font-medium ${
                                  selectedValidity === attempt.attempt
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                              >
                                {attempt.attempt}
                              </button>
                            ))
                        : (course.durations || ['1.5 Views & 12 Months Validity', '2.5 Views & 24 Months Validity']).map((validity) => (
                            <button
                              key={validity}
                              type="button"
                              onClick={() => handleValidityChange(validity)}
                              className={`py-2 px-3 rounded-md text-sm font-medium ${
                                selectedValidity === validity
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {validity}
                            </button>
                          ))
                      }
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-gray-900">₹{price.final}</span>
                    {price.original > price.final && price.original > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through ml-2">₹{price.original}</span>
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {Math.round(((price.original - price.final) / price.original) * 100)}% Off
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Buy Now button */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    {isAuthenticated ? 'Buy Now' : 'Login to Purchase'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 md:p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6 max-w-sm md:max-w-md w-full mx-3">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Complete Your Profile</h2>
            <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">Please verify your details before proceeding to payment</p>
            
            <form>
              <div className="mb-3 md:mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleUserDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                />
              </div>
              
              <div className="mb-3 md:mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleUserDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                />
              </div>
              
              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleUserDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                  readOnly={!!userDetails.phone} // Make it readonly if already populated
                />
                <p className="mt-1 text-xs text-gray-500">You can only update your name and email. Create a new account if you want to update your phone number.</p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="md:flex-1 bg-gray-200 text-gray-800 font-medium py-2.5 rounded-md hover:bg-gray-300 order-2 md:order-1"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="md:flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-md hover:bg-blue-700 order-1 md:order-2"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
