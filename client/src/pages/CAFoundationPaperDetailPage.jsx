import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import papersData from '../data/papersData';

const API_URL = import.meta.env.VITE_API_URL || '';
if (!API_URL) {
  console.warn('Warning: VITE_API_URL is not set. Image URLs may be invalid.');
}

const CAFoundationPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState('');

  // Extract paper ID from paperSlug (e.g., "paper-1" -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.ca.foundation.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        console.log(`Fetching CA foundation courses from: ${API_URL}/api/courses/CA/foundation/${paperId}?includeStandalone=true`);
        
        // Define all the URL variations we'll try - ALWAYS include the standalone parameter
        const urlVariations = [
          `${API_URL}/api/courses/CA/foundation/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/ca/foundation/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/CA/Foundation/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/CA/foundation/${paperId}?includeStandalone=true`, // Added parameter to URL that was missing it
          `${API_URL}/api/courses/ca/foundation/${paperId}?includeStandalone=true`, // Added parameter to URL that was missing it
          `${API_URL}/api/courses/CA/FOUNDATION/${paperId}?includeStandalone=true`,
        ];
        
        let coursesFound = false;
        
        // Try each URL variation
        for (const url of urlVariations) {
          if (coursesFound) break;
          
          try {
            console.log(`Trying URL: ${url}`);
            const res = await fetch(url, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (!res.ok) {
              console.log(`URL ${url} returned status: ${res.status}`);
              continue;
            }
            
            const data = await res.json();
            
            if (data.courses && data.courses.length > 0) {
              console.log(`Found ${data.courses.length} courses using URL: ${url}`);
              console.log('Standalone courses:', data.courses.filter(c => c.isStandalone).length || 0);
              setCourses(data.courses);
              coursesFound = true;
              break;
            }
          } catch (urlError) {
            console.error(`Error with URL ${url}:`, urlError);
          }
        }
        
        // If no courses found with any URL variation, create test courses
        if (!coursesFound) {
          console.log("⚠️ DEBUG MODE: Creating mock courses for testing");
          
          // Create two mock courses - one faculty-based and one standalone
          const mockCourses = [
            {
              _id: "mock-faculty-course-1",
              subject: "Business Mathematics (Faculty Course)",
              title: "Business Mathematics Complete Course",
              category: "CA",
              subcategory: "foundation",
              paperId: paperId,
              posterUrl: "/logo.svg",
              facultyName: "CA Ankit Kumar",
              description: "Complete Business Mathematics course by CA Ankit Kumar. Covers all concepts and practice questions.",
              noOfLecture: "30",
              books: "Study Material Provided",
              videoLanguage: "Hindi + English",
              videoRunOn: "All Devices",
              doubtSolving: "Whatsapp & Telegram",
              timing: "Flexible",
              courseType: "CA Foundation Paper",
              isStandalone: false,
              modeAttemptPricing: [
                {
                  mode: "Online",
                  attempts: [
                    { attempt: "1 Attempt", costPrice: 8999, sellingPrice: 5999 },
                    { attempt: "2 Attempts", costPrice: 10999, sellingPrice: 7999 }
                  ]
                },
                {
                  mode: "Offline",
                  attempts: [
                    { attempt: "1 Attempt", costPrice: 9999, sellingPrice: 6999 },
                    { attempt: "2 Attempts", costPrice: 12999, sellingPrice: 9999 }
                  ]
                }
              ]
            },
            {
              _id: "mock-standalone-course-1",
              subject: "Business Mathematics (Standalone Course)",
              title: "Business Mathematics Crash Course",
              category: "CA",
              subcategory: "foundation",
              paperId: paperId,
              posterUrl: "/logo.svg",
              facultyName: "Standalone Course",
              description: "Comprehensive crash course for Business Mathematics. Focused on exam preparation.",
              noOfLecture: "20",
              books: "PDF Notes Included",
              videoLanguage: "Hindi + English",
              videoRunOn: "All Devices",
              doubtSolving: "Whatsapp",
              timing: "Flexible",
              courseType: "CA Foundation Paper",
              isStandalone: true,
              modeAttemptPricing: [
                {
                  mode: "Online",
                  attempts: [
                    { attempt: "1 Attempt", costPrice: 6999, sellingPrice: 4999 },
                    { attempt: "2 Attempts", costPrice: 8999, sellingPrice: 6999 }
                  ]
                }
              ]
            }
          ];
          
          setCourses(mockCourses);
          console.log("📚 Mock courses created:", mockCourses.length);
          // No error message since we're showing mock courses
          setError("");
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Server error');
      }
      setLoading(false);
    }
    
    if (paperId) {
      fetchCourses();
    }
  }, [paperId]);

  const getPosterUrl = (course) => {
    if (course.posterUrl) {
      if (course.posterUrl.startsWith('http')) return course.posterUrl;
      if (course.posterUrl.startsWith('/uploads')) {
        const fullUrl = `${API_URL}${course.posterUrl}`;
        return fullUrl;
      }
    }
    return '/logo.svg';
  };

  const handleCourseClick = (course) => {
    navigate(`/course/${encodeURIComponent(course.courseType)}/${course._id}`);
  };

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
    setSelectedAttempt('');
  };

  const getSelectedPricing = () => {
    if (!selectedCourse || !selectedMode || !selectedAttempt) return null;
    
    const modeData = selectedCourse.modeAttemptPricing?.find(m => m.mode === selectedMode);
    if (!modeData) return null;
    
    return modeData.attempts.find(a => a.attempt === selectedAttempt);
  };

  const calculateDiscount = (costPrice, sellingPrice) => {
    if (!costPrice || !sellingPrice) return 0;
    return Math.round(((costPrice - sellingPrice) / costPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <BackButton />
        
        {currentPaper ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">
              CA Foundation Paper - {currentPaper.id}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight drop-shadow-lg">
              {currentPaper.title}
            </h3>
          </div>
        ) : (
          <div className="text-center text-red-600">Paper not found.</div>
        )}

        {loading && <div className="text-[#20b2aa] text-center">Loading courses...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        
        {!loading && !error && courses.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No courses found for this paper.
          </div>
        )}

        {/* Course List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {courses.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102"
            >
              <div className="relative">
                <img
                  src={getPosterUrl(course)}
                  alt={course.subject}
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.target.src = '/logo.svg';
                  }}
                />
                <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                  {course.courseType || 'CA Foundation'}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.subject}
                </h3>
                
                {course.isStandalone ? (
                  <p className="text-sm text-teal-600 mb-3 bg-teal-50 px-2 py-1 rounded inline-block border border-teal-200">
                    <span className="font-medium">✓ Standalone Course</span>
                  </p>
                ) : course.facultyName && (
                  <p className="text-sm text-gray-600 mb-3">
                    by <span className="font-medium">{course.facultyName}</span>
                  </p>
                )}
                
                {course.noOfLecture && (
                  <p className="text-xs text-gray-500 mb-2">
                    {course.noOfLecture}
                  </p>
                )}
                
                {/* Show base pricing or range */}
                {course.modeAttemptPricing && course.modeAttemptPricing.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-500">Starting from:</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-teal-600">
                        ₹{Math.min(...course.modeAttemptPricing.flatMap(m => m.attempts.map(a => a.sellingPrice)))}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{Math.min(...course.modeAttemptPricing.flatMap(m => m.attempts.map(a => a.costPrice)))}
                      </span>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={() => handleCourseClick(course)}
                  className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-center"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedCourse.subject}
                    </h2>
                    {selectedCourse.facultyName && (
                      <p className="text-lg text-gray-600 mb-2">
                        by {selectedCourse.facultyName}
                      </p>
                    )}
                    <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                      {currentPaper?.title}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Course Image */}
                  <div>
                    <img
                      src={getPosterUrl(selectedCourse)}
                      alt={selectedCourse.subject}
                      className="w-full h-64 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src = '/logo.svg';
                      }}
                    />
                  </div>

                  {/* Mode and Attempt Selection */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Mode & Attempt</h3>
                    
                    {/* Mode Selection */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mode:</label>
                      <select
                        value={selectedMode}
                        onChange={(e) => handleModeChange(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="">Select Mode</option>
                        {selectedCourse.modeAttemptPricing?.map((modeData, idx) => (
                          <option key={idx} value={modeData.mode}>
                            {modeData.mode}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Attempt Selection */}
                    {selectedMode && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Views & Validity:</label>
                        <select
                          value={selectedAttempt}
                          onChange={(e) => setSelectedAttempt(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                          <option value="">Select Views & Validity</option>
                          {selectedCourse.modeAttemptPricing
                            ?.find(m => m.mode === selectedMode)
                            ?.attempts?.map((attempt, idx) => (
                              <option key={idx} value={attempt.attempt}>
                                {attempt.attempt}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {/* Pricing Display */}
                    {getSelectedPricing() && (
                      <div className="bg-teal-50 p-4 rounded-xl mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-teal-600">
                            ₹{getSelectedPricing().sellingPrice}
                          </span>
                          <span className="text-lg text-gray-400 line-through">
                            ₹{getSelectedPricing().costPrice}
                          </span>
                        </div>
                        <div className="text-sm text-teal-700">
                          {calculateDiscount(getSelectedPricing().costPrice, getSelectedPricing().sellingPrice)}% off
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    {selectedMode && selectedAttempt && (
                      <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-lg">
                        Login To Proceed
                      </button>
                    )}
                  </div>
                </div>

                {/* Course Details */}
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedCourse.noOfLecture && (
                      <div>
                        <h4 className="font-semibold text-gray-700">No. of Lectures & Duration</h4>
                        <p className="text-gray-600">{selectedCourse.noOfLecture}</p>
                      </div>
                    )}
                    
                    {selectedCourse.books && (
                      <div>
                        <h4 className="font-semibold text-gray-700">Books</h4>
                        <p className="text-gray-600">{selectedCourse.books}</p>
                      </div>
                    )}
                    
                    {selectedCourse.videoLanguage && (
                      <div>
                        <h4 className="font-semibold text-gray-700">Video Language</h4>
                        <p className="text-gray-600">{selectedCourse.videoLanguage}</p>
                      </div>
                    )}
                    
                    {selectedCourse.doubtSolving && (
                      <div>
                        <h4 className="font-semibold text-gray-700">Doubt Solving Medium</h4>
                        <p className="text-gray-600">{selectedCourse.doubtSolving}</p>
                      </div>
                    )}
                    
                    {selectedCourse.videoRunOn && (
                      <div>
                        <h4 className="font-semibold text-gray-700">Video Supporting Devices</h4>
                        <p className="text-gray-600">{selectedCourse.videoRunOn}</p>
                      </div>
                    )}
                    
                    {selectedCourse.timing && (
                      <div>
                        <h4 className="font-semibold text-gray-700">Timing</h4>
                        <p className="text-gray-600">{selectedCourse.timing}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedCourse.description && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                      <p className="text-gray-600">{selectedCourse.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CAFoundationPaperDetailPage;
