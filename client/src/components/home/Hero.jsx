import React from 'react';
import bannerImg from '../../assets/banner.png';

export default function Hero() {
  return (
    <section
      className="relative z-10 w-full flex justify-center items-center overflow-hidden bg-transparent"
      style={{ height: 'auto' }}
    >
      <img
        src={bannerImg}
        alt="Banner"
        className="w-full h-48 sm:h-64 md:h-[400px] lg:h-[500px] object-contain md:object-cover shadow-2xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:brightness-105"
        style={{ display: 'block' }}
      />
      {/* Optional gradient bottom fade */}
      <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  );
}
