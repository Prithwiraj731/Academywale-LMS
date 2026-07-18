import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import { getCourseImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api';

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {filteredCourses.map((course, idx) => (
            <CourseCard
              key={course._id || idx}
              course={course}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
