import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight, FaAward, FaCheckCircle } from 'react-icons/fa';

const papers = [
  { id: 1, title: 'Fundamentals of Business Laws and Business Communication', desc: 'Commercial laws, Industrial laws, Contract Act, and Professional Communication skills.' },
  { id: 2, title: 'Fundamentals of Financial and Cost Accounting', desc: 'Accounting concepts, Ledger balancing, Cost accounting principles, and Preparation of final accounts.' },
  { id: 3, title: 'Fundamentals of Business Mathematics and Statistics', desc: 'Arithmetic, Basic algebra, Calculus applications, Measures of central tendency, and Probability.' },
  { id: 4, title: 'Fundamentals of Business Economics and Management', desc: 'Basic microeconomics, Market structures, Management process, Leadership, and Organizational behavior.' },
];

const CMAFoundationPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-blue-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <BackButton />
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <FaAward /> ICMAI CMA Foundation Syllabus 2022
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            CMA Foundation Papers & Blueprint
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            CMA Foundation comprises 4 fundamental papers (400 total marks). Scoring minimum 40% in each paper and 50% cumulative aggregate (200/400) is required to pass.
          </p>
        </div>

        {/* Passing Criteria Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-900/60 border border-neutral-800 p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-blue-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Min. Passing Marks</div>
              <div className="text-sm font-extrabold text-blue-300">40 Marks / Paper</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaAward className="text-teal-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Aggregate Requirement</div>
              <div className="text-sm font-extrabold text-teal-300">200 / 400 Marks (50%)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaBookOpen className="text-amber-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Free Study Hub</div>
              <Link to="/resources/cma" className="text-xs font-bold text-amber-400 hover:underline">View CMA Study Hub →</Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map(paper => (
            <Link
              key={paper.id}
              to={`/courses/cma/foundation/paper-${paper.id}`}
              className="group/btn relative w-full p-6 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-blue-500/40 text-left flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/5 gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-center text-blue-400 group-hover/btn:bg-blue-500/10 transition-colors shrink-0 mt-0.5">
                  <FaBookOpen className="text-xl" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs font-semibold tracking-wider text-neutral-400 uppercase">
                    Paper - {paper.id}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white mt-1 group-hover/btn:text-white transition-colors leading-snug">
                    {paper.title}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {paper.desc}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-neutral-850 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>View Faculty Classes</span>
                <FaChevronRight className="group-hover/btn:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CMAFoundationPapers;
