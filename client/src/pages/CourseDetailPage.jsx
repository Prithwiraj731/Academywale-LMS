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
        
        // Validate courseId
        if (!courseId) {
          console.error('No courseId provided in URL parameters');
          setError('Course ID is missing. Please go back and try again.');
          setLoading(false);
          return;
        }
        
        console.log(`Fetching course details for courseId: ${courseId}, courseType: ${courseType}`);
        
        // Special handling for URL patterns like /courses/cma/final/paper-13
        let finalCourseId = courseId;
        if (courseType && courseType.includes('/')) {
          // This means we have a multi-part path like "cma/final"
          // We'll construct a more specific search query
          console.log('Detected multi-part course type path:', courseType);
          
          // The courseId might be something like "paper-13"
          // Let's try to extract paper number if present
          const paperMatch = courseId.match(/paper-(\d+)/i);
          if (paperMatch) {
            console.log('Detected paper number:', paperMatch[1]);
          }
        }
        
        // Try to find the course in multiple ways
        const isSlugifiedId = courseId.includes('-') && !courseId.match(/^[0-9a-f]{24}$/i);
        
        // Log the full URL for debugging
        // Pass courseType in the API request to help with matching
        let apiUrl = `${API_URL}/api/courses/details/${finalCourseId}`;
        if (courseType) {
          // Add courseType as a query parameter to help backend with matching
          apiUrl += `?courseType=${encodeURIComponent(courseType)}`;
        }
        console.log(`API URL: ${apiUrl}`);
        
        // If this appears to be a slugified ID (not a MongoDB ObjectId),
        // we might need to use a different API endpoint or search by attributes
        let alternativeSearchNeeded = isSlugifiedId;
        
        let res, data;
        
        try {
          res = await fetch(apiUrl);
          
          // Check if the response is OK before trying to parse JSON
          if (res.ok) {
            try {
              const contentType = res.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                data = await res.json();
                console.log('API Response:', data);
              } else {
                console.error('API did not return JSON, content type:', contentType);
                throw new Error('API returned non-JSON response');
              }
            } catch (jsonError) {
              console.error('Failed to parse API response as JSON:', jsonError);
              throw new Error('Failed to parse course data as JSON');
            }
          } else {
            console.log(`Regular API call failed with status: ${res.status}`);
            // Don't try to parse JSON from error responses
            if (res.status === 404) {
              throw new Error(`Course not found: ${courseId}`);
            } else {
              throw new Error(`API returned status code: ${res.status}`);
            }
          }
        } catch (fetchError) {
          console.error('Fetch error:', fetchError);
          // Set res.ok to false to trigger alternative search
          res = { ok: false };
        }
        
        // If the regular endpoint fails and we have a slugified ID, try searching for courses
        if ((!res.ok || !data || !data.course) && alternativeSearchNeeded) {
          console.log('Regular endpoint failed, trying course search...');
          
          // Try to decode parts from the slugified ID
          const parts = courseId.split('-');
          const searchParams = new URLSearchParams();
          
          if (parts.length > 0) {
            // Handle special case for course URLs like /courses/cma/final/paper-13
            if (courseType && courseId.toLowerCase().includes('paper')) {
              // Extract paper number if present
              const paperMatch = courseId.match(/paper-(\d+)/i);
              const paperNumber = paperMatch ? paperMatch[1] : null;
              
              console.log(`Extracted paper number: ${paperNumber}`);
              
              // For paths like "cma/final" we need to construct a proper search query
              let courseCategory = courseType;
              
              // Handle multi-part paths by replacing / with spaces
              if (courseType.includes('/')) {
                courseCategory = courseType.split('/')
                  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                  .join(' ');
              }
              
              // Create a complete search query like "CMA Final Paper 13"
              let fullSearchQuery = courseCategory;
              if (paperNumber) {
                fullSearchQuery += ` Paper ${paperNumber}`;
              }
              
              console.log(`Using constructed search query: "${fullSearchQuery}"`);
              searchParams.append('query', fullSearchQuery);
            } else {
              // Regular case - process the courseId parts
              const cleanedQuery = parts.join(' ')
                .replace(/-/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();
              
              searchParams.append('query', cleanedQuery);
              
              // If courseType is provided, use it to narrow down the search
              if (courseType) {
                // Convert courseType to a proper category name if needed
                // e.g., "cma-final" becomes "CMA Final"
                const formattedCategory = courseType
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ');
                
                searchParams.append('category', formattedCategory);
              }
            }
            
            const searchUrl = `${API_URL}/api/courses/search?${searchParams.toString()}`;
            console.log(`Trying search URL: ${searchUrl}`);
            
            try {
              const searchRes = await fetch(searchUrl);
              
              // First check if the response is OK
              if (!searchRes.ok) {
                const statusCode = searchRes.status;
                console.error(`Search API returned status: ${statusCode}`);
                
                // For 404 errors, give a more specific message
                if (statusCode === 404) {
                  throw new Error(`Course not found: ${courseId}. The course might have been removed or renamed.`);
                } else {
                  throw new Error(`Search API returned error code: ${statusCode}`);
                }
              }
              
              // Try to parse the response as JSON
              let searchData;
              try {
                const contentType = searchRes.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  searchData = await searchRes.json();
                } else {
                  console.error('API did not return JSON, content type:', contentType);
                  throw new Error('API returned non-JSON response');
                }
              } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                throw new Error('Failed to parse search results as JSON');
              }
              
              // Check if we have valid search results
              if (searchData && searchData.courses && searchData.courses.length > 0) {
                console.log(`Found ${searchData.courses.length} matching courses`);
                
                // Log all found courses to help with debugging
                if (searchData.courses.length > 1) {
                  console.log('Multiple matches found:');
                  searchData.courses.forEach((c, i) => {
                    console.log(`[${i}] ${c.subject || c.title || 'Unknown'} - ${c.courseType || 'No type'}`);
                  });
                }
                
                // Try to find the best match, especially for paper-specific courses
                let bestMatch = searchData.courses[0]; // Default to first result
                
                if (courseId.toLowerCase().includes('paper')) {
                  // Extract paper number for better matching
                  const paperMatch = courseId.match(/paper-(\d+)/i);
                  const paperNumber = paperMatch ? paperMatch[1] : null;
                  
                  if (paperNumber) {
                    console.log(`Looking for best match for Paper ${paperNumber}`);
                    
                    // Try to find a course with matching paper number
                    const paperMatch = searchData.courses.find(c => 
                      c.paperNumber === parseInt(paperNumber) || 
                      (c.subject && c.subject.toLowerCase().includes(`paper ${paperNumber}`)) ||
                      (c.paperName && c.paperName.toLowerCase().includes(`paper ${paperNumber}`))
                    );
                    
                    if (paperMatch) {
                      console.log(`Found exact paper match: ${paperMatch.subject || paperMatch.title}`);
                      bestMatch = paperMatch;
                    }
                  }
                }
                
                // Use the best matching course
                data = { course: bestMatch };
                console.log('Using best match:', data.course.subject || data.course.title);
              } else {
                console.error('No matching courses found in search');
                setError(`Could not find course "${courseId}". Please try another course.`);
                setLoading(false);
                return;
              }
            } catch (error) {
              console.error('Course search error:', error);
              setError(`${error.message || 'Course search failed. Please try another course or contact support.'}`);
              setLoading(false);
              return;
            }
          }
        } 
        // The else if (!res.ok) block is now handled in the try-catch above
        // And the else block for parsing JSON is also handled above
        
        if (data && data.course) {
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
          let errorMessage = 'Failed to fetch course details';
          
          if (data) {
            if (data.error && typeof data.error === 'string') {
              errorMessage = data.error;
            } else if (data.message && typeof data.message === 'string') {
              errorMessage = data.message;
            } else if (data.error && data.error.message && typeof data.error.message === 'string') {
              errorMessage = data.error.message;
            }
          }
          
          setError(errorMessage);
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
    // Validate mode and validity selection first
    if (!selectedMode || !selectedValidity) {
      alert('Please select both Mode and Validity before proceeding');
      return;
    }
    
    if (!isAuthenticated) {
      // Redirect to login with return path
      navigate('/login', { 
        state: { 
          from: `/course/${courseType}/${courseId}`,
          message: 'Please log in to purchase this course',
          courseData: {
            selectedMode,
            selectedValidity,
            price: price.final
          }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <LoadingSpinner size="lg" />
          <div className="text-gray-600 mt-4 text-center">Loading course details...</div>
          <div className="text-blue-500 mt-2 text-center text-sm animate-pulse">Please wait, this won't take long</div>
        </div>
      </div>
    );
  }

  // Set a timeout to automatically redirect after showing error for a brief time
  useEffect(() => {
    if (error && error.toLowerCase().includes('not found')) {
      const timer = setTimeout(() => {
        console.log('Auto-redirecting after course not found error');
        navigate('/courses');
      }, 5000); // Redirect after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            We encountered an error
          </h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          
          {error.toLowerCase().includes('not found') && (
            <p className="text-blue-500 text-sm text-center mb-4 animate-pulse">
              Redirecting to courses page in a few seconds...
            </p>
          )}
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/courses')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Browse Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-blue-500 text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M8 16l-4-4 4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6 text-center">The course you're looking for might have been removed or doesn't exist.</p>
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
          {/* Course header with hero image */}
          <div className="relative">
            {/* Banner image with overlay gradient */}
            <div className="h-48 md:h-64 lg:h-80 w-full bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
              {course.posterUrl && (
                <img 
                  src={course.posterUrl.startsWith('http') 
                    ? course.posterUrl 
                    : course.posterUrl.startsWith('/uploads') 
                      ? `${API_URL}${course.posterUrl}` 
                      : '/logo.svg'
                  }
                  alt={course.title || course.subject}
                  className="w-full h-full object-cover opacity-30"
                  onError={(e) => { e.target.src = '/logo.svg' }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
            </div>
            
            {/* Course title and info overlaid */}
            <div className="absolute bottom-0 left-0 right-0 text-white p-4 md:p-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 drop-shadow-lg">
                {course.title || course.subject}
              </h1>
              <div className="flex flex-wrap gap-3 md:gap-5 items-center text-sm md:text-base">
                <div className="bg-black bg-opacity-30 px-3 py-1 rounded-full">
                  <span className="opacity-80">Category:</span> {course.category || 'N/A'}
                </div>
                <div className="bg-black bg-opacity-30 px-3 py-1 rounded-full">
                  <span className="opacity-80">Paper:</span> {course.paperName || 'N/A'}
                </div>
                <div className="bg-black bg-opacity-30 px-3 py-1 rounded-full">
                  <span className="opacity-80">Faculty:</span> {course.facultyName || 'N/A'}
                </div>
                {course.institute && (
                  <div className="bg-black bg-opacity-30 px-3 py-1 rounded-full">
                    <span className="opacity-80">Institute:</span> {course.institute}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Course content */}
          <div className="p-4 md:p-8">
            {/* Mobile/Tablet - Purchase options first for smaller screens */}
            <div className="block lg:hidden mb-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                  <MdModeEdit className="mr-2 text-teal-600" /> Course Options
                </h3>
                
                {/* Mode selection - Enhanced UI */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaBook className="mr-1 text-teal-600" /> Mode:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {course.modeAttemptPricing 
                      ? course.modeAttemptPricing.map((modeData) => (
                          <button
                            key={modeData.mode}
                            type="button"
                            onClick={() => handleModeChange(modeData.mode)}
                            className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedMode === modeData.mode
                                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                                : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'
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
                            className={`py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedMode === mode
                                ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                                : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            {mode}
                          </button>
                        ))
                    }
                  </div>
                </div>
                
                {/* Validity selection - Enhanced UI */}
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <FaRegClock className="mr-1 text-teal-600" /> Views & Validity:
                  </label>
                  
                  {!selectedMode ? (
                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-center text-sm">
                      Please select a Mode first to view available plans
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {selectedMode && course.modeAttemptPricing 
                        ? course.modeAttemptPricing
                            .find(m => m.mode === selectedMode)?.attempts.map((attempt) => (
                              <button
                                key={attempt.attempt}
                                type="button"
                                onClick={() => handleValidityChange(attempt.attempt)}
                                className={`py-3 px-4 rounded-lg text-sm font-medium relative ${
                                  selectedValidity === attempt.attempt
                                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <span>{attempt.attempt}</span>
                                  <span className="font-bold">₹{attempt.sellingPrice}</span>
                                </div>
                                
                                {attempt.costPrice > attempt.sellingPrice && (
                                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    {Math.round(((attempt.costPrice - attempt.sellingPrice) / attempt.costPrice) * 100)}% OFF
                                  </div>
                                )}
                              </button>
                            ))
                        : (course.durations || ['1.5 Views & 12 Months Validity', '2.5 Views & 24 Months Validity']).map((validity) => (
                            <button
                              key={validity}
                              type="button"
                              onClick={() => handleValidityChange(validity)}
                              className={`py-3 px-4 rounded-lg text-sm font-medium ${
                                selectedValidity === validity
                                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
                                  : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {validity}
                            </button>
                          ))
                      }
                    </div>
                  )}
                </div>
                
                {/* Price - Enhanced UI */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg mb-4 md:mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Total Price:</p>
                    <div className="flex items-baseline">
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{price.final}</span>
                      {price.original > price.final && price.original > 0 && (
                        <span className="text-sm md:text-base text-gray-400 line-through ml-2">₹{price.original}</span>
                      )}
                    </div>
                  </div>
                  {price.original > price.final && price.original > 0 && (
                    <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-bold">
                      {Math.round(((price.original - price.final) / price.original) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                {/* Buy Now button - Enhanced UI */}
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 md:py-4 px-4 rounded-lg shadow-lg hover:from-teal-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] flex items-center justify-center"
                >
                  {isAuthenticated ? 'Buy Now' : 'Login to Purchase'}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
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
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <MdModeEdit className="mr-2 text-teal-600" /> Course Options
                  </h3>
                  
                  {/* Mode selection - Enhanced Desktop UI */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <FaBook className="mr-1 text-teal-600" /> Mode:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {course.modeAttemptPricing 
                        ? course.modeAttemptPricing.map((modeData) => (
                            <button
                              key={modeData.mode}
                              type="button"
                              onClick={() => handleModeChange(modeData.mode)}
                              className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                selectedMode === modeData.mode
                                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-[1.02]'
                                  : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-teal-300'
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
                              className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                selectedMode === mode
                                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-[1.02]'
                                  : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-teal-300'
                              }`}
                            >
                              {mode}
                            </button>
                          ))
                      }
                    </div>
                  </div>
                  
                  {/* Validity selection - Enhanced Desktop UI */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <FaRegClock className="mr-1 text-teal-600" /> Views & Validity:
                    </label>
                    
                    {!selectedMode ? (
                      <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-center text-sm">
                        Please select a Mode first to view available plans
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {selectedMode && course.modeAttemptPricing 
                          ? course.modeAttemptPricing
                              .find(m => m.mode === selectedMode)?.attempts.map((attempt) => (
                                <button
                                  key={attempt.attempt}
                                  type="button"
                                  onClick={() => handleValidityChange(attempt.attempt)}
                                  className={`py-3 px-4 rounded-lg transition-all duration-200 relative ${
                                    selectedValidity === attempt.attempt
                                      ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-[1.02]'
                                      : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-teal-300'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">{attempt.attempt}</span>
                                    <span className="font-bold">₹{attempt.sellingPrice}</span>
                                  </div>
                                  
                                  {attempt.costPrice > attempt.sellingPrice && selectedValidity !== attempt.attempt && (
                                    <div className="text-xs text-gray-500 flex items-center justify-between mt-1">
                                      <span className="line-through">₹{attempt.costPrice}</span>
                                      <span className="text-green-600 font-medium">
                                        {Math.round(((attempt.costPrice - attempt.sellingPrice) / attempt.costPrice) * 100)}% OFF
                                      </span>
                                    </div>
                                  )}
                                  
                                  {attempt.costPrice > attempt.sellingPrice && selectedValidity === attempt.attempt && (
                                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                      {Math.round(((attempt.costPrice - attempt.sellingPrice) / attempt.costPrice) * 100)}% OFF
                                    </div>
                                  )}
                                </button>
                              ))
                          : (course.durations || ['1.5 Views & 12 Months Validity', '2.5 Views & 24 Months Validity']).map((validity) => (
                              <button
                                key={validity}
                                type="button"
                                onClick={() => handleValidityChange(validity)}
                                className={`py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  selectedValidity === validity
                                    ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-[1.02]'
                                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-teal-300'
                                }`}
                              >
                                {validity}
                              </button>
                            ))
                        }
                      </div>
                    )}
                  </div>
                  
                  {/* Price - Enhanced UI */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Price:</p>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">₹{price.final}</span>
                        {price.original > price.final && price.original > 0 && (
                          <span className="text-lg text-gray-400 line-through ml-2">₹{price.original}</span>
                        )}
                      </div>
                    </div>
                    {price.original > price.final && price.original > 0 && (
                      <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-bold">
                        {Math.round(((price.original - price.final) / price.original) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  {/* Buy Now button - Enhanced UI */}
                  <button
                    onClick={handleBuyNow}
                    disabled={!selectedMode || !selectedValidity}
                    className={`w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg hover:from-teal-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] flex items-center justify-center ${
                      (!selectedMode || !selectedValidity) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isAuthenticated ? 'Buy Now' : 'Login to Purchase'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {(!selectedMode || !selectedValidity) && (
                    <p className="text-center text-xs text-amber-600 mt-2">
                      Please select both Mode and Validity to proceed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal - Enhanced UI */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-3 md:p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-5 md:p-7 max-w-sm md:max-w-md w-full mx-3 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">Complete Your Profile</h2>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-5 text-sm text-blue-700">
              Please verify your details before proceeding to payment
            </div>
            
            {/* Course Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-5">
              <div className="flex items-start mb-3">
                <div className="bg-teal-100 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-gray-900">{course.subject || course.title}</h4>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">{selectedMode}</span> • <span>{selectedValidity}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">Total Price</div>
                <div className="font-bold text-gray-900">₹{price.final}</div>
              </div>
            </div>
            
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleUserDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleUserDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  required
                />
              </div>
              
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleUserDetailsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
                  required
                  readOnly={!!userDetails.phone} // Make it readonly if already populated
                />
                <p className="mt-1 text-xs text-gray-500">You can only update your name and email. Create a new account if you want to update your phone number.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="bg-gray-100 text-gray-800 font-medium py-3 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium py-3 rounded-md hover:from-teal-600 hover:to-blue-600 transition-all flex items-center justify-center"
                >
                  <span>Proceed to Payment</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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
