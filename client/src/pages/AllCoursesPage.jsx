import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackButton from '../components/common/BackButton';
import { getCourseImageUrl } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || '';

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

  const getPosterUrl = (course) => {
    return getCourseImageUrl(course);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fffde7]">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-blue-600">Loading courses...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fffde7]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Available Courses</h1>
          <p className="text-lg text-gray-600">Browse through our comprehensive course catalog</p>
          <div className="mt-4">
            <span className="text-2xl font-semibold text-blue-600">{courses.length} Courses Available</span>
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

        {/* Courses Grid */}
        {!error && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {courses.map((course, index) => (
              <div 
                key={course._id || index} 
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-102"
              >
                {/* Course Poster */}
                <div className="relative">
                  {course.posterUrl ? (
                    <img 
                      src={getPosterUrl(course)} 
                      alt="Course Poster" 
                      className="w-full h-52 object-cover"
                      onError={(e) => {
                        e.target.src = '/logo.svg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-52 bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center">
                      <span className="text-teal-600">No Image</span>
                    </div>
                  )}
                  {course.category && (
                    <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      {course.category} {course.subcategory}
                    </div>
                  )}
                </div>

                {/* Course Info */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title || course.subject}
                  </h3>
                  
                  {/* Faculty */}
                  {course.facultyName && (
                    <p className="text-sm text-gray-600 mb-3">
                      by <span className="font-medium">{course.facultyName}</span>
                    </p>
                  )}

                  {/* Paper Name if available */}
                  {course.paperName && (
                    <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md inline-block mb-2">
                      {course.paperName}
                    </div>
                  )}
                  
                  {/* Lectures count */}
                  {course.noOfLecture && (
                    <p className="text-xs text-gray-500 mb-2">
                      {course.noOfLecture}
                    </p>
                  )}

                  {/* Pricing */}
                  <div className="mt-3">
                    <div className="text-sm text-gray-500">Starting from:</div>
                    <div className="flex items-center gap-2">
                      {course.sellingPrice && (
                        <span className="text-2xl font-bold text-teal-600">
                          ₹{course.sellingPrice}
                        </span>
                      )}
                      {course.costPrice && course.costPrice > (course.sellingPrice || 0) && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{course.costPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      if (course.facultySlug) {
                        navigate(`/faculty/${course.facultySlug}`);
                      } else {
                        // For standalone courses without faculty, you might want to create a separate course detail page
                        alert('Course details coming soon!');
                      }
                    }}
                    className="w-full mt-4 bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
