import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CMAInterPapers() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col items-center justify-center">
      <button
        className="mb-6 text-[#20b2aa] font-semibold hover:underline flex items-center text-base"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight text-center drop-shadow-lg">
        CMA Inter Papers
      </h2>
      <div className="w-full max-w-md space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group 1</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((paperNum) => (
              <button
                key={paperNum}
                onClick={() => navigate(`/courses/cma/inter/paper-${paperNum}`)}
                className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
              >
                Paper {paperNum}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group 2</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[5, 6, 7, 8].map((paperNum) => (
              <button
                key={paperNum}
                onClick={() => navigate(`/courses/cma/inter/paper-${paperNum}`)}
                className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
              >
                Paper {paperNum}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}