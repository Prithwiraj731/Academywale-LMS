import React from 'react';
import { useNavigate } from 'react-router-dom';

const institutes = [
  { name: 'Avinash Lala Classes', img: '/src/assets/institues/Avinash Lala Classes.jpg' },
  { name: 'CA Buddy', img: '/src/assets/institues/CA Buddy.png' },
  { name: 'Bishnu Kedia Classes', img: '/src/assets/institues/Bishnu Kedia Classes.png' },
  { name: 'COC Education', img: '/src/assets/institues/COC Education.png' },
  { name: 'BB Virtuals', img: '/src/assets/institues/BB Virtuals.png' },
  { name: 'Gopal Bhoot Classes', img: '/src/assets/institues/Gopal Bhoot Classes.gif' },
  { name: 'CA Praveen Jindal', img: '/src/assets/institues/CA Praveen Jindal.png' },
  { name: 'Siddharth Agarrwal Classes', img: '/src/assets/institues/Siddharth Agarrwal Classes.jpg' },
  { name: 'Navin Classes', img: '/src/assets/institues/Navin Classes.jpg' },
  { name: 'Harshad Jaju Classes', img: '/src/assets/institues/Harshad Jaju Classes.png' },
  { name: 'AADITYA JAIN CLASSES', img: '/src/assets/institues/AADITYA JAIN CLASSES.png' },
  { name: 'Yashwant Mangal Classes', img: '/src/assets/institues/Yashwant Mangal Classes.avif' },
  { name: 'Nitin Guru Classes', img: '/src/assets/institues/Nitin Guru Classes.png' },
  { name: 'Ekatvam', img: '/src/assets/institues/Ekatvam.png' },
  { name: 'Shivangi Agarwal', img: '/src/assets/institues/Shivangi Agarwal.png' },
  { name: 'Ranjan Periwal Classes', img: '/src/assets/institues/Ranjan Periwal Classes.jpg' },
];

export default function SearchBy() {
  const navigate = useNavigate();
  return (
    <section className="py-16 section-light">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 text-center mb-10 font-pacifico">
          <button
            className="hover:underline text-blue-700 transition-colors duration-200 text-4xl font-extrabold"
            onClick={() => navigate('/institutes')}
          >
            Search by Institutes
          </button>
        </h2>
        {/* Carousel */}
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 py-4 animate-scroll-x">
            {[...institutes, ...institutes].map(inst => (
              <div key={inst.name + Math.random()} className="flex flex-col items-center min-w-[180px] max-w-[200px]">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center mb-2 border-2 border-blue-200">
                  <img
                    src={inst.img}
                    alt={inst.name}
                    className="object-contain w-full h-full hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-base font-semibold text-gray-700 text-center whitespace-nowrap mt-1">
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