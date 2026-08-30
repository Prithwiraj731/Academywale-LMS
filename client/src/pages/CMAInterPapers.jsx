import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight, FaAward, FaCheckCircle } from 'react-icons/fa';

const group1 = [
  { id: 5, title: 'Business Laws and Ethics', desc: 'Commercial laws, Industrial regulations, Companies Act, and Corporate governance & ethics.' },
  { id: 6, title: 'Financial Accounting', desc: 'Accounting standards, Partnership accounts, Special transactions, and Departmental accounting.' },
  { id: 7, title: 'Direct and Indirect Taxation', desc: 'Income tax computation (50M) & Goods and Services Tax / Customs law (50M).' },
  { id: 8, title: 'Cost Accounting', desc: 'Cost sheets, Material/Labour costs, Overheads, Standard Costing, Marginal Costing, and CAS.' },
];

const group2 = [
  { id: 9, title: 'Operations Management and Strategic Management', desc: 'Production planning, Operations strategy, Resource scheduling, and Corporate strategy analysis.' },
  { id: 10, title: 'Corporate Accounting and Auditing', desc: 'Company financial statements, Cash flows, Banking/Insurance accounting, and Auditing principles.' },
  { id: 11, title: 'Financial Management and Business Data Analytics', desc: 'Capital budgeting, Working capital, Financial ratio models, and Business data analytics tools.' },
  { id: 12, title: 'Management Accounting', desc: 'Activity Based Costing (ABC), Decision making models, Transfer pricing, and Budgetary control.' },
];

const CMAInterPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-blue-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <BackButton />
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <FaAward /> ICMAI CMA Intermediate 8-Paper Structure
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            CMA Intermediate Papers & Syllabus
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            CMA Intermediate is divided into Group 1 (Papers 5-8) and Group 2 (Papers 9-12), carrying 800 total marks. Requires 40% individual paper pass marks and 50% group aggregate.
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
              <div className="text-xs font-bold text-slate-300">Group Aggregate</div>
              <div className="text-sm font-extrabold text-teal-300">200 / 400 Marks (50%)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaBookOpen className="text-amber-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Free Costing Notes</div>
              <Link to="/resources/cma" className="text-xs font-bold text-amber-400 hover:underline">View CMA Guides →</Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Group 1 */}
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 border-b border-neutral-850 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  Group I (Papers 5 to 8)
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full">400 Marks</span>
              </h2>
              <div className="space-y-4">
                {group1.map(paper => (
                  <Link
                    key={paper.id}
                    to={`/courses/cma/inter/paper-${paper.id}`}
                    className="group/btn relative w-full p-5 rounded-2xl bg-neutral-950 hover:bg-neutral-900/60 border border-neutral-850 hover:border-blue-500/40 text-left flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/5 gap-3"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-blue-400 group-hover/btn:bg-blue-500/10 transition-colors shrink-0 mt-0.5">
                        <FaBookOpen className="text-lg" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                          Paper - {paper.id}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover/btn:text-white transition-colors leading-snug">
                          {paper.title}
                        </span>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          {paper.desc}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs text-blue-400 font-semibold">
                      <span>View Faculty Classes</span>
                      <FaChevronRight className="group-hover/btn:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Group 2 */}
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 border-b border-neutral-850 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  Group II (Papers 9 to 12)
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full">400 Marks</span>
              </h2>
              <div className="space-y-4">
                {group2.map(paper => (
                  <Link
                    key={paper.id}
                    to={`/courses/cma/inter/paper-${paper.id}`}
                    className="group/btn relative w-full p-5 rounded-2xl bg-neutral-950 hover:bg-neutral-900/60 border border-neutral-850 hover:border-blue-500/40 text-left flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/5 gap-3"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-blue-400 group-hover/btn:bg-blue-500/10 transition-colors shrink-0 mt-0.5">
                        <FaBookOpen className="text-lg" />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                          Paper - {paper.id}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-white mt-0.5 group-hover/btn:text-white transition-colors leading-snug">
                          {paper.title}
                        </span>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                          {paper.desc}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs text-blue-400 font-semibold">
                      <span>View Faculty Classes</span>
                      <FaChevronRight className="group-hover/btn:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CMAInterPapers;
