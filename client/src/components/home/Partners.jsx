import React from 'react';

const partners = [
  { name: 'Partner 1', img: 'https://placehold.co/100x60?text=Partner+1' },
  { name: 'Partner 2', img: 'https://placehold.co/100x60?text=Partner+2' },
  { name: 'Partner 3', img: 'https://placehold.co/100x60?text=Partner+3' },
  { name: 'Partner 4', img: 'https://placehold.co/100x60?text=Partner+4' },
];

export default function Partners() {
  return (
    <section className="py-10 xs:py-12 sm:py-16 bg-gradient-to-r from-[#f0f9ff] via-white to-[#f0f9ff]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4 xs:mb-6 sm:mb-8">
          <h2 className="text-2xl xs:text-2xl sm:text-3xl font-bold text-blue-800 font-pacifico">Our Partners</h2>
          <Link to="/partners" className="text-sm xs:text-base text-blue-600 hover:underline font-medium">View all</Link>
        </div>
        <div className="flex flex-nowrap md:flex-wrap gap-3 xs:gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-2 min-w-0">
          {partners.map((p) => (
            <div key={p.name} className="flex-shrink-0 w-32 xs:w-36 sm:w-40 md:w-1/4 lg:w-1/5 bg-white rounded-lg shadow-md p-3 xs:p-4 flex flex-col items-center">
              <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-2 xs:mb-3">
                <img src={p.img} alt={p.name} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="text-center text-xs xs:text-sm sm:text-base font-medium text-gray-800">{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}