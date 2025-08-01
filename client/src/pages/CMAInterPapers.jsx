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
            <button
              onClick={() => navigate('/courses/cma/inter/paper-5')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 5: Financial Accounting
            </button>
            <button
              onClick={() => navigate('/courses/cma/inter/paper-6')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 6: Laws and Ethics
            </button>
            <button
              onClick={() => navigate('/courses/cma/inter/paper-7')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 7: Direct Taxation
            </button>
            <button
              onClick={() => navigate('/courses/cma/inter/paper-8')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 8: Cost Accounting
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Group 2</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/courses/cma/inter/paper-9')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 9: Operations Management & Strategic Management
            </button>
            <button
              onClick={() => navigate('/courses/cma/inter/paper-10')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 10: Corporate Accounting and Auditing
            </button>
            <button
              onClick={() => navigate('/courses/cma/inter/paper-11')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 11: Indirect Taxation
            </button>
            <button
              onClick={() => navigate('/courses/cma/inter/paper-12')}
              className="bg-teal-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:bg-teal-700 transition-all text-lg"
            >
              Paper 12: Company Accounts and Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}