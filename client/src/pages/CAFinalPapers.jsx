import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight, FaGraduationCap, FaCheckCircle, FaAward } from 'react-icons/fa';

const group1 = [
  { id: 11, title: 'Financial Reporting', desc: 'Comprehensive Ind AS (115, 116, 109, 103), Business Combinations, Consolidated Financial Statements, and CSR Reporting.' },
  { id: 12, title: 'Advanced Financial Management', desc: 'Foreign Exchange Risk Management, Derivatives, Security Valuation, Portfolio Theory, Mergers & Acquisitions, and Mutual Funds.' },
  { id: 13, title: 'Advanced Auditing and Professional Ethics', desc: 'Standards on Auditing (SAs 200–799), Professional Ethics under CA Act 1949, Forensic Accounting, and Digital Auditing Controls.' },
];

const group2 = [
  { id: 14, title: 'Direct Tax Laws and International Taxation', desc: 'Corporate Tax Assessment, Transfer Pricing (Sec 92), Double Taxation Relief (DTAA), BEPS, and Equalization Levy.' },
  { id: 15, title: 'Indirect Tax Laws', desc: 'Comprehensive GST Laws (CGST & IGST Acts), Customs Law, Foreign Trade Policy (FTP), Advance Rulings, and Appeals.' },
  { id: 16, title: 'Integrated Business Solutions', desc: 'Multi-disciplinary open-book case study integrating Financial Reporting, AFM, Audit, Taxation, Law, and Costing.' },
];

const CAFinalPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden font-sans">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-6xl space-y-8">
        <BackButton />
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <FaGraduationCap /> ICAI CA Final New Scheme Structure
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            CA Final Papers & Strategic Blueprint
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            CA Final represents the pinnacle of professional accounting education. 6 strategic papers structured across Group 1 and Group 2 (600 total marks).
          </p>
        </div>

        {/* Passing Criteria Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-neutral-900/60 border border-neutral-800 p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-teal-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Min. Passing Marks</div>
              <div className="text-sm font-extrabold text-teal-300">40 Marks / Paper</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaAward className="text-cyan-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Group Aggregate</div>
              <div className="text-sm font-extrabold text-cyan-300">150 / 300 Marks (50%)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaBookOpen className="text-amber-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Free Ind AS Notes</div>
              <Link to="/resources/notes" className="text-xs font-bold text-amber-400 hover:underline">View FR Cheat Sheet →</Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Group 1 */}
          <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-6 border-b border-neutral-850 pb-3 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#20b2aa] animate-pulse" />
                  Group I (Papers 11 to 13)
                </span>
                <span className="text-xs font-mono text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full">300 Marks</span>
              </h2>
              <div className="space-y-4">
                {group1.map(paper => (
                  <Link
                    key={paper.id}
                    to={`/courses/ca/final/paper-${paper.id}`}
                    className="group/btn relative w-full p-5 rounded-2xl bg-neutral-950 hover:bg-neutral-900/60 border border-neutral-850 hover:border-[#20b2aa]/40 text-left flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#20b2aa]/5 gap-3"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0 mt-0.5">
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
                    <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs text-teal-400 font-semibold">
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
                  <span className="w-2.5 h-2.5 rounded-full bg-[#20b2aa] animate-pulse" />
                  Group II (Papers 14 to 16)
                </span>
                <span className="text-xs font-mono text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full">300 Marks</span>
              </h2>
              <div className="space-y-4">
                {group2.map(paper => (
                  <Link
                    key={paper.id}
                    to={`/courses/ca/final/paper-${paper.id}`}
                    className="group/btn relative w-full p-5 rounded-2xl bg-neutral-950 hover:bg-neutral-900/60 border border-neutral-850 hover:border-[#20b2aa]/40 text-left flex flex-col justify-between shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[#20b2aa]/5 gap-3"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0 mt-0.5">
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
                    <div className="pt-2 border-t border-neutral-850 flex items-center justify-between text-xs text-teal-400 font-semibold">
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

export default CAFinalPapers;
