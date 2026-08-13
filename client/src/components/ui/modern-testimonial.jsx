import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../../api";
import { getTestimonialImageUrl } from "../../utils/imageUtils";

// Custom animation styles with zero gap on mobile to prevent cumulative slide offset
const styles = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .testimonial-section {
    padding: 0 1rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  .testimonial-container {
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  
  .testimonial-slider {
    display: flex;
    transition: transform 0.4s ease-out;
    width: 100%;
    gap: 0;
  }
  
  .testimonial-slide {
    min-width: 100%;
    width: 100%;
    padding: 0 0.5rem;
    box-sizing: border-box;
    flex-shrink: 0;
  }
  
  @media (min-width: 640px) {
    .testimonial-section {
      padding: 0 1.5rem;
    }
  }
  
  @media (min-width: 768px) {
    .testimonial-slider {
      gap: 1.25rem;
    }
    
    .testimonial-slide {
      min-width: calc(50% - 0.625rem);
      width: calc(50% - 0.625rem);
      padding: 0;
    }
  }
  
  @media (min-width: 1024px) {
    .testimonial-slider {
      gap: 1.5rem;
    }
    
    .testimonial-slide {
      min-width: calc(33.333% - 1rem);
      width: calc(33.333% - 1rem);
    }
  }
`;

// Import testimonial images
import testimonial1 from "../../assets/testimonial/1.jpeg";
import testimonial2 from "../../assets/testimonial/2.jpg";
import testimonial3 from "../../assets/testimonial/3.jpg";
import testimonial4 from "../../assets/testimonial/4.jpg";
import testimonial5 from "../../assets/testimonial/5.jpg";
import testimonial6 from "../../assets/testimonial/6.jpg";

const testimonials = [
  {
    id: 1,
    name: "Gourav Pathak",
    role: "CMA Final Student",
    review: "AcademyWale made my CA/CMA journey so much smoother! I was able to purchase top faculty courses at discounted prices, with flexible validity and instant access. The support team is very responsive, and the whole process is super easy. Highly recommended for every CA/CMA aspirant looking for quality classes at affordable rates!",
    avatar: testimonial1,
    handle: "@gourav_pathak",
  },
  {
    id: 2,
    name: "Muskan",
    role: "CMA Final Student",
    review: "AcademyWale really understands student needs. I was able to choose the best faculty for my CMA Final subjects with proper guidance. The purchase process was simple, and the team was always ready to help. Highly recommended!",
    avatar: testimonial2,
    handle: "@muskan",
  },
  {
    id: 3,
    name: "Sankalp Gupta",
    role: "CMA Final Student",
    review: "AcademyWale is a game-changer for CA & CMA students! I got my favourite faculty's classes at unbeatable prices. The buying process was seamless, and the delivery was instant. No more browsing multiple sites—AcademyWale has it all in one place!",
    avatar: testimonial3,
    handle: "@sankalp_gupta",
  },
  {
    id: 4,
    name: "Afreen Malika",
    role: "CMA Final Student",
    review: "If you're preparing for CA or CMA, AcademyWale is the best place to buy your classes. Affordable prices, multiple options, and quick support—everything a student needs. I highly recommend it to all aspirants.",
    avatar: testimonial4,
    handle: "@afreen_malika",
  },
  {
    id: 5,
    name: "Kirti Somani",
    role: "CA Student",
    review: "I was a bit unsure at first, but AcademyWale turned out to be the best decision. The support team is responsive, and the quality of study material is excellent. I cracked my exams with their help!",
    avatar: testimonial5,
    handle: "@kirti_somani",
  },
  {
    id: 6,
    name: "Yash Agarwal",
    role: "CA Aspirant",
    review: "AcademyWale has truly transformed my preparation journey. The quality of lectures and timely support helped me stay consistent and focused. Highly recommended for all CA/CMA/CS aspirants looking for genuine and affordable resources!",
    avatar: testimonial6,
    handle: "@yash_agarwal",
  },
];

export default function ModernTestimonial({ 
  title = "See What Teachers & Students Say",
  subtitle = "Feedback from our community of learners and educators"
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [testimonialList, setTestimonialList] = useState(testimonials);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);

  // Fetch live testimonials from database
  useEffect(() => {
    let isMounted = true;
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
          const filtered = data.testimonials.filter(t => t.name !== '__COUPON_METADATA__');
          const formatted = filtered.map((t, idx) => ({
            id: t.id || t._id || (idx + 1),
            name: t.name,
            role: t.role || t.designation || t.course || 'Student',
            review: t.review || t.text || t.message,
            avatar: getTestimonialImageUrl(t),
            handle: `@${t.name.toLowerCase().replace(/\s+/g, '_')}`
          }));
          setTestimonialList(formatted);
        }
      })
      .catch(err => {
        console.warn('Failed to fetch dynamic testimonials, using default fallback:', err);
      });
    return () => { isMounted = false; };
  }, []);

  // Touch gesture state for mobile swiping
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Determine how many cards to show based on screen width
  let cardsToShow = 1;
  if (windowWidth >= 768) cardsToShow = 2;
  if (windowWidth >= 1024) cardsToShow = 3;
  
  const totalSlides = testimonialList.length;
  const maxIndex = Math.max(0, totalSlides - cardsToShow);
  
  // Handle slider movement with pixel/percentage accuracy
  const moveSlider = (index) => {
    const clampedIndex = Math.min(Math.max(0, index), maxIndex);
    setActiveIndex(clampedIndex);
    if (sliderRef.current) {
      if (windowWidth < 768) {
        sliderRef.current.style.transform = `translateX(-${clampedIndex * 100}%)`;
      } else {
        const gapPx = windowWidth >= 1024 ? 24 : 20;
        const containerWidth = sliderRef.current.parentElement ? sliderRef.current.parentElement.offsetWidth : 0;
        const cardWidth = (containerWidth - (gapPx * (cardsToShow - 1))) / cardsToShow;
        const shiftPx = clampedIndex * (cardWidth + gapPx);
        sliderRef.current.style.transform = `translateX(-${shiftPx}px)`;
      }
    }
  };

  useEffect(() => {
    moveSlider(activeIndex);
  }, [windowWidth, activeIndex, testimonialList]);
  
  // Touch swipe event handlers
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;
    
    if (distance > minSwipeDistance) {
      // Swiped left -> next
      const nextIndex = activeIndex >= maxIndex ? 0 : activeIndex + 1;
      moveSlider(nextIndex);
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev
      const prevIndex = activeIndex === 0 ? maxIndex : activeIndex - 1;
      moveSlider(prevIndex);
    }
  };
  
  // Auto slide functionality
  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        moveSlider(next);
        return next;
      });
    }, 4500);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, maxIndex, windowWidth, testimonialList]);
  
  return (
    <section className="py-16 bg-neutral-950 text-white relative overflow-hidden testimonial-section">
      <style>{styles}</style>
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#20b2aa]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#20b2aa]/10 border border-[#20b2aa]/30 text-[#20b2aa] text-xs font-semibold uppercase tracking-wider mb-4">
            <span>Student & Teacher Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg font-normal max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="testimonial-container">
          <div 
            ref={sliderRef}
            className="testimonial-slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonialList.map((testimonial) => (
              <div className="testimonial-slide" key={`testimonial-${testimonial.id}`}>
                <TestimonialCard 
                  testimonial={testimonial}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation controls & indicators */}
        <div className="flex items-center justify-between mt-8 max-w-xs sm:max-w-md mx-auto px-4">
          <button 
            onClick={() => {
              const prevIndex = activeIndex === 0 ? maxIndex : activeIndex - 1;
              moveSlider(prevIndex);
            }}
            className="p-2.5 rounded-full bg-neutral-900 hover:bg-[#20b2aa] border border-neutral-800 text-white transition-all shadow-md active:scale-95 flex items-center justify-center w-10 h-10 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          {/* Pagination indicators */}
          <div className="flex items-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => moveSlider(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === index 
                    ? 'bg-[#20b2aa] w-6' 
                    : 'bg-neutral-800 hover:bg-neutral-700 w-2'
                }`}
                aria-label={`Go to testimonial set ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => {
              const nextIndex = activeIndex >= maxIndex ? 0 : activeIndex + 1;
              moveSlider(nextIndex);
            }}
            className="p-2.5 rounded-full bg-neutral-900 hover:bg-[#20b2aa] border border-neutral-800 text-white transition-all shadow-md active:scale-95 flex items-center justify-center w-10 h-10 cursor-pointer"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div 
      className="bg-neutral-900/90 rounded-2xl p-5 sm:p-6 backdrop-blur-md border border-neutral-800 flex flex-col h-full hover:border-[#20b2aa]/40 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(32,178,170,0.1)] relative w-full text-left justify-between"
    >
      {/* Subtle top accent gradient */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#20b2aa]/40 to-transparent"></div>

      {/* Main review text */}
      <p className="text-neutral-300 mb-6 text-sm sm:text-base leading-relaxed font-medium">
        "{testimonial.review}"
      </p>
      
      {/* Author info */}
      <div className="flex items-center pt-4 border-t border-neutral-800/80">
        <div className="h-11 w-11 rounded-full overflow-hidden ring-2 ring-[#20b2aa]/60 flex-shrink-0 bg-neutral-800">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="h-full w-full bg-teal-900 flex items-center justify-center text-white font-bold text-sm"
            style={{ display: 'none' }}
          >
            {testimonial.name.charAt(0)}
          </div>
        </div>
        
        <div className="ml-3 overflow-hidden">
          <div className="font-bold text-white text-sm sm:text-base truncate">{testimonial.name}</div>
          <div className="text-xs text-[#20b2aa] font-semibold truncate">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

