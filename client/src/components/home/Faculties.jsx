import React from 'react';

const faculties = [
  { name: 'CA Vijay Sarda', img: 'https://placehold.co/80x80?text=VS' },
  { name: 'CA Darshan Khere', img: 'https://placehold.co/80x80?text=DK' },
  { name: 'CA Ranjan Periwal', img: 'https://placehold.co/80x80?text=RP' },
  { name: 'CA Mayank Saraf', img: 'https://placehold.co/80x80?text=MS' },
  { name: 'CA Bishnu Kedia', img: 'https://placehold.co/80x80?text=BK' },
  { name: 'CA CMA Santosh Kumar', img: 'https://placehold.co/80x80?text=SK' },
  { name: 'CA Shivangi Agarwal', img: 'https://placehold.co/80x80?text=SA' },
  { name: 'CS LLM Arjun Chhabra', img: 'https://placehold.co/80x80?text=AC' },
  { name: 'CA CS Divya Agarwal', img: 'https://placehold.co/80x80?text=DA' },
  { name: 'CA Avinash Sancheti', img: 'https://placehold.co/80x80?text=AS' },
];

export default function Faculties() {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 font-pacifico">Our Faculties</h2>
          <a href="#" className="text-blue-600 font-semibold hover:underline">View all</a>
        </div>
        <div className="flex flex-nowrap md:flex-wrap gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-2 min-w-0">
          {faculties.map((fac) => (
            <div key={fac.name} className="flex flex-col items-center bg-white rounded-xl shadow p-3 sm:p-4 w-36 sm:w-44 md:w-48 min-w-0 max-w-xs flex-shrink-0 md:flex-shrink md:mb-4">
              <img src={fac.img} alt={fac.name} className="w-16 h-16 mb-2 rounded-full object-cover border-2 border-blue-200" />
              <span className="text-sm sm:text-base font-semibold text-gray-700 text-center whitespace-normal break-words leading-tight mt-1">{fac.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 