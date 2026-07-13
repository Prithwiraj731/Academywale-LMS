import React from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function SearchBy() {
  const navigate = useNavigate();
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
            {[...institutes, ...institutes, ...institutes].map((inst, index) => (
              <div
                key={`${inst.name}-${index}`}
                onClick={() => navigate(`/institutes/${encodeURIComponent(inst.name.replace(/\s+/g, '_'))}`)}
                className="group flex flex-col items-center justify-between w-36 xs:w-40 sm:w-48 h-28 xs:h-32 sm:h-40 bg-white p-3 sm:p-4 rounded-2xl border border-neutral-100/80 hover:border-teal-500/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex-shrink-0 mr-4 sm:mr-6"
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
                <span className="w-full text-center text-xs sm:text-sm font-bold text-gray-700 group-hover:text-[#20b2aa] transition-colors duration-300 line-clamp-1 sm:line-clamp-2 mt-2 leading-tight px-1">
                  {inst.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Inline styles for infinite scrolling & animations */}
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
        `}</style>
      </div>
    </section>
  );
}