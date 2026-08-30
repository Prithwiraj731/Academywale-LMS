import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { educationalArticles, examSyllabusBlueprints } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function CMAResourcesPage() {
  const cmaArticles = educationalArticles.filter(a => a.category === 'cma');
  const blueprint = examSyllabusBlueprints.cma;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-blue-400" />
            <span>COST & MANAGEMENT ACCOUNTANCY (ICMAI) RESOURCE HUB</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            CMA Examination <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">Preparation Hub</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Master ICMAI Syllabus 2022. Expert resources for Cost Accounting, Financial Management, Direct & Indirect Taxes, Strategic Management, and Cost Audits.
          </p>
        </div>

        {/* Level Quick Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-blue-400 font-extrabold text-xs uppercase tracking-wider">Foundation Level</div>
            <h3 className="text-lg font-bold text-white">CMA Foundation</h3>
            <p className="text-xs text-slate-400">Papers 1 to 4 • Fundamentals of Law, Accounting, Mathematics & Economics.</p>
            <div className="pt-2 flex gap-2">
              <Link to="/cma/foundation-papers" className="text-xs text-blue-400 hover:underline font-bold">View Papers →</Link>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-blue-400 font-extrabold text-xs uppercase tracking-wider">Intermediate Level</div>
            <h3 className="text-lg font-bold text-white">CMA Intermediate</h3>
            <p className="text-xs text-slate-400">Papers 5 to 12 (Group 1 & 2) • Cost accounting, corporate law, tax & operations.</p>
            <div className="pt-2 flex gap-2">
              <Link to="/cma/inter-papers" className="text-xs text-blue-400 hover:underline font-bold">View Papers →</Link>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-blue-400 font-extrabold text-xs uppercase tracking-wider">Final Level</div>
            <h3 className="text-lg font-bold text-white">CMA Final</h3>
            <p className="text-xs text-slate-400">Papers 13 to 20 (Group 3 & 4) • Strategic Cost Management, SFM & Cost Audit.</p>
            <div className="pt-2 flex gap-2">
              <Link to="/cma/final-papers" className="text-xs text-blue-400 hover:underline font-bold">View Papers →</Link>
            </div>
          </div>
        </div>

        {/* ICMAI Syllabus Structure Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="text-blue-400 w-5 h-5" />
            <span>ICMAI Syllabus 2022 Structure & Paper Matrix</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CMA Inter Structure */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-lg">CMA Intermediate Groups</h3>
                <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full">800 Total Marks (8 Papers)</span>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300">Group 1 (Papers 5-8):</div>
                {blueprint.inter.group1.map((p) => (
                  <div key={p.paperNumber} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">Paper {p.paperNumber}: {p.name}</span>
                      <span className="text-slate-400 font-mono">{p.marks}M</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.keyFocus}</p>
                  </div>
                ))}

                <div className="text-xs font-bold text-slate-300 pt-2">Group 2 (Papers 9-12):</div>
                {blueprint.inter.group2.map((p) => (
                  <div key={p.paperNumber} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">Paper {p.paperNumber}: {p.name}</span>
                      <span className="text-slate-400 font-mono">{p.marks}M</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.keyFocus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CMA Final Structure */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-lg">CMA Final Groups</h3>
                <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full">800 Total Marks (8 Papers)</span>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300">Group 3 (Papers 13-16):</div>
                {blueprint.final.group1.map((p) => (
                  <div key={p.paperNumber} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">Paper {p.paperNumber}: {p.name}</span>
                      <span className="text-slate-400 font-mono">{p.marks}M</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.keyFocus}</p>
                  </div>
                ))}

                <div className="text-xs font-bold text-slate-300 pt-2">Group 4 (Papers 17-20):</div>
                {blueprint.final.group2.map((p) => (
                  <div key={p.paperNumber} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-300">Paper {p.paperNumber}: {p.name}</span>
                      <span className="text-slate-400 font-mono">{p.marks}M</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.keyFocus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CMA Specific Educational Guides */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-blue-400 w-5 h-5" />
            <span>Featured CMA Study Guides & Preparation Notes</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cmaArticles.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30">
                      {article.level}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-all"
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
