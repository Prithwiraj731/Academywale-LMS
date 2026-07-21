import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import { API_URL } from '../api';

// Horizontal slider/carousel for displaying course cards professionally with auto-slide & 2-card mobile view
const CourseSlider = ({ courses, title }) => {
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);
  const [desktopScroll, setDesktopScroll] = useState({ left: false, right: true });
  const [mobileScroll, setMobileScroll] = useState({ left: false, right: true });
  const isInteractingRef = useRef(false);

  const checkScroll = (ref, setScroll) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScroll({
        left: scrollLeft > 5,
        right: scrollLeft + clientWidth < scrollWidth - 5
      });
    }
  };

  // Auto-slide effect for mobile & desktop
  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      if (isInteractingRef.current) return;

      // Auto-slide mobile view (2 cards visible per row)
      if (mobileRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = mobileRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          mobileRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = clientWidth * 0.5; // Slide 1 card step
          mobileRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }

      // Auto-slide desktop view
      if (desktopRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = desktopRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          desktopRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          desktopRef.current.scrollBy({ left: clientWidth * 0.5, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(autoSlideInterval);
  }, []);

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

  const handleTouchStart = () => {
    isInteractingRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 3000);
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      isInteractingRef.current = true;
      const { clientWidth } = ref.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      ref.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isInteractingRef.current = false;
      }, 3000);
    }
  };

  if (!courses || courses.length === 0) return null;

  return (
    <>
      {/* Desktop Slider (Visible on lg and up) */}
      <div className="hidden lg:block relative group/slider w-full">
        <div
          ref={desktopRef}
          onMouseEnter={handleTouchStart}
          onMouseLeave={handleTouchEnd}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {courses.map((course, index) => (
            <div
              key={course._id || course.id || index}
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

      {/* Mobile & Tablet 2-Card View Slider (Visible under lg) */}
      <div className="block lg:hidden relative group/slider w-full">
        <div
          ref={mobileRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {courses.map((course, index) => (
            <div
              key={course._id || course.id || index}
              className="w-[calc(50%-6px)] flex-shrink-0 snap-start flex flex-col"
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {courses.length > 2 && (
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

  // Helper to accurately classify courses into strict sequence categories
  const getCourseCategoryKey = (course) => {
    const type = (course.courseType || course.course_type || course.title || course.subject || '').toUpperCase();
    const cat = (course.category || '').toUpperCase();

    const isCA = cat === 'CA' || type.includes('CA ') || type.startsWith('CA-') || type.startsWith('CA ');
    const isCMA = cat === 'CMA' || type.includes('CMA ') || type.startsWith('CMA-') || type.startsWith('CMA ');
    const isFinal = type.includes('FINAL');
    const isInter = type.includes('INTER') || type.includes('INTERMEDIATE');

    if (isCA && isInter) return 'CA_INTER';
    if (isCMA && isInter) return 'CMA_INTER';
    if (isCA && isFinal) return 'CA_FINAL';
    if (isCMA && isFinal) return 'CMA_FINAL';

    // Fallbacks based on category if courseType string isn't detailed
    if (cat === 'CA') {
      return isFinal ? 'CA_FINAL' : 'CA_INTER';
    }
    if (cat === 'CMA') {
      return isFinal ? 'CMA_FINAL' : 'CMA_INTER';
    }

    return 'OTHER';
  };

  const sortBySequence = (a, b) => {
    const orderA = a.displayOrder !== undefined && a.displayOrder !== null ? Number(a.displayOrder) : (a.display_order !== undefined && a.display_order !== null ? Number(a.display_order) : 9999);
    const orderB = b.displayOrder !== undefined && b.displayOrder !== null ? Number(b.displayOrder) : (b.display_order !== undefined && b.display_order !== null ? Number(b.display_order) : 9999);
    if (orderA !== orderB) return orderA - orderB;
    const paperA = Number(a.paperId || a.paper_id || 999);
    const paperB = Number(b.paperId || b.paper_id || 999);
    if (paperA !== paperB) return paperA - paperB;
    return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
  };

  const caInterCourses = courses.filter(c => getCourseCategoryKey(c) === 'CA_INTER').sort(sortBySequence);
  const cmaInterCourses = courses.filter(c => getCourseCategoryKey(c) === 'CMA_INTER').sort(sortBySequence);
  const caFinalCourses = courses.filter(c => getCourseCategoryKey(c) === 'CA_FINAL').sort(sortBySequence);
  const cmaFinalCourses = courses.filter(c => getCourseCategoryKey(c) === 'CMA_FINAL').sort(sortBySequence);
  const otherCourses = courses.filter(c => !['CA_INTER', 'CMA_INTER', 'CA_FINAL', 'CMA_FINAL'].includes(getCourseCategoryKey(c))).sort(sortBySequence);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fffde7]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-blue-600 font-bold">Loading courses...</p>
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
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Available Courses</h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2 font-medium">Browse through our CA & CMA course catalog</p>
          <div className="mt-2">
            <span className="inline-block bg-teal-50 border border-teal-200 text-teal-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-sm">
              {courses.length} Courses Available
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg font-bold">{error}</div>
          </div>
        )}

        {/* Empty State */}
        {!error && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No courses found.</div>
          </div>
        )}

        {/* 1. CA Inter Section */}
        {!error && caInterCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 pb-2 border-b border-teal-500/30 flex items-center gap-2">
              <span className="bg-teal-600 w-3 h-6 rounded-full"></span>
              CA Inter Classes
            </h2>
            <CourseSlider courses={caInterCourses} title="CA Inter" />
          </div>
        )}

        {/* 2. CMA Inter Section */}
        {!error && cmaInterCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 pb-2 border-b border-purple-500/30 flex items-center gap-2">
              <span className="bg-purple-600 w-3 h-6 rounded-full"></span>
              CMA Inter Classes
            </h2>
            <CourseSlider courses={cmaInterCourses} title="CMA Inter" />
          </div>
        )}

        {/* 3. CA Final Section */}
        {!error && caFinalCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 pb-2 border-b border-[#20b2aa]/30 flex items-center gap-2">
              <span className="bg-[#20b2aa] w-3 h-6 rounded-full"></span>
              CA Final Classes
            </h2>
            <CourseSlider courses={caFinalCourses} title="CA Final" />
          </div>
        )}

        {/* 4. CMA Final Section */}
        {!error && cmaFinalCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 pb-2 border-b border-indigo-500/30 flex items-center gap-2">
              <span className="bg-indigo-600 w-3 h-6 rounded-full"></span>
              CMA Final Classes
            </h2>
            <CourseSlider courses={cmaFinalCourses} title="CMA Final" />
          </div>
        )}

        {/* 5. Other Classes Section */}
        {!error && otherCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-6 pb-2 border-b border-blue-500/30 flex items-center gap-2">
              <span className="bg-blue-600 w-3 h-6 rounded-full"></span>
              Other Classes
            </h2>
            <CourseSlider courses={otherCourses} title="Other Classes" />
          </div>
        )}
      </main>
    </div>
  );
}
