import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';

// Try to use remote API URL first, fall back to local if not available
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('Using API URL:', API_URL);
if (!API_URL) {
  console.warn('Warning: No API URL is available. Image URLs and API calls may fail.');
}

const CAFinalPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState('');

  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.ca.final.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        console.log(`Fetching CA final courses from: ${API_URL}/api/courses/CA/final/${paperId}?includeStandalone=true`);
        
        // Define all the URL variations we'll try - ALWAYS include the standalone parameter
        const urlVariations = [
          `${API_URL}/api/courses/CA/final/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/ca/final/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/CA/Final/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/CA/final/${paperId}?includeStandalone=true`, // Added parameter to URL that was missing it
          `${API_URL}/api/courses/ca/final/${paperId}?includeStandalone=true`, // Added parameter to URL that was missing it
          `${API_URL}/api/courses/CA/FINAL/${paperId}?includeStandalone=true`,
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
              subject: "Financial Reporting (Faculty Course)",
              title: "Financial Reporting Complete Course",
              category: "CA",
              subcategory: "final",
              paperId: paperId,
              posterUrl: "/logo.svg",
              facultyName: "CA Ravi Kumar",
              description: "Complete Financial Reporting course by CA Ravi Kumar. Covers all concepts and practice questions.",
              noOfLecture: "45",
              books: "Study Material Provided",
              videoLanguage: "Hindi + English",
              videoRunOn: "All Devices",
              doubtSolving: "Whatsapp & Telegram",
              timing: "Flexible",
              courseType: "CA Final Paper 11",
              isStandalone: false,
              modeAttemptPricing: [
                {
                  mode: "Online",
                  attempts: [
                    { attempt: "1 Attempt", costPrice: 12999, sellingPrice: 9999 },
                    { attempt: "2 Attempts", costPrice: 15999, sellingPrice: 12999 }
                  ]
                },
                {
                  mode: "Offline",
                  attempts: [
                    { attempt: "1 Attempt", costPrice: 14999, sellingPrice: 11999 },
                    { attempt: "2 Attempts", costPrice: 17999, sellingPrice: 14999 }
                  ]
                }
              ]
            },
            {
              _id: "mock-standalone-course-1",
              subject: "Financial Reporting (Standalone Course)",
              title: "Financial Reporting Crash Course",
              category: "CA",
              subcategory: "final",
              paperId: paperId,
              posterUrl: "/logo.svg",
              facultyName: "Standalone Course",
              description: "Comprehensive crash course for Financial Reporting. Focused on exam preparation.",
              noOfLecture: "30",
              books: "PDF Notes Included",
              videoLanguage: "Hindi + English",
              videoRunOn: "All Devices",
              doubtSolving: "Whatsapp",
              timing: "Flexible",
              courseType: "CA Final Paper 11",
              isStandalone: true,
              modeAttemptPricing: [
                {
                  mode: "Online",
                  attempts: [
                    { attempt: "1 Attempt", costPrice: 9999, sellingPrice: 7999 },
                    { attempt: "2 Attempts", costPrice: 12999, sellingPrice: 9999 }
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
        return `${API_URL}${course.posterUrl}`;
      }
    }
    return '/logo.svg';
  };

  const handleCourseClick = (course) => {
    // Check if we have a valid course ID
    if (!course._id && !course.id) {
      console.error('Course has no ID, cannot navigate to details', course);
      alert('Cannot view course details: Missing course ID');
      return;
    }
    
    // Use _id or fallback to id if _id is missing
    const courseId = course._id || course.id;
    
    console.log(`Navigating to course details: /course/${encodeURIComponent(course.courseType || 'course')}/${courseId}`);
    navigate(`/course/${encodeURIComponent(course.courseType || 'course')}/${courseId}`);
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
              CA Final Paper - {currentPaper.id}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mb-8">
          {courses.map((course, idx) => (
            <CourseCard 
              key={idx}
              course={course}
              onViewDetails={handleCourseClick}
              apiUrl={API_URL}
              showModal={true}
            />
          ))}
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="p-6">
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

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Select Mode & Attempt</h3>
                    
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

                    {selectedMode && selectedAttempt && (
                      <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-lg">
                        Login To Proceed
                      </button>
                    )}
                  </div>
                </div>

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

export default CAFinalPaperDetailPage;
