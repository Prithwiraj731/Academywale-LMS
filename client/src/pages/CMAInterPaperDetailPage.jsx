import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';

// Try to use remote API URL first, fall back to local if not available
const REMOTE_API_URL = import.meta.env.VITE_API_URL || '';
const LOCAL_API_URL = import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:5000';
const API_URL = REMOTE_API_URL || LOCAL_API_URL;

console.log('Using API URL:', API_URL);
if (!API_URL) {
  console.warn('Warning: No API URL is available. Image URLs and API calls may fail.');
}

const CMAInterPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract paper ID from paperSlug (e.g., "paper-1" -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.cma.inter.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        console.log(`Fetching CMA inter courses from: ${API_URL}/api/courses/CMA/inter/${paperId}`);
        
        // Try different URL variations
        const urlVariations = [
          `${API_URL}/api/courses/CMA/inter/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/cma/inter/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/CMA/Inter/${paperId}`,
          `${API_URL}/api/courses/CMA/INTER/${paperId}`,
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
        
        // If no courses found with any URL variation, show "no courses" message
        if (!coursesFound) {
          console.log("No courses found for this paper. Not creating mock courses anymore.");
          setCourses([]);
          setError("No courses available for this paper yet. Check back later.");
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Server error');
      }
      setLoading(false);
    }
    if (currentPaper) fetchCourses();
  }, [paperSlug, currentPaper]);

    const getPosterUrl = (course) => {
    if (!course.posterUrl) return '/logo.svg';
    
    if (course.posterUrl.startsWith('http')) {
      return course.posterUrl;
    }
    
    if (course.posterUrl.startsWith('/uploads')) {
      return `${API_URL}${course.posterUrl}`;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <BackButton />
        {currentPaper ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">
              CMA Inter Paper - {currentPaper.id}
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
                    {selectedCourse.subject || selectedCourse.title}
                  </h2>
                  {selectedCourse.facultyName && (
                    <p className="text-lg text-gray-600 mb-2">
                      by {selectedCourse.facultyName}
                    </p>
                  )}
                  <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    {currentPaper?.title || 'CMA Inter'}
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

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="text-3xl font-bold text-gray-900 mr-3">
                        {selectedMode && selectedAttempt ? (
                          <>
                            ₹{selectedCourse.modeAttemptPricing
                              ?.find(m => m.mode === selectedMode)
                              ?.attempts
                              ?.find(a => a.attempt === selectedAttempt)
                              ?.sellingPrice || 'N/A'}
                          </>
                        ) : (
                          selectedCourse.sellingPrice ? `₹${selectedCourse.sellingPrice}` : 'Select options'
                        )}
                      </span>
                      {selectedMode && selectedAttempt && (
                        <>
                          <span className="text-lg text-gray-400 line-through mr-2">
                            ₹{selectedCourse.modeAttemptPricing
                              ?.find(m => m.mode === selectedMode)
                              ?.attempts
                              ?.find(a => a.attempt === selectedAttempt)
                              ?.costPrice}
                          </span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {(() => {
                              const sellingPrice = selectedCourse.modeAttemptPricing
                                ?.find(m => m.mode === selectedMode)
                                ?.attempts
                                ?.find(a => a.attempt === selectedAttempt)
                                ?.sellingPrice;
                              
                              const costPrice = selectedCourse.modeAttemptPricing
                                ?.find(m => m.mode === selectedMode)
                                ?.attempts
                                ?.find(a => a.attempt === selectedAttempt)
                                ?.costPrice;
                              
                              if (sellingPrice && costPrice && costPrice > sellingPrice) {
                                return `${Math.round(((costPrice - sellingPrice) / costPrice) * 100)}% off`;
                              }
                              return '';
                            })()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => navigate(`/course/${encodeURIComponent(selectedCourse.courseType || 'course')}/${selectedCourse._id}`)}
                    className="w-full bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 transition"
                  >
                    View Full Details
                  </button>
                </div>
              </div>

              {/* Course Description */}
              {selectedCourse.description && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Description</h3>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="text-gray-700">{selectedCourse.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMAInterPaperDetailPage;