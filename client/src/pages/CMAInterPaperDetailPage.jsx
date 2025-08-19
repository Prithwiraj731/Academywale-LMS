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
    if (course.posterUrl) {
      if (course.posterUrl.startsWith('http')) return course.posterUrl;
      if (course.posterUrl.startsWith('/uploads')) {
        const fullUrl = `${API_URL}${course.posterUrl}`;
        return fullUrl;
      }
    }
    return '/logo.svg';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white/95 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3 sm:p-4 flex flex-col items-center border border-[#20b2aa]">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border-2 sm:border-4 border-[#20b2aa] bg-gray-100 flex-shrink-0 flex items-center justify-center mb-3 sm:mb-4">
                <img src={getPosterUrl(course)} alt="Poster" className="object-cover w-full h-full" />
              </div>
              <div className="text-sm sm:text-lg font-bold text-[#17817a] mb-1 text-center line-clamp-2">{course.subject}</div>
              <div className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2 text-center">Faculty: {course.facultyName}</div>
              <div className="flex flex-col gap-1 text-xs text-gray-500 mb-1 sm:mb-2 text-center">
                <div>Lectures: {course.noOfLecture}</div>
                <div>Books: {course.books}</div>
                <div>Language: {course.videoLanguage}</div>
                <div>Validity: {course.validityStartFrom}</div>
                <div>Mode: {course.mode}</div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                <span className="text-sm sm:text-lg font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
                <span className="text-lg sm:text-xl font-bold text-indigo-700">₹{course.sellingPrice}</span>
              </div>
              <button
                onClick={() => navigate(`/course/${encodeURIComponent(course.courseType)}/${course._id}`)}
                className="mt-1 sm:mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-sm sm:text-base w-full"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMAInterPaperDetailPage;