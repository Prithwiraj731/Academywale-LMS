import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api';
import { getCourseImageUrl } from '../../utils/imageUtils';

const institutes = [
  { name: 'Avinash Lala Classes', img: '/institutes/avinash_lala_classes.jpg' },
  { name: 'Bishnu Kedia Classes', img: '/institutes/bishnu_kedia_classes.png' },
  { name: 'COC Education', img: '/institutes/coc_education.png' },
  { name: 'CA Praveen Jindal', img: '/institutes/ca_praveen_jindal.png' },
  { name: 'Siddharth Agarrwal Classes', img: '/institutes/siddharth_agarrwal_classes.jpg' },
  { name: 'Navin Classes', img: '/institutes/navin_classes.jpg' },
  { name: 'Harshad Jaju Classes', img: '/institutes/harshad_jaju_classes.png' },
  { name: 'AADITYA JAIN CLASSES', img: '/institutes/aaditya_jain_classes.png' },
  { name: 'Yashwant Mangal Classes', img: '/institutes/yashwant_mangal_classes.avif' },
  { name: 'Nitin Guru Classes', img: '/institutes/nitin_guru_classes.png' },
  { name: 'Ekatvam', img: '/institutes/ekatvam.png' },
  { name: 'Shivangi Agarwal', img: '/institutes/shivangi_agarwal.png' },
  { name: 'Ranjan Periwal Classes', img: '/institutes/ranjan_periwal_classes.jpg' },
];

const CourseCardSkeleton = () => (
  <div className="w-72 xs:w-80 h-[380px] bg-white rounded-3xl border border-neutral-100 p-4 flex flex-col justify-between animate-pulse flex-shrink-0">
    <div>
      <div className="w-full aspect-[16/9] bg-neutral-200 rounded-2xl" />
      <div className="h-4 bg-neutral-200 rounded-full w-2/3 mt-4" />
      <div className="h-6 bg-neutral-200 rounded-full w-full mt-3" />
      <div className="h-4 bg-neutral-200 rounded-full w-1/2 mt-2" />
    </div>
    <div className="flex items-center justify-between mt-4">
      <div className="h-6 bg-neutral-200 rounded-full w-1/3" />
      <div className="h-10 bg-neutral-200 rounded-xl w-1/2" />
    </div>
  </div>
);

const CourseCard = ({ course, navigate }) => {
  const posterUrl = course.posterUrl ? getCourseImageUrl(course) : null;
  const discountPercent = course.costPrice && course.sellingPrice && course.costPrice > course.sellingPrice
    ? Math.round(((course.costPrice - course.sellingPrice) / course.costPrice) * 100)
    : 0;

  return (
    <div 
      onClick={() => navigate(`/course-details/${encodeURIComponent(course.courseType || 'course')}/${course._id || course.id}`)}
      className="group w-72 xs:w-80 bg-white rounded-3xl border border-neutral-100 hover:border-teal-500/20 p-4 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex-shrink-0 select-none animate-fade-in"
    >
      <div>
        {/* Course Poster */}
        <div className="w-full aspect-[16/9] bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner flex items-center justify-center">
          {posterUrl ? (
            <img 
              src={posterUrl} 
              alt={course.subject} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-neutral-400">
              <span className="text-3xl">📚</span>
              <span className="text-xs font-semibold">No Poster Available</span>
            </div>
          )}
          
          {/* Course Type Badge */}
          {course.courseType && (
            <span className="absolute top-3 left-3 bg-[#20b2aa] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
              {course.courseType}
            </span>
          )}
        </div>

        {/* Course Subject & Details */}
        <h4 className="text-base font-bold text-gray-800 line-clamp-2 mt-4 leading-snug group-hover:text-[#20b2aa] transition-colors duration-300">
          {course.subject}
        </h4>
        
        {course.facultyName && (
          <p className="text-sm text-gray-500 font-semibold mt-1">
            by {course.facultyName}
          </p>
        )}

        {/* Additional Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 font-semibold">
          {course.noOfLecture && (
            <div className="flex items-center gap-1">
              <span>📹</span> {course.noOfLecture} Lectures
            </div>
          )}
          {course.videoLanguage && (
            <div className="flex items-center gap-1">
              <span>🗣️</span> {course.videoLanguage}
            </div>
          )}
        </div>
      </div>

      {/* Price & Action Button */}
      <div className="mt-5 flex items-center justify-between border-t border-neutral-50 pt-4 gap-4">
        {/* Price display */}
        <div className="flex flex-col">
          {discountPercent > 0 ? (
            <>
              <span className="text-xs font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-green-600">₹{course.sellingPrice}</span>
                <span className="bg-green-50 text-green-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-green-100">
                  {discountPercent}% OFF
                </span>
              </div>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-800">
              ₹{course.sellingPrice || course.costPrice || 'Free'}
            </span>
          )}
        </div>

        {/* Action Button */}
        <span className="bg-teal-50 group-hover:bg-[#20b2aa] text-[#20b2aa] group-hover:text-white font-extrabold py-2.5 px-4 rounded-xl text-xs transition-all duration-300 flex items-center gap-1">
          View Details <span>→</span>
        </span>
      </div>
    </div>
  );
};

const EmptyState = ({ selectedInst, navigate }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-neutral-100 p-8 sm:p-12 text-center max-w-xl mx-auto my-4 flex flex-col items-center select-none animate-fade-in">
    <div className="text-4xl mb-4">🏫</div>
    <h4 className="text-lg font-bold text-gray-800">Explore Courses Directly</h4>
    <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
      We couldn't load preview courses on the home page for {selectedInst.name}. You can view all their offerings on their dedicated page.
    </p>
    <button
      onClick={() => navigate(`/institutes/${encodeURIComponent(selectedInst.name.replace(/\s+/g, '_'))}`)}
      className="mt-6 bg-[#20b2aa] hover:bg-teal-600 text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm shadow-md hover:shadow-lg transition-all duration-300"
    >
      View Dedicated Page
    </button>
  </div>
);

export default function SearchBy() {
  const navigate = useNavigate();
  const [selectedInst, setSelectedInst] = useState(institutes[0]);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState('');
  
  const sliderRef = useRef(null);

  useEffect(() => {
    if (!selectedInst) return;
    
    async function fetchCourses() {
      setCoursesLoading(true);
      setCoursesError('');
      try {
        const slug = encodeURIComponent(selectedInst.name.replace(/\s+/g, '_'));
        const res = await fetch(`${API_URL}/api/institutes/${slug}`);
        const data = await res.json();
        if (res.ok) {
          setCourses(data.institute?.courses || []);
        } else {
          setCoursesError(data.message || 'Courses not found');
        }
      } catch (err) {
        setCoursesError('Error fetching courses');
      } finally {
        setCoursesLoading(false);
      }
    }
    fetchCourses();
  }, [selectedInst]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 xs:py-16 sm:py-20 section-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        
        {/* Heading Section */}
        <div className="text-center mb-10 sm:mb-14">
          <div 
            onClick={() => navigate('/institutes')}
            className="group inline-flex flex-col items-center cursor-pointer"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm font-heading">
              Search by <span className="text-[#20b2aa] group-hover:text-teal-600 transition-colors duration-300">Institutes</span>
            </h2>
            <div className="h-1 w-12 group-hover:w-full bg-[#20b2aa] transition-all duration-500 mt-2 rounded-full" />
          </div>
          <p className="text-gray-500 mt-3 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Access premium lectures and courses from the nation's leading coaching partners
          </p>
        </div>

        {/* Carousel Container with edge fades */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          {/* Edge Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#e0f7f4] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#f1f5f9] to-transparent z-10 pointer-events-none" />
          
          {/* Infinite Marquee Track */}
          <div className="flex animate-marquee py-2">
            {[...institutes, ...institutes, ...institutes].map((inst, index) => {
              const isSelected = selectedInst?.name === inst.name;
              return (
                <div
                  key={`${inst.name}-${index}`}
                  onClick={() => setSelectedInst(inst)}
                  className={`group flex flex-col items-center justify-between w-36 xs:w-40 sm:w-48 h-28 xs:h-32 sm:h-40 p-3 sm:p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex-shrink-0 mr-4 sm:mr-6 ${
                    isSelected 
                      ? 'bg-teal-50/40 border-teal-500 ring-2 ring-teal-500/20 shadow-md scale-105' 
                      : 'bg-white border-neutral-100/85 hover:border-teal-500/20 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Logo Wrapper */}
                  <div className="w-full flex-1 flex items-center justify-center overflow-hidden p-1">
                    <img
                      src={inst.img}
                      alt={inst.name}
                      className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  {/* Name Label */}
                  <span className={`w-full text-center text-xs sm:text-sm font-bold transition-colors duration-300 line-clamp-1 sm:line-clamp-2 mt-2 leading-tight px-1 ${
                    isSelected ? 'text-[#20b2aa]' : 'text-gray-700 group-hover:text-[#20b2aa]'
                  }`}>
                    {inst.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider line */}
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent my-10" />

        {/* Selected Institute Courses Slider */}
        {selectedInst && (
          <div className="mt-4 transition-all duration-500">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 px-2">
              <div className="text-center sm:text-left">
                <span className="text-xs font-extrabold text-[#20b2aa] uppercase tracking-widest bg-teal-50/50 px-3.5 py-1.5 rounded-full border border-teal-100/60 shadow-sm">
                  Active Institute Selection
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mt-3.5">
                  Courses Offered by <span className="text-[#20b2aa]">{selectedInst.name}</span>
                </h3>
              </div>
              
              {/* Dedicated Page Action Button */}
              <button
                onClick={() => navigate(`/institutes/${encodeURIComponent(selectedInst.name.replace(/\s+/g, '_'))}`)}
                className="group/btn flex items-center gap-2 bg-gradient-to-r from-[#20b2aa] to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-sm"
              >
                Go to Dedicated Page 
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            {/* Courses Slider Area */}
            {coursesLoading ? (
              <div className="flex overflow-x-auto scrollbar-hide gap-6 py-4 px-1">
                {[1, 2, 3].map((n) => (
                  <CourseCardSkeleton key={n} />
                ))}
              </div>
            ) : coursesError || courses.length === 0 ? (
              <EmptyState selectedInst={selectedInst} navigate={navigate} />
            ) : (
              <div className="relative group/slider w-full px-2">
                {/* Left Scroll Button */}
                <button
                  onClick={scrollLeft}
                  className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-lg border border-neutral-100 hover:border-neutral-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 opacity-0 group-hover/slider:opacity-100 focus:outline-none"
                >
                  <span className="text-lg font-bold">←</span>
                </button>

                {/* Right Scroll Button */}
                <button
                  onClick={scrollRight}
                  className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 bg-white/95 hover:bg-white text-gray-800 rounded-full shadow-lg border border-neutral-100 hover:border-neutral-200 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 opacity-0 group-hover/slider:opacity-100 focus:outline-none"
                >
                  <span className="text-lg font-bold">→</span>
                </button>

                {/* Scrollable Slider Track */}
                <div 
                  ref={sliderRef}
                  className="flex overflow-x-auto scrollbar-hide gap-6 py-4 scroll-smooth w-full px-1"
                >
                  {courses.map((course, idx) => (
                    <CourseCard 
                      key={`${course.id || course._id || idx}`}
                      course={course} 
                      navigate={navigate} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Inline styles for infinite scrolling & scrollbar hiding */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.3333%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 45s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </section>
  );
}