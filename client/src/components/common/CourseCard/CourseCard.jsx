import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { normalizeModeAttemptPricing } from '../../../utils/coursePricing';

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

    const prices = normalizeModeAttemptPricing(course.modeAttemptPricing)
      .flatMap((modeOption) => {
        return modeOption.attempts.map((attempt) => ({
          sellingPrice: Number(attempt.sellingPrice) || 0,
          costPrice: Number(attempt.costPrice) || 0,
        }));
      })
      .filter((price) => price.sellingPrice > 0 || price.costPrice > 0);

    if (prices.length === 0) {
      return { sellingPrice: course.sellingPrice || 0, costPrice: course.costPrice || 0 };
    }

    // Find the lowest selling price
    return prices.reduce((min, price) =>
      price.sellingPrice < min.sellingPrice ? price : min,
      prices[0]
    );
  };

  const { sellingPrice, costPrice } = getMinimumPrice();

  // Handle course click - either navigate or show modal
  const handleCourseClick = () => {
    // Check if course has proper ID
    if (!course._id && !course.id) {
      console.error('❌ Course missing _id - cannot navigate to details', course);
      alert(`Course "${course.subject || course.title || 'Unknown'}" is missing proper ID. Please contact support or try refreshing the page.`);
      return;
    }

    // Use the actual course ID
    const courseId = course._id || course.id;
    console.log('✅ Using course ID for navigation:', courseId);

    if (showModal && onViewDetails) {
      onViewDetails(course);
    } else {
      // Navigate to course details page
      navigate(`/course-details/${encodeURIComponent(course.courseType || 'course')}/${courseId}`);
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col h-full">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/5] bg-gray-50 border-b border-gray-100 overflow-hidden flex items-center justify-center">
        <img
          src={getPosterUrl(course)}
          alt={course.subject || 'Course'}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.src = '/logo.svg';
          }}
        />
      </div>

      {/* Content Section */}
      <div className="p-2 xs:p-3 sm:p-4 flex flex-col flex-grow">
        {/* Course Title */}
        <h3 className="text-xs xs:text-sm sm:text-sm md:text-base font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {course.subject || course.title}
        </h3>

        {/* Spacer to push pricing and button to bottom */}
        <div className="flex-grow"></div>

        {/* Pricing Section */}
        <div className="mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <span className="text-sm xs:text-base sm:text-base md:text-lg font-bold text-black">
              ₹{sellingPrice?.toLocaleString() || '0'}
            </span>
            {costPrice > sellingPrice && (
              <>
                <span className="text-[10px] xs:text-xs text-gray-400 line-through">
                  ₹{costPrice?.toLocaleString()}
                </span>
                <span className="text-[8px] xs:text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded font-medium">
                  {Math.round(((costPrice - sellingPrice) / costPrice) * 100)}% off
                </span>
              </>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={handleCourseClick}
          className="w-full bg-teal-600 text-white py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold hover:bg-teal-700 transition-colors duration-200"
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
