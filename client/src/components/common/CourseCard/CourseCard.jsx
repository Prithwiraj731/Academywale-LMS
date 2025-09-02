import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaClock, FaBook, FaUser } from 'react-icons/fa';

/**
 * A responsive course card component for displaying course information
 * Works on all screen sizes with optimized layout
 * Shows course picture, title, lectures, timing, and View Details button
 */
const CourseCard = ({ 
  course,
  onViewDetails,
  apiUrl = import.meta.env.VITE_API_URL || 'https://academywale-lms.onrender.com',
  showModal = false, // If true, clicking "View Details" shows modal instead of navigation
}) => {
  const navigate = useNavigate();

  // Helper function to get proper poster URL
  const getPosterUrl = (course) => {
    if (!course.posterUrl) return '/logo.svg';
    
    if (course.posterUrl.startsWith('http')) return course.posterUrl;
    
    if (course.posterUrl.startsWith('/uploads')) {
      return `${apiUrl}${course.posterUrl}`;
    }
    
    return '/logo.svg';
  };

  // Get minimum selling price from all mode/attempt options
  const getMinimumPrice = () => {
    if (!course.modeAttemptPricing || course.modeAttemptPricing.length === 0) {
      return { sellingPrice: course.sellingPrice || 0, costPrice: course.costPrice || 0 };
    }

    const prices = course.modeAttemptPricing.flatMap(
      m => m.attempts.map(a => ({ sellingPrice: a.sellingPrice, costPrice: a.costPrice }))
    );

    // Find the lowest selling price
    return prices.reduce((min, price) => 
      price.sellingPrice < min.sellingPrice ? price : min, 
      prices[0]
    );
  };

  const { sellingPrice, costPrice } = getMinimumPrice();

  // Handle course click - either navigate or show modal
  const handleViewDetails = () => {
    // EMERGENCY FIX: If course has no _id, don't navigate - show alert instead
    if (!course._id && !course.id) {
      console.error('❌ Course missing _id - cannot navigate to details', course);
      alert(`Course "${course.subject || course.title || 'Unknown'}" is missing proper ID. Please contact support or try refreshing the page.`);
      return;
    }
    
    // Use the actual course ID
    const courseId = course._id || course.id;
    console.log('✅ Using course ID for navigation:', courseId);
    
    // Before navigation, ensure course has an ID property for future reference
    if (!course._id && !course.id) {
      course.id = courseId;
      console.log('Added generated ID to course object:', courseId);
    }
    
    // Also store original data attributes to help with fallback search
    if (!course._generatedFromData) {
      course._generatedFromData = {
        subject: course.subject || '',
        title: course.title || '',
        facultyName: course.facultyName || '',
        courseType: course.courseType || 'course',
        paperNumber: course.paperNumber || ''
      };
    }

    if (showModal && onViewDetails) {
      onViewDetails(course);
    } else {
      // Navigate to the full detail page that shows all course information
      navigate(`/course-details/${encodeURIComponent(course.courseType || 'course')}/${courseId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col h-full card">
      {/* Image Section with Course Picture */}
      <div className="relative">
        <img
          src={getPosterUrl(course)}
          alt={course.subject || course.title || 'Course'}
          className="w-full h-40 sm:h-48 md:h-52 object-cover"
          onError={(e) => {
            e.target.src = '/logo.svg';
          }}
        />
        {/* Course Type Badge */}
        <div className="absolute top-2 left-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-semibold truncate max-w-[80%] shadow-md">
          {course.courseType || (course.category ? `${course.category} ${course.subcategory}` : 'Course')}
        </div>
        {/* Discount Badge */}
        {costPrice > sellingPrice && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-md">
            {Math.round(((costPrice - sellingPrice) / costPrice) * 100)}% OFF
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Course Title */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-[2.5rem] sm:h-[3rem]">
          {course.title || course.subject}
        </h3>
        
        {/* Faculty Name */}
        {course.facultyName && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
            <FaUser className="mr-1 text-blue-500" />
            <span className="font-medium">{course.facultyName}</span>
          </div>
        )}
        
        {/* Course Details Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-xs sm:text-sm text-gray-600">
          {/* Number of Lectures */}
          {course.noOfLecture && (
            <div className="flex items-center">
              <FaPlay className="mr-2 text-blue-500 flex-shrink-0" />
              <span className="truncate">{course.noOfLecture}</span>
            </div>
          )}
          
          {/* Timing */}
          {course.timing && (
            <div className="flex items-center">
              <FaClock className="mr-2 text-green-500 flex-shrink-0" />
              <span className="truncate">{course.timing}</span>
            </div>
          )}
          
          {/* Books/Materials */}
          {course.books && (
            <div className="flex items-center col-span-1 sm:col-span-2">
              <FaBook className="mr-2 text-purple-500 flex-shrink-0" />
              <span className="truncate">{course.books}</span>
            </div>
          )}
          
          {/* Video Language */}
          {course.videoLanguage && (
            <div className="flex items-center col-span-1 sm:col-span-2">
              <span className="mr-2 text-orange-500">🗣️</span>
              <span className="truncate">{course.videoLanguage}</span>
            </div>
          )}
        </div>
        
        {/* Pricing Section */}
        <div className="mt-auto">
          <div className="text-xs text-gray-500 mb-1">Starting from:</div>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-lg sm:text-xl font-bold text-teal-600">
              ₹{sellingPrice?.toLocaleString()}
            </span>
            {costPrice > sellingPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{costPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        
        {/* View Details Button */}
        <button 
          onClick={handleViewDetails}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-teal-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] mobile-touch-target"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string,
    subject: PropTypes.string,
    facultyName: PropTypes.string,
    posterUrl: PropTypes.string,
    courseType: PropTypes.string,
    category: PropTypes.string,
    subcategory: PropTypes.string,
    noOfLecture: PropTypes.string,
    timing: PropTypes.string,
    books: PropTypes.string,
    videoLanguage: PropTypes.string,
    sellingPrice: PropTypes.number,
    costPrice: PropTypes.number,
    modeAttemptPricing: PropTypes.array,
  }).isRequired,
  onViewDetails: PropTypes.func,
  apiUrl: PropTypes.string,
  showModal: PropTypes.bool,
};

export default CourseCard;
