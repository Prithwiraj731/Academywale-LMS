import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Calendar,
  CheckCircle,
  Timer,
  Award,
  Sparkles
} from 'lucide-react';
import { educationalArticles } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function ExamPrepPage() {
  const prepArticles = educationalArticles.filter(a => a.category === 'exam-preparation' || a.tags.includes('Exam Strategy') || a.tags.includes('Time Management'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>EXAM STRATEGY, TIME MANAGEMENT & MENTAL PREPARATION</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            CA & CMA <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-300 bg-clip-text text-transparent">Exam Strategies</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Professional exams test stamina and execution as much as knowledge. Master the 15-minute reading strategy, 1.8-minute per mark rule, working note presentation, and biological exam clock conditioning.
          </p>
        </div>

        {/* 4 Pillars of Exam Success */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">15m</div>
            <h3 className="text-lg font-bold text-white">15-Min Reading Strategy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify the 1 question to leave out and rank the remaining 4 questions in order of maximum conceptual confidence.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold">1.8m</div>
            <h3 className="text-lg font-bold text-white">1.8-Min per Mark Rule</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never get stuck on an untallied balance sheet. Cap every 10-mark question at 18 minutes to ensure full 100-mark attempts.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold">WN</div>
            <h3 className="text-lg font-bold text-white">Working Notes Protocol</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Show explicitly numbered working notes cross-referenced in main financial statements to capture 30-40% step marks.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold">2-5</div>
            <h3 className="text-lg font-bold text-white">Biological Exam Clock</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Train your peak alertness strictly between 2:00 PM and 5:00 PM daily during the final 30 days of revision.
            </p>
          </div>
        </div>

        {/* Strategy Articles */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-amber-400 w-5 h-5" />
            <span>Featured Strategy Masterclasses</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prepArticles.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {article.level}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-1 transition-all"
                  >
                    Read Masterclass <ArrowRight className="w-3.5 h-3.5" />
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
