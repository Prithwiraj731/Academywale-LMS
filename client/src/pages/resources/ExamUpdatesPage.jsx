import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Calendar, 
  CheckCircle,
  FileCheck,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { educationalArticles } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function ExamUpdatesPage() {
  const updateArticles = educationalArticles.filter(a => a.category === 'exam-updates' || a.tags.includes('Exam Rules') || a.tags.includes('Passing Criteria'));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>ICAI & ICMAI OFFICIAL EXAM GUIDELINES & UPDATES</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Exam Updates & <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">Passing Regulations</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Essential official regulations, 40% individual and 50% group aggregate passing standards, exemption validity rules, and syllabus transition guidelines for CA and CMA.
          </p>
        </div>

        {/* Quick Rules Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 uppercase">Criterion 1</span>
              <CheckCircle className="w-4 h-4 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-white">40% Minimum per Subject</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A candidate must score at least 40 marks out of 100 in each individual paper of a group to qualify for aggregate consideration.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase">Criterion 2</span>
              <CheckCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-lg font-bold text-white">50% Group Aggregate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A cumulative score of minimum 50% across all papers in the group is mandatory (e.g., 150/300 for 3-paper group; 200/400 for 4-paper group).
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase">Criterion 3</span>
              <CheckCircle className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white">60+ Exemption Carry-Forward</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scoring 60% or more in any paper grants a 3-term exemption, provided the student appeared in all papers of that group.
            </p>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-cyan-400 w-5 h-5" />
            <span>Detailed Regulatory Guides & Notifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {updateArticles.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {article.level}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-1 transition-all"
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
