import React, { useState, useEffect } from 'react';
import bannerImg from '../../assets/banner.png';
import banner2Img from '../../assets/banner2.png';

export default function Hero() {
  const banners = [bannerImg, banner2Img];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section className="relative w-full overflow-hidden bg-neutral-900">
      <div className="w-full overflow-hidden relative group">
        {/* Banner Slider */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, idx) => (
            <img
              key={idx}
              src={banner}
              alt={`Banner ${idx + 1}`}
              className="w-full h-auto object-cover flex-shrink-0 select-none pointer-events-none"
              style={{ minWidth: '100%' }}
            />
          ))}
        </div>

        {/* Left Arrow Button */}
        <button
          onClick={() => setCurrentIndex((currentIndex - 1 + banners.length) % banners.length)}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 border border-white/10 text-white rounded-full transition-all duration-200 z-30 focus:outline-none opacity-0 group-hover:opacity-100 pointer-events-auto"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/60 border border-white/10 text-white rounded-full transition-all duration-200 z-30 focus:outline-none opacity-0 group-hover:opacity-100 pointer-events-auto"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}