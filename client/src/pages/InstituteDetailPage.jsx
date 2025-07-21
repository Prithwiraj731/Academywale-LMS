import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CoursePurchase from '../components/common/CoursePurchase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function InstituteDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseCourse, setPurchaseCourse] = useState(null);

  useEffect(() => {
    const name = slug.replace(/_/g, ' ');
    fetch(`/api/institutes`)
      .then(res => res.json())
      .then(data => {
        const inst = (data.institutes || []).find(i => i.name === name);
        setInstitute(inst || null);
      });
    fetch('/api/faculties')
      .then(res => res.json())
      .then(data => {
        if (data.faculties) {
          const allCourses = [];
          data.faculties.forEach(fac => {
            (fac.courses || []).forEach(course => {
              if (course.institute === name) {
                allCourses.push({ ...course, facultyName: fac.firstName + (fac.lastName ? ' ' + fac.lastName : '') });
              }
            });
          });
          setCourses(allCourses);
        } else {
          setCourses([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Server error');
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f4] via-purple-50 to-yellow-50 py-12 px-2 sm:px-4 flex flex-col items-center relative">
      <button
        className="absolute top-6 left-6 text-[#20b2aa] hover:bg-[#e0f7f4] rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#20b2aa]"
        onClick={() => navigate('/institutes')}
        aria-label="Back to Institutes"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-6 font-heading tracking-tight drop-shadow-lg">
        {institute ? institute.name : 'Institute'}
      </h2>
      {institute && (
        <div className="w-44 h-44 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center mb-8 border-2 border-[#20b2aa]">
          <img
            src={institute.imageUrl || institute.img}
            alt={institute.name}
            className="object-contain w-full h-full"
          />
        </div>
      )}
      <div className="w-full max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-[#20b2aa] mb-4 text-center">Courses at {institute ? institute.name : ''}</h3>
        {loading && <div className="text-blue-500 text-center">Loading courses...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        {!loading && !error && courses.length === 0 && <div className="text-gray-500 text-center">No courses found for this institute.</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2 border border-[#20b2aa]">
              <div className="font-bold text-lg text-[#17817a]">{course.subject}</div>
              <div className="text-sm text-gray-700">Faculty: {course.facultyName}</div>
              <div className="text-xs text-gray-500">Lectures: {course.noOfLecture}</div>
              <div className="text-xs text-gray-500">Books: {course.books}</div>
              <div className="text-xs text-gray-500">Language: {course.videoLanguage}</div>
              <div className="text-xs text-gray-500">Validity: {course.validityStartFrom}</div>
              <div className="text-xs text-gray-500">Mode: {course.mode}</div>
              <div className="text-xs text-gray-500">Type: {course.courseType}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
                <span className="text-xl font-bold text-indigo-700">₹{course.sellingPrice}</span>
              </div>
              <button
                className="mt-3 px-4 py-2 bg-[#17817a] text-white rounded-lg font-semibold hover:bg-[#145c54] transition"
                onClick={() => setPurchaseCourse(course)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
      {purchaseCourse && (
        <CoursePurchase
          course={purchaseCourse}
          onClose={() => setPurchaseCourse(null)}
        />
      )}
    </div>
  );
} 