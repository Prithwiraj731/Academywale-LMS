import React, { useState, useEffect, useRef } from "react";

// Custom animation styles
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
  
  @keyframes slideLeft {
    0% {
      transform: translateX(30px);
      opacity: 0;
    }
    5% {
      transform: translateX(0);
      opacity: 1;
    }
    95% {
      transform: translateX(0);
      opacity: 1;
    }
    100% {
      transform: translateX(-30px);
      opacity: 0;
    }
  }
  
  .testimonial-slider {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
    gap: 1.5rem;
  }
  
  .testimonial-slide {
    min-width: 100%;
  }
  
  @media (min-width: 768px) {
    .testimonial-slide {
      min-width: calc(50% - 0.75rem);
    }
  }
  
  @media (min-width: 1024px) {
    .testimonial-slide {
      min-width: calc(33.333% - 1rem);
    }
  }
`;

// Import testimonial images
import testimonial1 from "../../assets/testimonial/1.jpg";
import testimonial2 from "../../assets/testimonial/2.jpg";
import testimonial3 from "../../assets/testimonial/3.jpg";
import testimonial4 from "../../assets/testimonial/4.jpg";
import testimonial5 from "../../assets/testimonial/5.jpg";
import testimonial6 from "../../assets/testimonial/6.jpg";

const testimonials = [
  {
    id: 1,
    name: "Sourav Pathak",
    role: "CMA Final Student",
    review: "AcademyWale made my CA/CMA journey so much smoother! I was able to purchase top faculty courses at discounted prices, with flexible validity and instant access. The support team is very responsive, and the whole process is super easy. Highly recommended for every CA/CMA aspirant looking for quality classes at affordable rates!",
    avatar: testimonial1,
    handle: "@sourav_pathak",
  },
  {
    id: 2,
    name: "Muskan",
    role: "CMA Inter Aspirant",
    review: "AcademyWale really understands student needs. I was able to choose the best faculty for my CMA Inter subjects with proper guidance. The purchase process was simple, and the team was always ready to help. Highly recommended!",
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
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  
  // Calculate how many testimonials to show based on screen size
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(-${activeIndex * 100}%)`;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);
  
  // Determine how many cards to show based on screen width
  let cardsToShow = 1;
  if (windowWidth >= 768) cardsToShow = 2;
  if (windowWidth >= 1024) cardsToShow = 3;
  
  // Total number of slides (accounting for wrapping)
  const totalSlides = testimonials.length;
  
  // Handle slider movement
  const moveSlider = (index) => {
    setActiveIndex(index);
    if (sliderRef.current) {
      const slideWidth = 100 / cardsToShow;
      sliderRef.current.style.transform = `translateX(-${index * slideWidth}%)`;
    }
  };
  
  // Start/stop the auto slider
  useEffect(() => {
    const startInterval = () => {
      // Clear existing interval if any
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          const nextIndex = (activeIndex + 1) % (totalSlides - cardsToShow + 1);
          moveSlider(nextIndex);
        }
      }, 3000); // Change every 3 seconds
    };
    
    startInterval();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeIndex, isPaused, cardsToShow, totalSlides]);
  
  return (
    <section className="py-12 bg-black text-white overflow-hidden">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            {title}
          </h2>
          <p className="text-lg text-gray-400 mt-3">
            {subtitle}
          </p>
        </div>

        <div className="overflow-hidden">
          <div 
            className="testimonial-slider"
            ref={sliderRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {testimonials.map((testimonial, index) => (
              <div className="testimonial-slide" key={`testimonial-${testimonial.id}`}>
                <TestimonialCard 
                  testimonial={testimonial}
                  isAnimating={false}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={() => {
              const prevIndex = activeIndex === 0 
                ? totalSlides - cardsToShow 
                : activeIndex - 1;
              moveSlider(prevIndex);
            }}
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          {/* Pagination indicators */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalSlides - cardsToShow + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => moveSlider(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-purple-500 w-4' 
                    : 'bg-gray-600'
                }`}
                aria-label={`Go to testimonial set ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => {
              const nextIndex = (activeIndex + 1) % (totalSlides - cardsToShow + 1);
              moveSlider(nextIndex);
            }}
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      className="bg-gray-900/70 rounded-2xl p-6 backdrop-blur-sm border border-purple-900/30 flex flex-col h-full hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 relative"
    >
      {/* Purple glow effect */}
      <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-xl"></div>
      
      {/* Main review text */}
      <p className="text-gray-300 mb-6 flex-grow relative z-10 pt-2 text-sm sm:text-base">
        "{testimonial.review}"
      </p>
      
      {/* Author info */}
      <div className="flex items-center mt-auto relative z-10">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden ring-2 ring-purple-500">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="h-full w-full bg-purple-800 flex items-center justify-center text-white"
            style={{ display: 'none' }}
          >
            {testimonial.name.charAt(0)}
          </div>
        </div>
        
        <div className="ml-3">
          <div className="font-semibold text-white text-sm sm:text-base">{testimonial.name}</div>
          <div className="text-xs sm:text-sm text-purple-300">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}
