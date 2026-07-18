import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight } from 'react-icons/fa';

const papers = [
  { id: 1, title: 'Principles and Practice of Accounting' },
  { id: 2, title: 'Business Laws and Business Correspondence and Reporting' },
  { id: 3, title: 'Business Mathematics, Logical Reasoning & Statistics' },
  { id: 4, title: 'Business Economics & Business and Commercial Knowledge' },
];

const CAFoundationPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">
      {/* Premium top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <BackButton />
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-center mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
          CA Foundation Papers
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map(paper => (
            <Link
              key={paper.id}
              to={`/courses/ca/foundation/paper-${paper.id}`}
              className="group/btn relative w-full py-5 px-6 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-[#20b2aa]/40 text-left flex items-center justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/5 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0">
                  <FaBookOpen className="text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Paper - {paper.id}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white mt-1 group-hover/btn:text-white transition-colors leading-snug">
                    {paper.title}
                  </span>
                </div>
              </div>
              <FaChevronRight className="text-neutral-500 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all shrink-0 ml-auto" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CAFoundationPapers;