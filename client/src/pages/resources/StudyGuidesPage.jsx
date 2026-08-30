import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Calendar,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { educationalArticles } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function StudyGuidesPage() {
  const studyGuides = educationalArticles.filter(a => a.subCategory === 'study-guides' || a.tags.includes('Study Plan') || a.tags.includes('Accounting') || a.tags.includes('Taxation') || a.tags.includes('Cost Accounting'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>SUBJECT STUDY GUIDES & CURRICULUM BLUEPRINTS</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Subject-Wise <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">Study Guides</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            In-depth academic guides detailing chapter weightages, practical problem presentation, working note conventions, and common pitfalls to avoid in CA and CMA papers.
          </p>
        </div>

        {/* Core Subject Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold">01</div>
            <h3 className="text-xl font-bold text-white">Financial & Advanced Accounting</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Master AS/Ind AS compliance, consolidation of accounts, partnership dissolution, and presentation of profit & loss and balance sheets for step marks.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold">02</div>
            <h3 className="text-xl font-bold text-white">Taxation & GST Laws</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Step-by-step computation of total income, PGBP deductions, capital gain exemptions, and GST Input Tax Credit (ITC) eligibility under Section 16 & 17.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">03</div>
            <h3 className="text-xl font-bold text-white">Cost & Management Accounting</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Quantitative mastery over standard costing variances, marginal costing break-even analysis, process costing equivalent units, and budgetary control.
            </p>
          </div>
        </div>

        {/* Guides List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-emerald-400 w-5 h-5" />
            <span>Comprehensive Subject Blueprints</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGuides.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {article.level}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 group-hover:translate-x-1 transition-all"
                  >
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
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
