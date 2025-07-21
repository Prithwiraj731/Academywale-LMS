import React from 'react';
import bannerImg from '../../assets/banner.png';

export default function Hero() {
  return (
    <section
      className="relative z-10 w-full flex flex-col justify-center items-center overflow-hidden bg-transparent"
      style={{ height: 'auto' }}
    >
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        {/* Subtle blue gradient overlay for vibrancy */}
        <div className="w-full h-full bg-gradient-to-br from-blue-100/70 via-blue-50/60 to-transparent" />
      </div>
      <img
        src={bannerImg}
        alt="Banner"
        className="w-full h-64 sm:h-80 md:h-[440px] lg:h-[520px] object-cover shadow-2xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:brightness-105 relative z-20 align-bottom"
        style={{ display: 'block', marginBottom: 0, paddingBottom: 0 }}
      />
      {/* SVG wave now sits directly below the image as a section divider */}
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24 md:h-32 z-30 -mt-10">
        <path fill="#e0f2fe" d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z" />
        <path fill="#38bdf8" fillOpacity="0.18" d="M0,100 C400,180 1040,20 1440,100 L1440,120 L0,120 Z" />
      </svg>
    </section>
  );
}
