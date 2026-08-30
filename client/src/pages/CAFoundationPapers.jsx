import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import { FaBookOpen, FaChevronRight, FaGraduationCap, FaCheckCircle, FaAward } from 'react-icons/fa';

const papers = [
  { 
    id: 1, 
    title: 'Principles and Practice of Accounting',
    desc: 'Accounting Standards, Partnership Accounts, Final Accounts of NPO, Company Accounts, Consignment and BRS.'
  },
  { 
    id: 2, 
    title: 'Business Laws and Business Correspondence and Reporting',
    desc: 'Indian Contract Act 1872, Sale of Goods Act 1930, Indian Partnership Act 1932, LLP Act 2008, and Companies Act 2013.'
  },
  { 
    id: 3, 
    title: 'Business Mathematics, Logical Reasoning & Statistics',
    desc: 'Commercial Mathematics, Time Value of Money, Permutations/Combinations, Logical Reasoning, and Measures of Central Tendency.'
  },
  { 
    id: 4, 
    title: 'Business Economics & Business and Commercial Knowledge',
    desc: 'Microeconomics, Price Determination in Different Markets, Business Cycles, National Income, and Commercial Policies.'
  },
];

const CAFoundationPapers = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden font-sans">
      {/* Premium top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none z-0" />
      
      <main className="relative z-10 flex-grow container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <BackButton />

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <FaGraduationCap /> ICAI New Scheme of Education & Training
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            CA Foundation Papers & Curriculum
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            CA Foundation consists of 4 papers totaling 400 marks. Candidates must score minimum 40% in each individual paper and 50% in the cumulative aggregate (200/400) to qualify.
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
              <div className="text-xs font-bold text-slate-300">Aggregate Requirement</div>
              <div className="text-sm font-extrabold text-cyan-300">200 / 400 Marks (50%)</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaBookOpen className="text-amber-400 text-lg shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-300">Free Study Guides</div>
              <Link to="/resources/ca" className="text-xs font-bold text-amber-400 hover:underline">View CA Study Hub →</Link>
            </div>
          </div>
        </div>
        
        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {papers.map(paper => (
            <Link
              key={paper.id}
              to={`/courses/ca/foundation/paper-${paper.id}`}
              className="group/btn relative w-full p-6 rounded-2xl bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 hover:border-[#20b2aa]/40 text-left flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[#20b2aa]/5 gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-850 flex items-center justify-center text-[#20b2aa] group-hover/btn:bg-[#20b2aa]/10 transition-colors shrink-0 mt-0.5">
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
              
              <div className="pt-3 border-t border-neutral-850 flex items-center justify-between text-xs text-teal-400 font-semibold">
                <span>Explore Classes & Syllabus</span>
                <FaChevronRight className="group-hover/btn:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>

        {/* Free CA Foundation Resources Link */}
        <div className="bg-gradient-to-r from-teal-950/40 via-neutral-900 to-neutral-900 border border-teal-500/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Need Free CA Foundation Revision Notes & MCQs?</h4>
            <p className="text-xs text-slate-400">Access chapter-wise accounting blueprints, time value of money formulas, and law answer writing templates.</p>
          </div>
          <Link
            to="/resources/ca"
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0"
          >
            Access Free Notes
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CAFoundationPapers;