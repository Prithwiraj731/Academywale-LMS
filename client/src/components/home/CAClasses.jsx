import React from 'react';

export default function CAClasses() {
  const navigateToCA = () => window.location.href = '/courses/ca';
  return (
    <section className="py-12 bg-white/70">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
        <button
          onClick={navigateToCA}
          className="mb-8 text-2xl px-10 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          CA
        </button>
      </div>
    </section>
  );
} 