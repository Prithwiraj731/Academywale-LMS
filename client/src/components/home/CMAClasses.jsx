import React from 'react';

export default function CMAClasses() {
  const navigateToCMA = () => window.location.href = '/courses/cma';
  return (
    <section className="py-12 bg-gradient-to-r from-blue-50 via-white to-blue-100">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <button
          onClick={navigateToCMA}
          className="mb-8 text-2xl px-10 py-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold shadow-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          CMA
        </button>
      </div>
    </section>
  );
} 