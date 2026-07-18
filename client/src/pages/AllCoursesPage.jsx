import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import { getCourseImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api';

// Horizontal slider/carousel for displaying course cards professionally
const CourseSlider = ({ courses }) => {
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);
  const [desktopScroll, setDesktopScroll] = useState({ left: false, right: true });
  const [mobileScroll, setMobileScroll] = useState({ left: false, right: true });

  const checkScroll = (ref, setScroll) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScroll({
        left: scrollLeft > 5,
        right: scrollLeft + clientWidth < scrollWidth - 5
      });
    }
  };

  useEffect(() => {
    const dEl = desktopRef.current;
    const mEl = mobileRef.current;
    
    const handleDScroll = () => checkScroll(desktopRef, setDesktopScroll);
    const handleMScroll = () => checkScroll(mobileRef, setMobileScroll);

    if (dEl) {
      dEl.addEventListener('scroll', handleDScroll);
      checkScroll(desktopRef, setDesktopScroll);
    }
    if (mEl) {
      mEl.addEventListener('scroll', handleMScroll);
      checkScroll(mobileRef, setMobileScroll);
    }

    const timer = setTimeout(() => {
      checkScroll(desktopRef, setDesktopScroll);
      checkScroll(mobileRef, setMobileScroll);
    }, 500);

    window.addEventListener('resize', handleDScroll);
    window.addEventListener('resize', handleMScroll);

    return () => {
      if (dEl) dEl.removeEventListener('scroll', handleDScroll);
      if (mEl) mEl.removeEventListener('scroll', handleMScroll);
      window.removeEventListener('resize', handleDScroll);
      window.removeEventListener('resize', handleMScroll);
      clearTimeout(timer);
    };
  }, [courses]);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { clientWidth } = ref.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!courses || courses.length === 0) return null;

  // Chunk courses into columns of 2 for mobile (2 rows)
  const mobileColumns = [];
  for (let i = 0; i < courses.length; i += 2) {
    mobileColumns.push(courses.slice(i, i + 2));
  }

  return (
    <>
      {/* Desktop Slider (Visible on lg and up) */}
      <div className="hidden lg:block relative group/slider w-full">
        <div
          ref={desktopRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {courses.map((course, index) => (
            <div
              key={course._id || index}
              className="w-[calc(25%-12px)] flex-shrink-0 snap-start"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {courses.length > 4 && (
          <>
            <button
              onClick={() => scroll(desktopRef, 'left')}
              disabled={!desktopScroll.left}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border shadow-lg flex items-center justify-center transition-all duration-300 ${
                desktopScroll.left
                  ? 'border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white cursor-pointer opacity-100'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-0 pointer-events-none'
              } group-hover/slider:opacity-100`}
              aria-label="Scroll Left"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll(desktopRef, 'right')}
              disabled={!desktopScroll.right}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 rounded-full bg-white/95 backdrop-blur-sm border shadow-lg flex items-center justify-center transition-all duration-300 ${
                desktopScroll.right
                  ? 'border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white cursor-pointer opacity-100'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-0 pointer-events-none'
              } group-hover/slider:opacity-100`}
              aria-label="Scroll Right"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Mobile/Tablet Slider (Visible under lg) */}
      <div className="block lg:hidden relative group/slider w-full">
        <div
          ref={mobileRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {mobileColumns.map((column, colIndex) => (
            <div
              key={colIndex}
              className="w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] flex-shrink-0 snap-start flex flex-col gap-4"
            >
              {column.map((course, index) => (
                <div key={course._id || index} className="flex-1 flex flex-col h-full">
                  <CourseCard course={course} />
                </div>
              ))}
              {column.length === 1 && (
                <div className="flex-1 flex flex-col h-full invisible pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {mobileColumns.length > 2 && (
          <>
            <button
              onClick={() => scroll(mobileRef, 'left')}
              disabled={!mobileScroll.left}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border shadow-md flex items-center justify-center transition-all duration-300 ${
                mobileScroll.left
                  ? 'border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white cursor-pointer opacity-100'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll Left"
            >
              <FaChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scroll(mobileRef, 'right')}
              disabled={!mobileScroll.right}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border shadow-md flex items-center justify-center transition-all duration-300 ${
                mobileScroll.right
                  ? 'border-teal-500 text-teal-600 hover:bg-teal-600 hover:text-white cursor-pointer opacity-100'
                  : 'border-gray-200 text-gray-300 cursor-not-allowed opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll Right"
            >
              <FaChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>
    </>
  );
};

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
            <CourseSlider courses={caCourses} />
          </div>
        )}

        {/* CMA Courses Section */}
        {!error && cmaCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 pb-2 border-b border-purple-500/20 flex items-center gap-2">
              <span className="bg-purple-600 w-2.5 h-6 rounded-full"></span>
              CMA Classes
            </h2>
            <CourseSlider courses={cmaCourses} />
          </div>
        )}

        {/* Other Courses Section */}
        {!error && otherCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 pb-2 border-b border-blue-500/20 flex items-center gap-2">
              <span className="bg-blue-600 w-2.5 h-6 rounded-full"></span>
              Other Classes
            </h2>
            <CourseSlider courses={otherCourses} />
          </div>
        )}
      </main>
    </div>
  );
}
