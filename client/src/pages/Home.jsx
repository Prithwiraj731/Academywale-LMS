import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Hero from '../components/home/Hero';
import Numbers from '../components/home/Numbers';
import SearchBy from '../components/home/SearchBy';
import Partners from '../components/home/Partners';
// Import the modern testimonial component
import ModernTestimonial from '../components/ui/modern-testimonial';
import WhatsAppButton from '../components/home/WhatsAppButton';
import { MorphyButton } from '../components/ui/morphy-button';

import Particles from '../components/common/Particles';
import { PinContainer } from '../components/ui/3d-pin';
import { useNavigate } from 'react-router-dom';
import { normalizeCoursesPricing } from '../utils/coursePricing';
import { FaGraduationCap, FaChevronRight, FaBookReader, FaAward } from 'react-icons/fa';
import CAClasses from '../components/home/CAClasses';
import CMAClasses from '../components/home/CMAClasses';
import sjcCert from '../assets/sjcCert.jpg';
import bisnuKediaCert from '../assets/bisnuKediaCert.jpeg';

import { API_URL } from '../api';

const certificates = [
  {
    id: 1,
    title: 'SJC Institute Authorized Partner',
    subtitle: 'Authorized Business Partner certifying outstanding contribution to quality education',
    image: sjcCert,
  },
  {
    id: 2,
    title: 'Bishnu Kedia Classes',
    subtitle: 'Official Authorization & Recognition Certificate for Excellence in Professional Coaching',
    image: bisnuKediaCert,
    badge: '★ Authorized Partner'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [topFaculties, setTopFaculties] = useState([]);
  const [exclusiveCourses, setExclusiveCourses] = useState([]);
  const [activePath, setActivePath] = useState(null);
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const carouselRef = useRef(null);

  const [isPaused, setIsPaused] = useState(false);

  // Auto slide certificates
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCertIndex((prev) => (prev + 1) % certificates.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 340; // card width + gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Autoplay auto-sliding/shuffling animation for exclusive courses (15 sec interval)
  useEffect(() => {
    if (exclusiveCourses.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setExclusiveCourses(prev => {
        const arr = [...prev];
        // 75% chance to cyclic-shift (making them slide left continuously)
        // 25% chance to randomly shuffle (magically swaps their order)
        if (Math.random() < 0.75) {
          const first = arr.shift();
          arr.push(first);
        } else {
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
        }
        return arr;
      });

      // Keep scroll position at 0 so all cards remain in the visible viewport
      if (carouselRef.current) {
        carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [exclusiveCourses.length, isPaused]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/courses/all?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  // Load faculties and exclusive courses on component mount
  useEffect(() => {
    async function loadHomepageFaculties() {
      try {
        const res = await fetch(`${API_URL}/api/faculties`);
        const data = await res.json();
        
        if (res.ok && Array.isArray(data.faculties)) {
          const dbFaculties = data.faculties;
          const mapped = dbFaculties.map(f => {
            const slug = f.slug || `${f.first_name || f.firstName || ''}-${f.last_name || f.lastName || ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const fullName = `${f.first_name || f.firstName || ''} ${f.last_name || f.lastName || ''}`.trim();
            const sequenceVal = f.mongo_id !== undefined && f.mongo_id !== null && String(f.mongo_id).trim() !== ''
              ? Number(f.mongo_id)
              : 999;
            return {
              id: f.id || f._id,
              name: fullName,
              slug: slug,
              image: f.image_url || f.imageUrl || '',
              specialization: (Array.isArray(f.teaches) ? f.teaches[0] : f.teaches) || '',
              bio: f.bio || '',
              sequence: sequenceVal
            };
          });

          mapped.sort((a, b) => (a.sequence - b.sequence));
          setTopFaculties(mapped.slice(0, 8));
        } else {
          setTopFaculties([]);
        }
      } catch (err) {
        console.error(err);
        setTopFaculties([]);
      }
    }

    const fetchExclusive = async () => {
      try {
        const res = await fetch(`${API_URL}/api/courses/exclusive?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            const normalized = normalizeCoursesPricing(data.courses);
            const shuffle = (array) => {
              const arr = [...array];
              for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
              }
              return arr;
            };
            setExclusiveCourses(shuffle(normalized));
          }
        }
      } catch (err) {
        console.error('Failed to load exclusive courses:', err);
      }
    };

    loadHomepageFaculties();
    fetchExclusive();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100 overflow-x-hidden">
      {/* Removed the first Particles component to restrict particles to dark background section only */}

      <Hero />
      <div className="h-2 xs:h-3 sm:h-4 md:h-8" />
      {/* Move Categories (Your Learning Journey) section to the top */}
      {/* Move Categories (Your Learning Journey) section to the top */}
      {/* Rearranged CA/CMA Path Buttons Section */}
      <div className="relative py-16 xs:py-20 md:py-24 flex justify-center items-center overflow-hidden text-white relative z-10 bg-slate-950 border-y border-neutral-850">
        <Particles
          particleColors={['#20b2aa', '#ffffff']}
          particleCount={100}
          particleSpread={15}
          speed={0.08}
          particleBaseSize={50}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
          className="absolute top-0 left-0 w-full h-full z-0"
        />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 flex flex-col items-center">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-white whitespace-nowrap">
              Choose Your Learning Path
            </h2>
            <p className="hidden sm:block text-neutral-400 mt-4 text-base sm:text-lg max-w-2xl mx-auto">
              Select your course level and access premium video lectures, notes, and preparation resources tailored for CA & CMA excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full text-left items-start">
            {/* Left Column: Search & Quick Actions */}
            <div className="flex flex-col justify-start items-center md:items-start bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 p-6 sm:p-8 rounded-3xl shadow-xl w-full min-h-[360px]">
              <span className="text-xs font-bold tracking-widest text-[#20b2aa] uppercase bg-teal-500/10 px-3 py-1 rounded-full border border-[#20b2aa]/20 mb-4">
                Quick Search
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 text-center md:text-left font-heading">
                Find Your Specific Course
              </h3>
              <p className="text-neutral-400 text-sm mb-6 max-w-sm text-center md:text-left">
                Type subjects, papers, or faculty names to search instantly, or browse our entire catalog of classes.
              </p>
              
              <form onSubmit={handleSearchSubmit} className="w-full max-w-md mb-6 flex items-center bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-1.5 px-3 shadow-lg focus-within:border-[#20b2aa]/70 transition-all hover:bg-white/15">
                <input
                  type="text"
                  placeholder="Search courses, subjects or faculty"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full bg-transparent text-white px-3 py-2 text-sm focus:outline-none placeholder-gray-400 font-medium"
                />
                <button
                  type="submit"
                  className="bg-[#20b2aa] hover:bg-[#1a9690] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
                >
                  <span>🔍</span>
                  <span>Search</span>
                </button>
              </form>
              <div className="w-full mt-auto pt-6 flex justify-center md:justify-start">
                <MorphyButton
                  onClick={() => navigate('/courses/all')}
                  size="lg"
                  className="shadow-xl hover:shadow-2xl font-extrabold"
                >
                  🎓 Browse All Courses
                </MorphyButton>
              </div>
            </div>

            {/* Right Column: Choose Learning Path */}
            <div className="flex flex-col justify-start items-center md:items-start bg-neutral-900/40 backdrop-blur-md border border-neutral-800/80 p-6 sm:p-8 rounded-3xl shadow-xl w-full min-h-[380px]">
              <div className="w-full max-w-md flex flex-col items-center md:items-start">
                <span className="text-xs font-bold tracking-widest text-[#20b2aa] uppercase bg-teal-500/10 px-3 py-1 rounded-full border border-[#20b2aa]/20 mb-4">
                  EXPLORE COURSES
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-6 text-center md:text-left font-heading">
                  Choose Your Course
                </h3>

                {/* Tab Selector Buttons */}
                <div className="inline-flex bg-neutral-950 border border-neutral-850 rounded-2xl p-1.5 shadow-xl mb-6">
                  <button
                    onClick={() => setActivePath(activePath === 'ca' ? null : 'ca')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-extrabold tracking-wider transition-all duration-300 cursor-pointer ${
                      activePath === 'ca'
                        ? 'bg-[#20b2aa] text-white shadow-lg shadow-[#20b2aa]/20'
                        : 'text-neutral-400 hover:text-white bg-transparent'
                    }`}
                  >
                    CA
                  </button>
                  <button
                    onClick={() => setActivePath(activePath === 'cma' ? null : 'cma')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-extrabold tracking-wider transition-all duration-300 cursor-pointer ${
                      activePath === 'cma'
                        ? 'bg-[#20b2aa] text-white shadow-lg shadow-[#20b2aa]/20'
                        : 'text-neutral-400 hover:text-white bg-transparent'
                    }`}
                  >
                    CMA
                  </button>
                </div>

                {/* Animated Options Container */}
                <div className="w-full">
                  <AnimatePresence mode="wait">
                    {activePath === 'ca' && (
                      <motion.div
                        key="ca-options"
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden space-y-4 pb-2 w-full"
                      >
                        <button
                          onClick={() => navigate('/ca/foundation-papers')}
                          className="group/btn w-full py-4 px-5 rounded-2xl bg-neutral-950 hover:bg-[#20b2aa] border border-neutral-850 hover:border-[#20b2aa]/40 text-left font-bold flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-white group-hover/btn:text-[#20b2aa] transition-colors shrink-0">
                              <FaBookReader className="text-lg" />
                            </div>
                            <span className="text-neutral-200 group-hover/btn:text-white text-base font-extrabold tracking-tight">CA Foundation</span>
                          </div>
                          <FaChevronRight className="text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all text-sm shrink-0" />
                        </button>

                        <button
                          onClick={() => navigate('/ca/inter-papers')}
                          className="group/btn w-full py-4 px-5 rounded-2xl bg-neutral-950 hover:bg-[#20b2aa] border border-neutral-850 hover:border-[#20b2aa]/40 text-left font-bold flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-white group-hover/btn:text-[#20b2aa] transition-colors shrink-0">
                              <FaGraduationCap className="text-lg" />
                            </div>
                            <span className="text-neutral-200 group-hover/btn:text-white text-base font-extrabold tracking-tight">CA Intermediate</span>
                          </div>
                          <FaChevronRight className="text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all text-sm shrink-0" />
                        </button>

                        <button
                          onClick={() => navigate('/ca/final-papers')}
                          className="group/btn w-full py-4 px-5 rounded-2xl bg-neutral-950 hover:bg-[#20b2aa] border border-neutral-850 hover:border-[#20b2aa]/40 text-left font-bold flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-white group-hover/btn:text-[#20b2aa] transition-colors shrink-0">
                              <FaAward className="text-lg" />
                            </div>
                            <span className="text-neutral-200 group-hover/btn:text-white text-base font-extrabold tracking-tight">CA Final</span>
                          </div>
                          <FaChevronRight className="text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all text-sm shrink-0" />
                        </button>
                      </motion.div>
                    )}

                    {activePath === 'cma' && (
                      <motion.div
                        key="cma-options"
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden space-y-4 pb-2 w-full"
                      >
                        <button
                          onClick={() => navigate('/cma/foundation-papers')}
                          className="group/btn w-full py-4 px-5 rounded-2xl bg-neutral-955 hover:bg-[#20b2aa] border border-neutral-850 hover:border-[#20b2aa]/40 text-left font-bold flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-white group-hover/btn:text-[#20b2aa] transition-colors shrink-0">
                              <FaBookReader className="text-lg" />
                            </div>
                            <span className="text-neutral-200 group-hover/btn:text-white text-base font-extrabold tracking-tight">CMA Foundation</span>
                          </div>
                          <FaChevronRight className="text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all text-sm shrink-0" />
                        </button>

                        <button
                          onClick={() => navigate('/cma/inter-papers')}
                          className="group/btn w-full py-4 px-5 rounded-2xl bg-neutral-955 hover:bg-[#20b2aa] border border-neutral-850 hover:border-[#20b2aa]/40 text-left font-bold flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-white group-hover/btn:text-[#20b2aa] transition-colors shrink-0">
                              <FaGraduationCap className="text-lg" />
                            </div>
                            <span className="text-neutral-200 group-hover/btn:text-white text-base font-extrabold tracking-tight">CMA Intermediate</span>
                          </div>
                          <FaChevronRight className="text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all text-sm shrink-0" />
                        </button>

                        <button
                          onClick={() => navigate('/cma/final-papers')}
                          className="group/btn w-full py-4 px-5 rounded-2xl bg-neutral-955 hover:bg-[#20b2aa] border border-neutral-850 hover:border-[#20b2aa]/40 text-left font-bold flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/10 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-white group-hover/btn:text-[#20b2aa] transition-colors shrink-0">
                              <FaAward className="text-lg" />
                            </div>
                            <span className="text-neutral-200 group-hover/btn:text-white text-base font-extrabold tracking-tight">CMA Final</span>
                          </div>
                          <FaChevronRight className="text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all text-sm shrink-0" />
                        </button>
                      </motion.div>
                    )}
                    
                    {activePath === null && (
                      <motion.div
                        key="no-path"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-neutral-500 text-xs font-semibold py-8 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-950/20 w-full"
                      >
                        💡 Select CA or CMA above to view levels
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End rearranged section */}
      {/* Exclusive Courses Carousel Section */}
      {exclusiveCourses.length > 0 && (
        <section className="py-12 xs:py-16 sm:py-20 bg-slate-50 text-slate-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Header with Navigation Arrows */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="inline-block text-xs sm:text-sm font-bold tracking-widest text-[#20b2aa] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  Premium Selection
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 font-heading tracking-tight leading-tight text-slate-900">
                  Exclusive <span className="text-[#20b2aa]">Courses</span>
                </h2>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2 self-start sm:self-end">
                <button 
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-[#20b2aa] hover:border-[#20b2aa] hover:shadow-md active:bg-slate-50 transition-all duration-200 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-[#20b2aa] hover:border-[#20b2aa] hover:shadow-md active:bg-slate-50 transition-all duration-200 cursor-pointer"
                  aria-label="Next slide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Carousel track */}
            <div 
              ref={carouselRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => {
                setTimeout(() => setIsPaused(false), 3000);
              }}
              className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide scroll-smooth px-1"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {exclusiveCourses.map((course) => {
                const firstMode = course.modeAttemptPricing?.[0] || {};
                const firstAttempt = firstMode.attempts?.[0] || {};
                const originalPrice = firstAttempt.costPrice || course.costPrice || 0;
                const sellingPrice = firstAttempt.sellingPrice || course.sellingPrice || 0;
                
                return (
                  <motion.div 
                    layout
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 22,
                      mass: 1.2
                    }}
                    key={course.id || course._id}
                    onClick={() => navigate(`/course/${encodeURIComponent(course.courseType || 'general')}/${course.id || course._id}`)}
                    className="flex-shrink-0 w-[260px] xs:w-[300px] bg-white rounded-2xl border border-slate-200/60 p-4 hover:border-[#20b2aa]/40 hover:shadow-[0_10px_30px_rgba(32,178,170,0.08)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-sm flex flex-col justify-between group"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div>
                      {/* Image container */}
                      <div className="w-full aspect-square rounded-xl overflow-hidden relative mb-4 bg-white border border-slate-100 flex items-center justify-center">
                        <img 
                          src={course.posterUrl || '/placeholder.png'} 
                          alt={course.title || course.subject}
                          className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 right-2.5 bg-rose-500 text-white text-[9px] font-bold tracking-wider px-2 py-0.5 rounded shadow-sm uppercase">
                          Exclusive
                        </span>
                      </div>

                      {/* Details */}
                      <span className="text-[10px] font-extrabold text-[#20b2aa] tracking-widest uppercase">
                        {course.category} {course.subcategory}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-1 line-clamp-2 leading-snug group-hover:text-[#20b2aa] transition-colors duration-200">
                        {course.title || course.subject}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-semibold">
                        By {course.facultyName || 'Expert Faculty'}
                      </p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                      <div>
                        {originalPrice > sellingPrice && (
                          <span className="text-xs text-slate-400 line-through mr-1.5 font-medium">
                            ₹{Number(originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-base sm:text-lg font-extrabold text-slate-900">
                          ₹{Number(sellingPrice).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#20b2aa] group-hover:text-[#1a9690] flex items-center gap-0.5 transition-colors duration-150">
                        View Details →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Restore Meet Our Expert Faculties section */}
      <section className="flex-1 py-8 xs:py-10 sm:py-12 md:py-14 px-2 xs:px-3 sm:px-4 section-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 xs:mb-8 sm:mb-10">
            <div 
              onClick={() => navigate('/faculties')}
              className="group inline-flex flex-col items-center cursor-pointer"
            >
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm font-heading">
                Meet Our <span className="text-[#20b2aa] group-hover:text-teal-600 transition-colors duration-300">Expert Faculties</span>
              </h2>
              <div className="h-1 w-12 group-hover:w-full bg-[#20b2aa] transition-all duration-500 mt-2 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {topFaculties.map(faculty => {
              return (
                <PinContainer
                  key={faculty.id}
                  title={faculty.name}
                  href={`/faculties/${faculty.slug}`}
                  containerClassName="w-full h-full min-w-[120px] xs:min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] xs:max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] min-h-[160px] xs:min-h-[180px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[300px] max-h-[180px] xs:max-h-[200px] sm:max-h-[220px] md:max-h-[260px] lg:max-h-[320px] mx-auto"
                >
                  <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-2 xs:p-3 sm:p-4 md:p-5 lg:p-8 cursor-pointer hover:scale-105 w-full h-full">
                    <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 mb-1 xs:mb-2 sm:mb-3 md:mb-4 rounded-full overflow-hidden border-2 xs:border-3 sm:border-4 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:border-blue-400 transition-colors duration-300">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-bold text-gray-700" style={{ display: 'none' }}>
                        {faculty.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-xs xs:text-sm sm:text-base md:text-base font-semibold text-black text-center leading-tight group-hover:text-blue-600 transition-colors duration-300 px-1">
                      {faculty.name}
                    </div>
                  </div>
                </PinContainer>
              );
            })}
          </div>
          <div className="flex justify-center mt-6 xs:mt-7 sm:mt-8">
            <MorphyButton
              onClick={() => navigate('/faculties')}
              size="lg"
              className="shadow-xl hover:shadow-2xl font-extrabold tracking-wide"
            >
              Browse All Faculty
            </MorphyButton>
          </div>
        </div>
      </section>
      <SearchBy />
      {/* Insert banner3.png here */}
          {/* <div className="my-0 w-full max-w-full overflow-hidden">
            <img
              src={banner3}
              alt="Banner"
              className="w-full h-auto object-cover"
            />
          </div> */}
      {/* <Partners /> */}
      <Numbers />
      
      {/* Recognized & Accredited Institutions Section (3D Stacked Carousel) */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#20b2aa]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Dot pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Synchronized Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="group inline-flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm font-heading">
                Our Recognitions & <span className="text-[#20b2aa] group-hover:text-teal-600 transition-colors duration-300">Accreditations</span>
              </h2>
              <div className="h-1 w-16 group-hover:w-full bg-[#20b2aa] transition-all duration-500 mt-2 rounded-full" />
            </div>
            <p className="text-gray-600 mt-4 text-base sm:text-lg max-w-2xl mx-auto px-4 font-medium">
              Officially recognized and accredited partner certifying our commitment to excellence in CA & CMA education
            </p>
          </div>

          {/* 3D Stacked Certificate Carousel Container */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-3xl min-h-[380px] sm:min-h-[480px] flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                {certificates.map((cert, index) => {
                  const isCurrent = index === activeCertIndex;
                  const isNext = (index === (activeCertIndex + 1) % certificates.length);

                  return (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, scale: 0.8, y: 30 }}
                      animate={{
                        opacity: isCurrent ? 1 : (isNext ? 0.6 : 0.2),
                        scale: isCurrent ? 1 : (isNext ? 0.92 : 0.84),
                        y: isCurrent ? 0 : (isNext ? -20 : -40),
                        rotate: isCurrent ? 0 : (isNext ? -3 : 3),
                        zIndex: isCurrent ? 30 : (isNext ? 20 : 10)
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -40 }}
                      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                      onClick={() => setActiveCertIndex(index)}
                      className={`absolute w-full p-3 sm:p-5 bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl border ${
                        isCurrent ? 'border-[#20b2aa]/40 shadow-[0_25px_60px_-15px_rgba(32,178,170,0.3)]' : 'border-gray-200/80 shadow-md cursor-pointer'
                      }`}
                    >
                      {/* Golden Ribbon Badge */}
                      <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-40 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white font-extrabold py-1.5 px-3.5 sm:py-2 sm:px-4 rounded-xl shadow-lg border border-amber-300 text-xs tracking-wider uppercase rotate-3 flex items-center gap-1 select-none">
                        {cert.badge}
                      </div>

                      {/* Certificate Image Frame */}
                      <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gray-950 border border-gray-200 shadow-inner">
                        <img 
                          src={cert.image}
                          alt={cert.title} 
                          className="w-full h-auto max-h-[420px] object-contain transition-all duration-500"
                        />
                      </div>

                      {/* Certificate Title Footer */}
                      <div className="mt-3 text-center">
                        <h4 className="text-base sm:text-lg font-bold text-gray-900">{cert.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">{cert.subtitle}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Carousel Navigation & Indicators */}
            <div className="mt-8 flex items-center gap-4 z-30">
              <button
                type="button"
                onClick={() => setActiveCertIndex((prev) => (prev - 1 + certificates.length) % certificates.length)}
                className="w-10 h-10 rounded-full bg-white hover:bg-teal-50 border border-gray-200 text-gray-700 hover:text-teal-600 flex items-center justify-center font-bold transition-all shadow-md cursor-pointer"
                title="Previous Certificate"
              >
                ‹
              </button>

              <div className="flex items-center gap-2">
                {certificates.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveCertIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeCertIndex ? 'w-8 bg-[#20b2aa]' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveCertIndex((prev) => (prev + 1) % certificates.length)}
                className="w-10 h-10 rounded-full bg-white hover:bg-teal-50 border border-gray-200 text-gray-700 hover:text-teal-600 flex items-center justify-center font-bold transition-all shadow-md cursor-pointer"
                title="Next Certificate"
              >
                ›
              </button>
            </div>

            {/* Verification Tag */}
            <div className="mt-6 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-200/60 shadow-xs text-xs sm:text-sm text-gray-600 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Authorization by SJC Institute & Bishnu Kedia Classes</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modern Testimonial component */}
      <ModernTestimonial 
        title="See What Teachers & Students Say"
        subtitle="Feedback from our community of learners and educators"
      />
      <WhatsAppButton />

    </div>
  );
}