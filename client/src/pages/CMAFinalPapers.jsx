import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CMAFinalPapers() {
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
        CMA Final Papers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group 1</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/courses/cma/final/paper-13')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 13: Corporate and Economic Laws
            </button>
            <button
              onClick={() => navigate('/courses/cma/final/paper-14')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 14: Strategic Financial Management
            </button>
            <button
              onClick={() => navigate('/courses/cma/final/paper-15')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 15: Strategic Cost Management
            </button>
            <button
              onClick={() => navigate('/courses/cma/final/paper-16')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 16: Direct Tax Laws and International Taxation
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group 2</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/courses/cma/final/paper-17')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 17: Corporate Financial Reporting
            </button>
            <button
              onClick={() => navigate('/courses/cma/final/paper-18')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 18: Indirect Tax Laws and Practice
            </button>
            <button
              onClick={() => navigate('/courses/cma/final/paper-19')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 19: Cost and Management Audit
            </button>
            <button
              onClick={() => navigate('/courses/cma/final/paper-20')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 20: Strategic Performance Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}