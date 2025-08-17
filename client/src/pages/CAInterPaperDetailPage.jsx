import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import papersData from '../data/papersData';

// Try to use remote API URL first, fall back to local if not available
const REMOTE_API_URL = import.meta.env.VITE_API_URL || '';
const LOCAL_API_URL = import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:5000';
const API_URL = REMOTE_API_URL || LOCAL_API_URL;

console.log('Using API URL:', API_URL);
if (!API_URL) {
  console.warn('Warning: No API URL is available. Image URLs and API calls may fail.');
}

const CAInterPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedAttempt, setSelectedAttempt] = useState('');

  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.ca.inter.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        console.log(`Fetching CA inter courses from: ${API_URL}/api/courses/CA/inter/${paperId}?includeStandalone=true`);
        
        const res = await fetch(`${API_URL}/api/courses/CA/inter/${paperId}?includeStandalone=true`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          cache: 'no-cache', // Avoid caching issues
          mode: 'cors', // Ensure CORS mode
        });
        
        console.log('Response status:', res.status);
        const data = await res.json();
        
        console.log('Course data summary:', data.courses?.map(c => ({ 
          id: c._id,
          subject: c.subject,
          isStandalone: c.isStandalone,
          facultyName: c.facultyName || 'N/A' 
        })));

        if (res.ok) {
          setCourses(data.courses || []);
        } else {
          setError(data.error || 'Could not fetch courses');
        }
      } catch (err) {
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
              CA Inter Paper - {currentPaper.id}
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
                  {course.courseType || 'CA Inter'}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.subject}
                </h3>
                
                {course.isStandalone ? (
                  <p className="text-sm text-gray-600 mb-3 font-medium">
                    Standalone Course
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

export default CAInterPaperDetailPage;
