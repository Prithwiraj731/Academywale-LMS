import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight } from 'react-icons/fa';

const group1 = [
  { id: 5, title: 'Advanced Accounting' },
  { id: 6, title: 'Corporate and Other Laws' },
  { id: 7, title: 'Taxation (Income tax laws & Goods & Service Tax)' },
];

const group2 = [
  { id: 8, title: 'Cost and Management Accounting' },
  { id: 9, title: 'Auditing and ethics' },
  { id: 10, title: 'Financial Management and Strategic Management' },
];

const CAInterPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">
      {/* Premium top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <BackButton />
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-center mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
          CA Inter Papers
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Group 1 */}
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 border-b border-neutral-850 pb-3 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#20b2aa] animate-pulse" />
              Group I
            </h2>
            <div className="space-y-4">
              {group1.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/ca/inter/paper-${paper.id}`}
                  className="group/btn relative w-full py-4 px-5 rounded-2xl bg-neutral-950 hover:bg-neutral-900/60 border border-neutral-850 hover:border-[#20b2aa]/40 text-left flex items-center justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#20b2aa]/5 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0">
                      <FaBookOpen className="text-lg" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
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
          </div>

          {/* Group 2 */}
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 border-b border-neutral-850 pb-3 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#20b2aa] animate-pulse" />
              Group II
            </h2>
            <div className="space-y-4">
              {group2.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/ca/inter/paper-${paper.id}`}
                  className="group/btn relative w-full py-4 px-5 rounded-2xl bg-neutral-950 hover:bg-neutral-900/60 border border-neutral-850 hover:border-[#20b2aa]/40 text-left flex items-center justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#20b2aa]/5 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0">
                      <FaBookOpen className="text-lg" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default CAInterPapers;
