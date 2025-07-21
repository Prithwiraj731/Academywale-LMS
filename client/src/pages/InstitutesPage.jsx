import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function InstitutesPage() {
  const navigate = useNavigate();
  const [institutes, setInstitutes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/institutes`)
      .then(res => res.json())
      .then(data => setInstitutes(data.institutes || []));
  }, []);

  const handleInstituteClick = (inst) => {
    navigate(`/institutes/${encodeURIComponent(inst.name.replace(/\s+/g, '_'))}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7f4] via-purple-50 to-yellow-50 py-12 px-2 sm:px-4 flex flex-col items-center relative">
      <button
        className="absolute top-6 left-6 text-[#20b2aa] hover:bg-[#e0f7f4] rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#20b2aa]"
        onClick={() => navigate('/')}
        aria-label="Back to Home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-10 font-heading tracking-tight drop-shadow-lg">
        All Institutes
      </h2>
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {institutes.map(inst => (
            <div
              key={inst.name}
              className={`flex flex-col items-center bg-white/80 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent`}
              onClick={() => handleInstituteClick(inst)}
            >
              <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center mb-4 border-2 border-[#20b2aa]">
                <img
                  src={inst.imageUrl}
                  alt={inst.name}
                  className="object-contain w-full h-full hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-lg font-semibold text-gray-800 text-center whitespace-nowrap mt-1">
                {inst.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 