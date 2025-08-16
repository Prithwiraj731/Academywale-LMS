import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import papersData from '../data/papersData';

const API_URL = import.meta.env.VITE_API_URL || '';
if (!API_URL) {
  console.warn('Warning: VITE_API_URL is not set. Image URLs may be invalid.');
}

const CMAFoundationPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentPaper = papersData.cma.foundation.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        // Use the unified API endpoint for courses by category, subcategory, and paper
        const res = await fetch(`${API_URL}/api/courses/CMA/foundation/${paperId}?includeStandalone=true`);
        
        console.log(`Fetching CMA courses from: ${API_URL}/api/courses/CMA/foundation/${paperId}?includeStandalone=true`);
        const data = await res.json();
        
        console.log('CMA courses response:', data);

        if (res.ok) {
          console.log(`Found ${data.courses?.length || 0} CMA courses, including standalone:`, 
                    data.courses?.filter(c => c.isStandalone).length || 0);
          
          const filtered = data.courses || [];

          setCourses(filtered);
        } else {
          setError('Could not fetch courses');
        }
      } catch (err) {
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
              CMA Foundation Paper - {currentPaper.id}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white/95 rounded-3xl shadow-2xl p-4 flex flex-col items-center border border-[#20b2aa]">
              <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-[#20b2aa] bg-gray-100 flex-shrink-0 flex items-center justify-center mb-4">
                <img src={getPosterUrl(course)} alt="Poster" className="object-cover w-full h-full" />
              </div>
              <div className="text-lg font-bold text-[#17817a] mb-1 text-center">{course.subject}</div>
              {course.isStandalone ? (
                <div className="text-sm text-teal-600 mb-2 bg-teal-50 px-2 py-1 rounded inline-block border border-teal-200">
                  <span className="font-medium">✓ Standalone Course</span>
                </div>
              ) : (
                <div className="text-sm text-gray-700 mb-2 text-center">Faculty: {course.facultyName || 'N/A'}</div>
              )}
              <div className="flex flex-col gap-1 text-xs text-gray-500 mb-2 text-center">
                <div>Lectures: {course.noOfLecture}</div>
                <div>Books: {course.books}</div>
                <div>Language: {course.videoLanguage}</div>
                <div>Validity: {course.validityStartFrom}</div>
                <div>Mode: {course.mode}</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
                <span className="text-xl font-bold text-indigo-700">₹{course.sellingPrice}</span>
              </div>
              <button
                onClick={() => navigate(`/payment/${encodeURIComponent(course.courseType)}/${course._id}`)}
                className="mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-base w-full"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMAFoundationPaperDetailPage;