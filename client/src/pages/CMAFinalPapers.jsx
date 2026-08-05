import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight } from 'react-icons/fa';

const group3 = [
  { id: 13, title: 'Corporate and Economic Laws' },
  { id: 14, title: 'Strategic Financial Management' },
  { id: 15, title: 'Direct Tax Laws and International Taxation' },
  { id: 16, title: 'Strategic Cost Management' },
];

const group4 = [
  { id: 17, title: 'Cost and Management Audit' },
  { id: 18, title: 'Corporate Financial Reporting' },
  { id: 19, title: 'Indirect Tax Laws and Practice' },
  { id: 20, title: 'Strategic Performance Management and Business Valuation' },
];

const CMAFinalPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Premium top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <BackButton />
        <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-center mb-10 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-neutral-200 dark:to-neutral-400">
          CMA Final Papers
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Group III */}
          <div className="bg-white dark:bg-neutral-900/40 backdrop-blur-sm border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-neutral-850 pb-3 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#20b2aa] animate-pulse" />
              Group III
            </h2>
            <div className="space-y-4">
              {group3.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/cma/final/paper-${paper.id}`}
                  className="group/btn relative w-full py-4 px-5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-neutral-950 dark:hover:bg-neutral-900/60 border border-slate-200 dark:border-neutral-850 hover:border-[#20b2aa]/40 text-left flex items-center justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#20b2aa]/5 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0">
                      <FaBookOpen className="text-lg" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-500 uppercase">
                        Paper - {paper.id}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover/btn:text-[#20b2aa] dark:group-hover/btn:text-white transition-colors leading-snug">
                        {paper.title}
                      </span>
                    </div>
                  </div>
                  <FaChevronRight className="text-slate-400 dark:text-neutral-500 group-hover/btn:text-[#20b2aa] dark:group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all shrink-0 ml-auto" />
                </Link>
              ))}
            </div>
          </div>

          {/* Group IV */}
          <div className="bg-white dark:bg-neutral-900/40 backdrop-blur-sm border border-slate-200 dark:border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-neutral-850 pb-3 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#20b2aa] animate-pulse" />
              Group IV
            </h2>
            <div className="space-y-4">
              {group4.map(paper => (
                <Link
                  key={paper.id}
                  to={`/courses/cma/final/paper-${paper.id}`}
                  className="group/btn relative w-full py-4 px-5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-neutral-950 dark:hover:bg-neutral-900/60 border border-slate-200 dark:border-neutral-850 hover:border-[#20b2aa]/40 text-left flex items-center justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#20b2aa]/5 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0">
                      <FaBookOpen className="text-lg" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-neutral-500 uppercase">
                        Paper - {paper.id}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1 group-hover/btn:text-[#20b2aa] dark:group-hover/btn:text-white transition-colors leading-snug">
                        {paper.title}
                      </span>
                    </div>
                  </div>
                  <FaChevronRight className="text-slate-400 dark:text-neutral-500 group-hover/btn:text-[#20b2aa] dark:group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all shrink-0 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CMAFinalPapers;
