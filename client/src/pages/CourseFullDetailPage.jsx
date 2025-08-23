import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRegClock, FaBook, FaLanguage, FaCalendarAlt, 
         FaCheckCircle, FaUser, FaGraduationCap, FaChalkboardTeacher } from 'react-icons/fa';
import { MdVideoLibrary } from 'react-icons/md';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getCourseImageUrl } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || 'https://academywale-lms.onrender.com';

const CourseFullDetailPage = () => {
  const { courseId, courseType } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCourseDetails() {
      setLoading(true);
      setError('');
      try {
        // Build the API URL with courseType as a query parameter if available
        let apiUrl = `${API_URL}/api/courses/details/${courseId}`;
        if (courseType) {
          apiUrl += `?courseType=${encodeURIComponent(courseType)}`;
        }
        
        console.log(`Fetching course details from: ${apiUrl}`);
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch course details: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.course) {
          throw new Error('Invalid course data received');
        }
        
        setCourse(data.course);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err.message || 'Failed to load course details');
        setLoading(false);
      }
    }
    
    fetchCourseDetails();
  }, [courseId, courseType]);

  const getPosterUrl = (course) => {
    return getCourseImageUrl(course);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <LoadingSpinner size="lg" />
          <div className="text-gray-600 mt-4 text-center">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-blue-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Course Not Found</h2>
          <p className="text-gray-600 text-center mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
          <div className="relative">
            <img 
              src={getPosterUrl(course)} 
              alt={course.subject || course.title} 
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.src = '/logo.svg'; // Fallback image
              }}
            />
            {course.courseType && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-md">
                {course.courseType}
              </div>
            )}
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {course.subject || course.title}
            </h1>
            
            {course.facultyName && (
              <div className="flex items-center text-gray-700 mb-4">
                <FaUser className="mr-2 text-blue-500" />
                <span>Faculty: <span className="font-medium">{course.facultyName}</span></span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {course.mode && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.mode}
                </span>
              )}
              {course.videoLanguage && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.videoLanguage}
                </span>
              )}
              {course.category && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.category}
                </span>
              )}
              {course.subcategory && (
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  {course.subcategory}
                </span>
              )}
            </div>
            
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-teal-600 mr-2">
                ₹{course.sellingPrice || course.modeAttemptPricing?.[0]?.attempts?.[0]?.sellingPrice || 0}
              </span>
              {course.costPrice > course.sellingPrice && course.costPrice > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ₹{course.costPrice}
                  </span>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">
                    {Math.round(((course.costPrice - course.sellingPrice) / course.costPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
            
            <button
              onClick={() => navigate(`/course/${encodeURIComponent(courseType || 'general')}/${courseId}`)}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-teal-600 hover:to-blue-700 transition-all transform hover:scale-[1.01] flex items-center justify-center"
            >
              Purchase Course
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Course Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaGraduationCap className="mr-3 text-blue-500" />
                Course Description
              </h2>
              
              {course.description ? (
                <div className="prose prose-lg max-w-none text-gray-700">
                  {course.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
                  This is a comprehensive course covering all aspects of {course.subject || course.title}. 
                  For detailed curriculum information, please contact our support team.
                </div>
              )}
            </div>
            
            {/* What You'll Learn */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaCheckCircle className="mr-3 text-green-500" />
                What You'll Learn
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  `Complete ${course.subject || course.title} curriculum coverage`,
                  course.books ? `Study materials: ${course.books}` : 'Comprehensive study materials',
                  course.doubtSolving || 'Doubt solving sessions',
                  'Practice questions and solutions',
                  'Real-world problem solving',
                  'Exam preparation strategies'
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Course Features */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaChalkboardTeacher className="mr-3 text-purple-500" />
                Course Features
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <MdVideoLibrary className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Lectures</h4>
                      <p className="text-gray-700">{course.noOfLecture || 'Comprehensive lectures'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaRegClock className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Duration</h4>
                      <p className="text-gray-700">{course.timing || 'Self-paced learning'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaBook className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Study Materials</h4>
                      <p className="text-gray-700">{course.books || 'Comprehensive materials'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <FaLanguage className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Language</h4>
                      <p className="text-gray-700">{course.videoLanguage || 'Multiple languages available'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Course Info Card */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Course Information
              </h3>
              
              <div className="space-y-4">
                {course.videoRunOn && (
                  <div className="flex items-start border-b border-gray-100 pb-3">
                    <div className="bg-blue-100 p-2 rounded-md mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Video Platform</h4>
                      <p className="text-sm text-gray-600">{course.videoRunOn}</p>
                    </div>
                  </div>
                )}
                
                {course.doubtSolving && (
                  <div className="flex items-start border-b border-gray-100 pb-3">
                    <div className="bg-green-100 p-2 rounded-md mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Doubt Solving</h4>
                      <p className="text-sm text-gray-600">{course.doubtSolving}</p>
                    </div>
                  </div>
                )}
                
                {(course.supportMail || course.supportCall) && (
                  <div className="flex items-start border-b border-gray-100 pb-3">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Support</h4>
                      {course.supportMail && <p className="text-sm text-gray-600">Email: {course.supportMail}</p>}
                      {course.supportCall && <p className="text-sm text-gray-600">Phone: {course.supportCall}</p>}
                    </div>
                  </div>
                )}
                
                <div className="flex items-start border-b border-gray-100 pb-3">
                  <div className="bg-amber-100 p-2 rounded-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Last Updated</h4>
                    <p className="text-sm text-gray-600">
                      {new Date().toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/course/${encodeURIComponent(courseType || 'general')}/${courseId}`)}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-teal-600 hover:to-blue-700 transition-all transform hover:scale-[1.01] flex items-center justify-center"
                >
                  Enroll Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFullDetailPage;
