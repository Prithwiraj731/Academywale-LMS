import React from 'react';

const reviews = [
  { name: 'Teacher 1', img: 'https://placehold.co/60x60?text=T1', text: 'Academywale is a fantastic platform for students.' },
  { name: 'Student 1', img: 'https://placehold.co/60x60?text=S1', text: 'I cleared my exams thanks to Academywale!' },
  { name: 'Teacher 2', img: 'https://placehold.co/60x60?text=T2', text: 'Great support and resources.' },
  { name: 'Student 2', img: 'https://placehold.co/60x60?text=S2', text: 'The best place for CA/CMA/CS prep.' },
];

export default function Reviews() {
  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 font-pacifico">See What Teachers Say</h2>
          <a href="#" className="text-blue-600 font-semibold hover:underline">View all</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {reviews.map((rev) => (
            <div key={rev.name} className="flex items-center bg-white rounded-xl shadow p-4 sm:p-6 gap-3 sm:gap-4">
              <img src={rev.img} alt={rev.name} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-blue-200" />
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">{rev.name}</div>
                <div className="text-gray-600 text-xs sm:text-sm">{rev.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 