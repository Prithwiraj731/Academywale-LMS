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
    <section className="py-10 xs:py-12 sm:py-16 section-light">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold text-blue-800 text-center mb-6 xs:mb-8 sm:mb-10 font-pacifico">
          <button
            className="hover:underline text-blue-700 transition-colors duration-200 text-2xl xs:text-3xl sm:text-4xl font-extrabold"
            onClick={() => navigate('/institutes')}
          >
            Search by Institutes
          </button>
        </h2>
        {/* Carousel */}
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 xs:gap-6 sm:gap-8 py-4 animate-scroll-x">
            {[...institutes, ...institutes].map(inst => (
              <div key={inst.name + Math.random()} className="flex flex-col items-center min-w-[120px] xs:min-w-[150px] sm:min-w-[180px] max-w-[160px] xs:max-w-[180px] sm:max-w-[200px]">
                <div className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center mb-1 xs:mb-2 border-2 border-blue-200">
                  <img
                    src={inst.img}
                    alt={inst.name}
                    className="object-contain w-full h-full hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm xs:text-base font-semibold text-gray-700 text-center whitespace-nowrap mt-1">
                  {inst.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes scroll-x {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-x {
            animation: scroll-x 12s linear infinite;
          }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </section>
  );
}