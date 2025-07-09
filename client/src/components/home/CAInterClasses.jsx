import React from 'react';

const classes = [
  { name: 'CA Inter Class 1', img: 'https://placehold.co/120x80?text=Class+1' },
  { name: 'CA Inter Class 2', img: 'https://placehold.co/120x80?text=Class+2' },
  { name: 'CA Inter Class 3', img: 'https://placehold.co/120x80?text=Class+3' },
  { name: 'CA Inter Class 4', img: 'https://placehold.co/120x80?text=Class+4' },
];

export default function CAInterClasses() {
  return (
    <section className="py-12 bg-white/70">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 font-pacifico">CA Inter Classes</h2>
          <a href="#" className="text-blue-600 font-semibold hover:underline">View all</a>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2">
          {classes.map((cls) => (
            <div key={cls.name} className="flex flex-col items-center bg-white rounded-xl shadow p-4 min-w-[180px]">
              <img src={cls.img} alt={cls.name} className="w-28 h-16 mb-2 rounded object-cover border-2 border-blue-200" />
              <span className="text-base font-semibold text-gray-700 text-center whitespace-nowrap">{cls.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 