import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Calendar,
  CheckCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';
import { educationalArticles } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function RevisionNotesPage() {
  const notesArticles = educationalArticles.filter(a => a.category === 'notes' || a.subCategory === 'notes' || a.tags.includes('Notes') || a.tags.includes('Formulas') || a.tags.includes('Ind AS 115'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>QUICK REVISION NOTES, FORMULA SHEETS & CHEAT SHEETS</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            High-Yield <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-teal-300 bg-clip-text text-transparent">Revision Notes</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Condensed formula sheets, Ind AS summary tables, Cost Accounting variance models, and tax deduction thresholds designed for the final 1.5-day exam revision crunch.
          </p>
        </div>

        {/* Highlighted Cheat Sheet Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">Ind AS</div>
            <h3 className="text-lg font-bold text-white">Ind AS 115, 116, 109, 103</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              5-Step Revenue recognition framework, Lessee ROU asset vs liability measurement, Financial instrument business model tests, and purchase price allocation.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 font-bold">SFM</div>
            <h3 className="text-lg font-bold text-white">SFM Derivatives & Forex</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interest Rate Parity (IRP), Purchasing Power Parity (PPP), Black-Scholes 5-variable model, and Sharpe/Treynor/Jensen portfolio performance metrics.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold">GST</div>
            <h3 className="text-lg font-bold text-white">GST Section 16 & 17(5) Blocked ITC</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Motor vehicle exceptions, food/beverage credit rules, work contract restrictions, and Rule 42/43 input credit reversal mechanisms.
            </p>
          </div>
        </div>

        {/* Notes Articles List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-purple-400 w-5 h-5" />
            <span>Available Revision Cheat Sheets</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notesArticles.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                      {article.level}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                    <Link to={`/resources/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Updated {article.lastUpdated}
                  </span>
                  <Link
                    to={`/resources/articles/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-purple-300 group-hover:translate-x-1 transition-all"
                  >
                    View Cheat Sheet <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
