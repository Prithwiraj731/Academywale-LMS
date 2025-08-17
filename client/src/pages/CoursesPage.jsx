import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { getCourseImageUrl } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || '';
if (!API_URL) {
  console.warn('Warning: VITE_API_URL is not set. Image URLs may be invalid.');
}

export default function CoursesPage() {
  const { type, level } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        const [facRes, instRes] = await Promise.all([
          fetch(`${API_URL}/api/faculties`),
          fetch(`${API_URL}/api/institutes`)
        ]);
        const facData = await facRes.json();
        const instData = await instRes.json();

        if (facRes.ok && Array.isArray(facData.faculties) && instRes.ok && Array.isArray(instData.institutes)) {
          let allCourses = [];
          facData.faculties.forEach(fac => {
            (fac.courses || []).forEach(course => {
              allCourses.push({ ...course, facultyName: fac.firstName + (fac.lastName ? ' ' + fac.lastName : '') });
            });
          });
          instData.institutes.forEach(inst => {
            (inst.courses || []).forEach(course => {
              allCourses.push({ ...course, facultyName: '' });
            });
          });

          const filtered = allCourses.filter(course => {
            if (!course.courseType) return false;
            const courseTypeLower = course.courseType.toLowerCase();
            const typeLower = type.toLowerCase();
            if (level) {
              const levelLower = level.toLowerCase();
              return courseTypeLower.includes(typeLower) && courseTypeLower.includes(levelLower);
            } else {
              return courseTypeLower.includes(typeLower);
            }
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
  }, [type, level]);

  const filteredCourses = subjectFilter === 'all' ? courses : courses.filter(c => c.subject && c.subject.toLowerCase() === subjectFilter.toLowerCase());
  const subjects = Array.from(new Set(courses.map(c => c.subject).filter(Boolean)));

  const getPosterUrl = (course) => {
    return getCourseImageUrl(course);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <BackButton />
        {loading && <div className="text-[#20b2aa] text-center">Loading courses...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        {!loading && !error && filteredCourses.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No courses found for this paper.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredCourses.map((course, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102">
              <div className="relative">
                <img 
                  src={getPosterUrl(course)} 
                  alt={course.subject} 
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    e.target.src = '/logo.svg';
                  }}
                />
                {course.courseType && (
                  <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    {course.courseType}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.subject}
                </h3>
                
                {course.facultyName && (
                  <p className="text-sm text-gray-600 mb-3">
                    by <span className="font-medium">{course.facultyName}</span>
                  </p>
                )}
                
                {course.noOfLecture && (
                  <p className="text-xs text-gray-500 mb-2">
                    {course.noOfLecture}
                  </p>
                )}
                
                {/* Quick Info */}
                <div className="flex flex-wrap gap-2 text-xs mb-3">
                  {course.mode && (
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {course.mode}
                    </span>
                  )}
                  {course.videoLanguage && (
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded">
                      {course.videoLanguage}
                    </span>
                  )}
                </div>
                
                {/* Pricing */}
                <div className="mt-3">
                  <div className="text-sm text-gray-500">Price:</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-teal-600">
                      ₹{course.sellingPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{course.costPrice}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/course/${encodeURIComponent(type)}/${course._id}`)}
                  className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-center"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}