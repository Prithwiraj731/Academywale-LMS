import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CAFoundationPapers() {
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
        CA Foundation Papers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        <button
          onClick={() => navigate('/courses/ca/foundation/paper-1')}
          className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
        >
          Paper 1: Principles and Practice of Accounting
        </button>
        <button
          onClick={() => navigate('/courses/ca/foundation/paper-2')}
          className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
        >
          Paper 2: Business Laws and Business Correspondence and Reporting
        </button>
        <button
          onClick={() => navigate('/courses/ca/foundation/paper-3')}
          className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
        >
          Paper 3: Business Mathematics, Logical Reasoning & Statistics
        </button>
        <button
          onClick={() => navigate('/courses/ca/foundation/paper-4')}
          className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
        >
          Paper 4: Business Economics & Business and Commercial Knowledge
        </button>
        <button
          onClick={() => navigate('/courses/ca/foundation/combo')}
          className="bg-purple-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-purple-700 transition-all text-lg col-span-full"
        >
          Combo Paper
        </button>
      </div>
    </div>
  );
}