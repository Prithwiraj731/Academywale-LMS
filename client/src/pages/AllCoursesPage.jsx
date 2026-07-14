import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import { getCourseImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api';

export default function AllCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch all courses (both standalone and faculty-based)
      const response = await fetch(`${API_URL}/api/courses/all`);
      const data = await response.json();
      
      if (response.ok) {
        setCourses(data.courses || []);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Server error occurred');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const caCourses = courses.filter(c => c.category && c.category.toUpperCase() === 'CA');
  const cmaCourses = courses.filter(c => c.category && c.category.toUpperCase() === 'CMA');
  const otherCourses = courses.filter(c => !c.category || (c.category.toUpperCase() !== 'CA' && c.category.toUpperCase() !== 'CMA'));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fffde7]">

        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-blue-600">Loading courses...</p>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fffde7]">

      <main className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Available Courses</h1>
          <p className="hidden sm:block text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2">Browse through our comprehensive course catalog</p>
          <div className="hidden sm:block mt-2">
            <span className="text-sm sm:text-2xl font-semibold text-blue-600">{courses.length} Courses Available</span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg">{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!error && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No courses found.</div>
          </div>
        )}

        {/* CA Courses Section */}
        {!error && caCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 pb-2 border-b border-teal-500/20 flex items-center gap-2">
              <span className="bg-teal-600 w-2.5 h-6 rounded-full"></span>
              CA Classes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {caCourses.map((course, index) => (
                <CourseCard key={course._id || index} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* CMA Courses Section */}
        {!error && cmaCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 pb-2 border-b border-purple-500/20 flex items-center gap-2">
              <span className="bg-purple-600 w-2.5 h-6 rounded-full"></span>
              CMA Classes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {cmaCourses.map((course, index) => (
                <CourseCard key={course._id || index} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Other Courses Section */}
        {!error && otherCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 pb-2 border-b border-blue-500/20 flex items-center gap-2">
              <span className="bg-blue-600 w-2.5 h-6 rounded-full"></span>
              Other Classes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {otherCourses.map((course, index) => (
                <CourseCard key={course._id || index} course={course} />
              ))}
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
