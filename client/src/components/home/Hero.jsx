import React, { useState, useEffect } from 'react';
import banner2Img from '../../assets/banner2.png';
import banner1_1Img from '../../assets/Banner1.1.png';

export default function Hero() {
  const banners = [banner2Img, banner1_1Img];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch swipe handling for mobile & tablet
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950">
      <div 
        className="w-full aspect-[2172/724] relative overflow-hidden group select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Banner Slider */}
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              <img
                src={banner}
                alt={`Banner ${idx + 1}`}
                className="w-full h-full object-contain sm:object-cover md:object-contain bg-neutral-950 select-none pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={() => setCurrentIndex((currentIndex - 1 + banners.length) % banners.length)}
          className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 text-white rounded-full transition-all duration-200 z-30 focus:outline-none opacity-80 sm:opacity-0 sm:group-hover:opacity-100 pointer-events-auto cursor-pointer"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
          className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center bg-black/40 hover:bg-black/70 border border-white/20 text-white rounded-full transition-all duration-200 z-30 focus:outline-none opacity-80 sm:opacity-0 sm:group-hover:opacity-100 pointer-events-auto cursor-pointer"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                currentIndex === idx ? 'w-5 sm:w-6 bg-[#20b2aa]' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}