import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight, FaAward, FaCheckCircle } from 'react-icons/fa';

const group3 = [
  { id: 13, title: 'Corporate and Economic Laws', desc: 'Companies Act, Insolvency and Bankruptcy Code (IBC 2016), SEBI regulations, and Competition Act.' },
  { id: 14, title: 'Strategic Financial Management (SFM)', desc: 'Investment decisions, Derivatives risk management, Forex arithmetic, Security analysis, and Business valuation.' },
  { id: 15, title: 'Direct Tax Laws and International Taxation', desc: 'Corporate tax assessment, Tax planning strategies, Transfer pricing regulations, and Cross-border treaties.' },
  { id: 16, title: 'Strategic Cost Management', desc: 'Target Costing, Life Cycle Costing, Quality cost management, Lean manufacturing, and Value chain analysis.' },
];

const group4 = [
  { id: 17, title: 'Cost and Management Audit', desc: 'Cost audit rules (CRA-1 to CRA-4), Internal audit, Operational audit, and Professional standards.' },
  { id: 18, title: 'Corporate Financial Reporting', desc: 'Ind AS implementation, Group financial statements, Valuation of shares/goodwill, and Accounting for financial institutions.' },
  { id: 19, title: 'Indirect Tax Laws and Practice', desc: 'Comprehensive GST law, Customs Act, Foreign Trade Policy, and Indirect tax planning.' },
  { id: 20, title: 'Strategic Performance Management and Business Valuation', desc: 'Economic Value Added (EVA), Balanced scorecard, Business valuation models, Mergers, and Acquisitions.' },
];

const CMAFinalPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-blue-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <BackButton />
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <FaAward /> ICMAI CMA Final Syllabus 2022 Structure
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            CMA Final Papers & Strategic Curriculum
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            CMA Final encompasses 8 advanced papers across Group 3 and Group 4 (800 total marks), combining Strategic Cost Management, Financial Management, and Audit.
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
              <div className="text-xs font-bold text-slate-300">Free SFM Formula Sheet</div>
              <Link to="/resources/notes" className="text-xs font-bold text-amber-400 hover:underline">View Formula Sheet →</Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Group 3 */}
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 border-b border-neutral-850 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  Group III (Papers 13 to 16)
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full">400 Marks</span>
              </h2>
              <div className="space-y-4">
                {group3.map(paper => (
                  <Link
                    key={paper.id}
                    to={`/courses/cma/final/paper-${paper.id}`}
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

          {/* Group 4 */}
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 border-b border-neutral-850 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  Group IV (Papers 17 to 20)
                </span>
                <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full">400 Marks</span>
              </h2>
              <div className="space-y-4">
                {group4.map(paper => (
                  <Link
                    key={paper.id}
                    to={`/courses/cma/final/paper-${paper.id}`}
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

export default CMAFinalPapers;
