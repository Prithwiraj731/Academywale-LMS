import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import banner1_1Img from '../../assets/Banner1.1.png';
import mobileHero1Img from '../../assets/mobile-hero1.png';

export default function Hero() {
  const banners = [banner1_1Img];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch swipe handling for desktop/tablet banner
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    if (banners.length <= 1) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (banners.length <= 1) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (banners.length <= 1 || !touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  // Auto slide every 6 seconds for desktop banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleScrollToContent = (e) => {
    if (e) e.preventDefault();
    const section = document.getElementById('learning-journey');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* =========================================
          DESKTOP VERSION (md: and above)
          Untouched original banner slider
         ========================================= */}
      <div 
        className="hidden md:block w-full aspect-[2172/724] relative overflow-hidden group select-none bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner Slider */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out bg-white"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative bg-white">
              <img
                src={banner}
                alt={`Banner ${idx + 1}`}
                className="w-full h-full object-contain md:object-contain bg-white select-none pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow Button */}
        {banners.length > 1 && (
          <button
            onClick={() => setCurrentIndex((currentIndex - 1 + banners.length) % banners.length)}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 text-white rounded-full transition-all duration-200 z-30 focus:outline-none opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer"
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow Button */}
        {banners.length > 1 && (
          <button
            onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 text-white rounded-full transition-all duration-200 z-30 focus:outline-none opacity-0 group-hover:opacity-100 pointer-events-auto cursor-pointer"
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Indicator Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  currentIndex === idx ? 'w-6 bg-[#20b2aa]' : 'w-2 bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* =========================================
          MOBILE VERSION (md:hidden)
          Exact mobile-hero1.png with functional buttons
         ========================================= */}
      <div className="block md:hidden relative w-full overflow-hidden bg-[#eaf4f7]">
        <div className="relative w-full aspect-[887/1774] max-w-[500px] mx-auto overflow-hidden select-none">
          {/* Exact Mobile Hero Image */}
          <img
            src={mobileHero1Img}
            alt="AcademyWale - Build Your CA & CMA Journey"
            className="w-full h-full object-cover object-center pointer-events-none block"
            loading="eager"
            fetchPriority="high"
          />

          {/* Interactive Button Overlay: "Explore Courses" */}
          <Link
            to="/courses/all"
            aria-label="Explore Courses"
            className="absolute left-[29.1%] top-[28.5%] w-[41.7%] h-[4.5%] rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009da0] active:scale-95 active:bg-black/10 transition-transform duration-150 z-20"
            title="Explore Courses"
          />

          {/* Interactive Button Overlay: "Know More" */}
          <button
            type="button"
            onClick={handleScrollToContent}
            aria-label="Know More"
            className="absolute left-[31.2%] top-[33.8%] w-[37.5%] h-[4.2%] rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#009da0] active:scale-95 active:bg-teal-600/15 transition-transform duration-150 z-20"
            title="Know More"
          />

          {/* Bottom Card Interactive Link: "Expert Faculty" */}
          <Link
            to="/faculties"
            aria-label="Expert Faculty - For Every Level"
            className="absolute left-[3.5%] top-[86.0%] w-[31%] h-[11.5%] rounded-2xl cursor-pointer active:bg-teal-500/10 active:scale-95 transition-all duration-150 z-20"
            title="Meet Expert Faculty"
          />

          {/* Bottom Card Interactive Link: "Expert Mentorship & Support" */}
          <Link
            to="/contact"
            aria-label="Expert Mentorship & Support"
            className="absolute left-[34.5%] top-[86.0%] w-[31%] h-[11.5%] rounded-2xl cursor-pointer active:bg-teal-500/10 active:scale-95 transition-all duration-150 z-20"
            title="Expert Mentorship & Support"
          />

          {/* Bottom Card Interactive Link: "Your Growth - Our Commitment" */}
          <Link
            to="/courses"
            aria-label="Your Growth - Our Commitment"
            className="absolute left-[65.5%] top-[86.0%] w-[31%] h-[11.5%] rounded-2xl cursor-pointer active:bg-teal-500/10 active:scale-95 transition-all duration-150 z-20"
            title="Explore All Courses"
          />
        </div>
      </div>
    </section>
  );
}

