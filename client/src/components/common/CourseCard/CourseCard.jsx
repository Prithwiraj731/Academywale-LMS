import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

/**
 * A responsive course card component for displaying course information
 * Works on all screen sizes with optimized layout
 */
const CourseCard = ({ 
  course,
  onViewDetails,
  apiUrl = '',
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
  const handleCourseClick = () => {
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
      navigate(`/course/${encodeURIComponent(course.courseType || 'course')}/${courseId}`);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col h-full">
      {/* Image Section */}
      <div className="relative">
        <img
          src={getPosterUrl(course)}
          alt={course.subject || 'Course'}
          className="w-full h-40 sm:h-48 object-cover"
          onError={(e) => {
            e.target.src = '/logo.svg';
          }}
        />
        <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 rounded-md text-xs font-semibold truncate max-w-[80%]">
          {course.courseType || (course.category ? `${course.category} ${course.subcategory}` : 'Course')}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 h-[2.5rem] sm:h-[3rem]">
          {course.subject || course.title}
        </h3>
        
        {course.facultyName ? (
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            by <span className="font-medium">{course.facultyName}</span>
          </p>
        ) : null}
        
        {/* Course Details Grid - Mobile Friendly */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-xs text-gray-500 mt-auto">
          {course.noOfLecture && (
            <div className="flex items-center">
              <span className="mr-1">📚</span>
              <span>{course.noOfLecture}</span>
            </div>
          )}
          
          {course.videoLanguage && (
            <div className="flex items-center">
              <span className="mr-1">🗣️</span>
              <span>{course.videoLanguage}</span>
            </div>
          )}
          
          {course.books && (
            <div className="flex items-center">
              <span className="mr-1">📖</span>
              <span>{course.books}</span>
            </div>
          )}
          
          {course.validityStartFrom && (
            <div className="flex items-center">
              <span className="mr-1">⏱️</span>
              <span>{course.validityStartFrom}</span>
            </div>
          )}
        </div>
        
        {/* Pricing Section */}
        <div className="mt-2 sm:mt-3">
          <div className="text-xs text-gray-500 mb-1">Starting from:</div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg sm:text-xl font-bold text-teal-600">
              ₹{sellingPrice}
            </span>
            {costPrice > sellingPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{costPrice}
              </span>
            )}
            {costPrice > sellingPrice && (
              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                {Math.round(((costPrice - sellingPrice) / costPrice) * 100)}% off
              </span>
            )}
          </div>
        </div>
        
        {/* Button */}
        <button 
          onClick={handleCourseClick}
          className="w-full mt-3 sm:mt-4 bg-teal-600 text-white py-1.5 sm:py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors text-center"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
  onViewDetails: PropTypes.func,
  apiUrl: PropTypes.string,
  showModal: PropTypes.bool,
};

export default CourseCard;
