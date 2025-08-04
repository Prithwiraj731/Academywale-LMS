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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {filteredCourses.map((course, idx) => (
            <div key={idx} className="bg-white/95 rounded-3xl shadow-2xl p-4 flex flex-col items-center border border-[#20b2aa]">
              <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg border-4 border-[#20b2aa] bg-gray-100 flex-shrink-0 flex items-center justify-center mb-4">
                <img src={getPosterUrl(course)} alt="Poster" className="object-cover w-full h-full" />
              </div>
              <div className="text-lg font-bold text-[#17817a] mb-1 text-center">{course.subject}</div>
              <div className="text-sm text-gray-700 mb-2 text-center">Faculty: {course.facultyName || 'N/A'}</div>
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