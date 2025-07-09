import React from 'react';

const partners = [
  { name: 'Partner 1', img: 'https://placehold.co/100x60?text=Partner+1' },
  { name: 'Partner 2', img: 'https://placehold.co/100x60?text=Partner+2' },
  { name: 'Partner 3', img: 'https://placehold.co/100x60?text=Partner+3' },
  { name: 'Partner 4', img: 'https://placehold.co/100x60?text=Partner+4' },
];

export default function Partners() {
  return (
    <section className="py-12 bg-white/70">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 font-pacifico">Our Partners</h2>
          <a href="#" className="text-blue-600 font-semibold hover:underline">View all</a>
        </div>
        <div className="flex flex-nowrap md:flex-wrap gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-2 min-w-0">
          {partners.map((p) => (
            <div key={p.name} className="flex flex-col items-center bg-white rounded-xl shadow p-3 sm:p-4 w-28 sm:w-32 md:w-36 min-w-0 max-w-xs flex-shrink-0 md:flex-shrink md:mb-4">
              <img src={p.img} alt={p.name} className="w-16 h-10 sm:w-20 sm:h-12 mb-2 rounded object-cover border-2 border-blue-200" />
              <span className="text-xs sm:text-base font-semibold text-gray-700 text-center whitespace-normal break-words leading-tight mt-1">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 