import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CoursePurchase from '../components/common/CoursePurchase';


const API_URL = import.meta.env.VITE_API_URL || '';
if (!API_URL) {
  console.warn('Warning: VITE_API_URL is not set. Image URLs may be invalid.');
}
console.log('API_URL:', API_URL);

export default function CoursesPage() {
  const { type, level } = useParams(); // 'ca' or 'cma', and 'foundation', 'inter', 'final'
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/faculties`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.faculties)) {
          // Flatten all courses with faculty info, filter by courseType
          const filtered = [];
          data.faculties.forEach(fac => {
            (fac.courses || []).forEach(course => {
              if (course.courseType) {
                const courseTypeLower = course.courseType.toLowerCase();
                const typeLower = type.toLowerCase();
                
                if (level) {
                  // If level is specified, check if courseType contains both type and level
                  const levelLower = level.toLowerCase();
                  if (courseTypeLower.includes(typeLower) && courseTypeLower.includes(levelLower)) {
                    filtered.push({ ...course, facultyName: fac.firstName + (fac.lastName ? ' ' + fac.lastName : '') });
                  }
                } else {
                  // If no level specified, show all courses of that type
                  if (courseTypeLower.includes(typeLower)) {
                    filtered.push({ ...course, facultyName: fac.firstName + (fac.lastName ? ' ' + fac.lastName : '') });
                  }
                }
              }
            });
          });
          setCourses(filtered);
        } else {
          setError('Could not fetch courses');
        }
      } catch (err) {
        setError('Server error');
      }
      setLoading(false);
    }
    if (type === 'ca' || type === 'cma') fetchCourses();
  }, [type]);

  const getPosterUrl = (course) => {
    if (course.posterUrl) {
      if (course.posterUrl.startsWith('http')) return course.posterUrl;
      if (course.posterUrl.startsWith('/uploads')) {
        const fullUrl = `${API_URL}${course.posterUrl}`;
        console.log('Image URL:', fullUrl);
        return fullUrl;
      }
    }
    return '/logo.svg';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <button
          className="mb-6 text-[#20b2aa] font-semibold hover:underline flex items-center text-base"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight text-center drop-shadow-lg">
          {level ? `${type.toUpperCase()} ${level.charAt(0).toUpperCase() + level.slice(1)} Courses` : `${type.toUpperCase()} Courses`}
        </h2>
        {loading && <div className="text-[#20b2aa] text-center">Loading courses...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No courses found for {level ? `${type.toUpperCase()} ${level.charAt(0).toUpperCase() + level.slice(1)}` : type.toUpperCase()}.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white/95 rounded-3xl shadow-2xl p-6 flex flex-col items-center border border-[#20b2aa]">
              <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-[#20b2aa] bg-gray-100 flex-shrink-0 flex items-center justify-center mb-4">
                <img src={getPosterUrl(course)} alt="Poster" className="object-cover w-full h-full" />
              </div>
              <div className="text-xl font-bold text-[#17817a] mb-1 text-center">{course.subject}</div>
              <div className="text-sm text-gray-700 mb-2 text-center">Faculty: {course.facultyName}</div>
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
                onClick={() => navigate(`/payment/${encodeURIComponent(type)}/${course._id}`)}
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
}
