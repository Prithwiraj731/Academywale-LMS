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
      className="relative z-10 w-full flex flex-col justify-center items-center overflow-hidden bg-transparent"
      style={{ height: 'auto' }}
    >
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {/* Subtle blue gradient overlay for vibrancy */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100/70 via-blue-50/60 to-transparent" />
      </div>
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
              className="w-full h-auto xs:h-64 sm:h-80 md:h-[440px] lg:h-[520px] object-contain sm:object-cover shadow-2xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:brightness-105 relative z-20 align-bottom flex-shrink-0"
              style={{ display: 'block', marginBottom: 0, paddingBottom: 0, minWidth: '100%' }}
            />
          ))}
        </div>
      </div>
      {/* SVG wave now sits directly below the image as a section divider */}
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 xs:h-20 sm:h-24 md:h-32 z-30 -mt-6 xs:-mt-8 sm:-mt-10">
        <path fill="#e0f2fe" d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z" />
        <path fill="#38bdf8" fillOpacity="0.18" d="M0,100 C400,180 1040,20 1440,100 L1440,120 L0,120 Z" />
      </svg>
    </section>
  );
}
