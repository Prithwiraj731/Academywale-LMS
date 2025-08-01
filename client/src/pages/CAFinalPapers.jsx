import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CAFinalPapers() {
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
        CA Final Papers
      </h2>
      <div className="w-full max-w-2xl space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group 1</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/courses/ca/final/paper-11')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 11: Financial Reporting
            </button>
            <button
              onClick={() => navigate('/courses/ca/final/paper-12')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 12: Advanced Financial Management
            </button>
            <button
              onClick={() => navigate('/courses/ca/final/paper-13')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 13: Advanced Auditing and Professional Ethics
            </button>
            <button
              onClick={() => navigate('/courses/ca/final/paper-14')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 14: Corporate and Other Laws
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group 2</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/courses/ca/final/paper-15')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 15: Strategic Cost Management and Performance Evaluation
            </button>
            <button
              onClick={() => navigate('/courses/ca/final/paper-16')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 16: Electives (various options)
            </button>
            <button
              onClick={() => navigate('/courses/ca/final/paper-17')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 17: Direct Tax Laws and International Taxation
            </button>
            <button
              onClick={() => navigate('/courses/ca/final/paper-18')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 18: Indirect Tax Laws
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}