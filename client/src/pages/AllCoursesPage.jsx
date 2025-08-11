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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div 
                key={course._id || index} 
                className="bg-white/95 rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border border-gray-200"
              >
                {/* Course Poster */}
                <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 mb-4 flex items-center justify-center">
                  {course.posterUrl ? (
                    <img 
                      src={getPosterUrl(course)} 
                      alt="Course Poster" 
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-gray-500"
                    style={{ display: course.posterUrl ? 'none' : 'flex' }}
                  >
                    No Image
                  </div>
                </div>

                {/* Course Info */}
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900">
                    {course.title || course.subject}
                  </h3>

                  {/* Description */}
                  {course.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  {/* Course Details */}
                  <div className="space-y-1 text-sm text-gray-600">
                    {course.category && course.subcategory && (
                      <div><span className="font-semibold">Category:</span> {course.category} {course.subcategory}</div>
                    )}
                    {course.paperName && (
                      <div><span className="font-semibold">Paper:</span> {course.paperName}</div>
                    )}
                    {course.facultyName && (
                      <div><span className="font-semibold">Faculty:</span> {course.facultyName}</div>
                    )}
                    {course.institute && (
                      <div><span className="font-semibold">Institute:</span> {course.institute}</div>
                    )}
                    {course.noOfLecture && (
                      <div><span className="font-semibold">Lectures:</span> {course.noOfLecture}</div>
                    )}
                    {course.videoLanguage && (
                      <div><span className="font-semibold">Language:</span> {course.videoLanguage}</div>
                    )}
                  </div>

                  {/* Pricing */}
                  {(course.costPrice || course.sellingPrice) && (
                    <div className="flex items-center gap-3 pt-2">
                      {course.costPrice && course.sellingPrice && course.costPrice > course.sellingPrice ? (
                        <>
                          <span className="text-lg font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
                          <span className="text-xl font-bold text-green-600">₹{course.sellingPrice}</span>
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                            {Math.round(((course.costPrice - course.sellingPrice) / course.costPrice) * 100)}% off
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-blue-600">₹{course.sellingPrice || course.costPrice}</span>
                      )}
                    </div>
                  )}

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
                    className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4"
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
