import React, { useState, useEffect } from 'react';
import bannerImg from '../../assets/banner.png';
import banner2Img from '../../assets/banner2.png';

export default function Hero() {
  const banners = [bannerImg, banner2Img];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <section
      className="relative z-10 w-full flex flex-col justify-center items-center overflow-hidden bg-transparent pt-2 xs:pt-3 sm:pt-4 md:pt-6 lg:pt-8"
      style={{ height: 'auto' }}
    >
      {/* Removed white overlay by deleting the gradient overlay div */}
      {/* <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-blue-100/70 via-blue-50/60 to-transparent" />
      </div> */}
      <div className="w-full overflow-hidden relative">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner, idx) => (
            <img
              key={idx}
              src={banner}
              alt={`Banner ${idx + 1}`}
              className="w-full h-auto object-contain shadow-lg xs:shadow-xl sm:shadow-2xl border border-gray-200 xs:border-2 hover:border-blue-500 transition-all duration-300 hover:scale-[1.01] xs:hover:scale-[1.02] sm:hover:scale-105 hover:brightness-105 relative z-20 align-bottom flex-shrink-0"
              style={{ display: 'block', marginBottom: 0, paddingBottom: 0, minWidth: '100%' }}
            />
          ))}
        </div>
        {/* Left arrow */}
        <button
          onClick={() => setCurrentIndex((currentIndex - 1 + banners.length) % banners.length)}
          className="absolute top-1/2 left-0.5 xs:left-1 sm:left-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-1 xs:p-1.5 sm:p-2 shadow-md hover:shadow-lg z-30 transition-all"
          aria-label="Previous Banner"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {/* Right arrow */}
        <button
          onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
          className="absolute top-1/2 right-0.5 xs:right-1 sm:right-2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-95 rounded-full p-1 xs:p-1.5 sm:p-2 shadow-md hover:shadow-lg z-30 transition-all"
          aria-label="Next Banner"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* SVG wave now sits directly below the image as a section divider */}
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 xs:h-16 sm:h-20 md:h-24 lg:h-32 z-30 -mt-4 xs:-mt-5 sm:-mt-6 md:-mt-8 lg:-mt-10">
        <path fill="#e0f2fe" d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z" />
        <path fill="#38bdf8" fillOpacity="0.18" d="M0,100 C400,180 1040,20 1440,100 L1440,120 L0,120 Z" />
      </svg>
    </section>
  );
}