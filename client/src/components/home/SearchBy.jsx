import React from 'react';

const searchBy = [
  { label: 'Institutes', img: 'https://placehold.co/100x100?text=Institutes' },
  { label: 'Faculties', img: 'https://placehold.co/100x100?text=Faculties' },
];

export default function SearchBy() {
  return (
    <section className="py-12 bg-white/70">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-8 text-center font-pacifico">Search by</h2>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
          {searchBy.map((item) => (
            <div key={item.label} className="flex flex-col items-center bg-white rounded-xl shadow p-4 sm:p-6 hover:shadow-lg transition w-44 sm:w-60">
              <img src={item.img} alt={item.label} className="w-14 h-14 sm:w-20 sm:h-20 mb-2 rounded-full object-cover border-2 border-blue-200" />
              <span className="text-base sm:text-lg font-semibold text-gray-700 text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 