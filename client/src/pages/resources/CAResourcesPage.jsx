import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Calendar,
  Layers,
  Award,
  Sparkles
} from 'lucide-react';
import { educationalArticles, examSyllabusBlueprints } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function CAResourcesPage() {
  const caArticles = educationalArticles.filter(a => a.category === 'ca');
  const blueprint = examSyllabusBlueprints.ca;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-teal-400" />
            <span>CHARTERED ACCOUNTANCY (ICAI) RESOURCE HUB</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            CA Examination <span className="bg-gradient-to-r from-[#20b2aa] via-teal-300 to-amber-300 bg-clip-text text-transparent">Preparation Hub</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Curated preparation roadmaps, high-weightage topic analyses, and chapter-wise study notes aligned with the ICAI New Scheme of Education and Training.
          </p>
        </div>

        {/* Level Quick Nav */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-teal-400 font-extrabold text-xs uppercase tracking-wider">Foundation Stage</div>
            <h3 className="text-lg font-bold text-white">CA Foundation</h3>
            <p className="text-xs text-slate-400">4 Papers • Entry level testing for commerce and non-commerce stream students.</p>
            <div className="pt-2 flex gap-2">
              <Link to="/ca/foundation-papers" className="text-xs text-teal-400 hover:underline font-bold">View Papers →</Link>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-teal-400 font-extrabold text-xs uppercase tracking-wider">Intermediate Stage</div>
            <h3 className="text-lg font-bold text-white">CA Intermediate</h3>
            <p className="text-xs text-slate-400">6 Papers (Group 1 & 2) • Core corporate accounting, law, audit & taxation.</p>
            <div className="pt-2 flex gap-2">
              <Link to="/ca/inter-papers" className="text-xs text-teal-400 hover:underline font-bold">View Papers →</Link>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="text-teal-400 font-extrabold text-xs uppercase tracking-wider">Final Stage</div>
            <h3 className="text-lg font-bold text-white">CA Final</h3>
            <p className="text-xs text-slate-400">6 Papers (Group 1 & 2) • Advanced financial reporting, international tax & AFM.</p>
            <div className="pt-2 flex gap-2">
              <Link to="/ca/final-papers" className="text-xs text-teal-400 hover:underline font-bold">View Papers →</Link>
            </div>
          </div>
        </div>

        {/* ICAI New Scheme Syllabus Architecture Breakdown */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="text-teal-400 w-5 h-5" />
            <span>ICAI New Scheme Structure & Paper Blueprint</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CA Foundation Breakdown */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-lg">CA Foundation Papers</h3>
                <span className="text-xs text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full">400 Total Marks</span>
              </div>
              <div className="space-y-3">
                {blueprint.foundation.papers.map((p) => (
                  <div key={p.paperNumber} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-300">Paper {p.paperNumber}: {p.name}</span>
                      <span className="text-slate-400 font-mono">{p.marks}M • {p.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.keyFocus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CA Inter Breakdown */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-white text-lg">CA Intermediate Groups</h3>
                <span className="text-xs text-teal-400 font-bold bg-teal-500/10 px-2.5 py-1 rounded-full">600 Total Marks (6 Papers)</span>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300">Group 1:</div>
                {blueprint.inter.group1.map((p) => (
                  <div key={p.paperNumber} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-300">Paper {p.paperNumber}: {p.name}</span>
                      <span className="text-slate-400 font-mono">{p.marks}M</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.keyFocus}</p>
                  </div>
                ))}

                <div className="text-xs font-bold text-slate-300 pt-2">Group 2:</div>
                {blueprint.inter.group2.map((p) => (
                  <div key={p.paperNumber} className="bg-slate-950/60 p-3 rounded-xl border border-slate-850 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-teal-300">Paper {p.paperNumber}: {p.name}</span>
                      <span className="text-slate-400 font-mono">{p.marks}M</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{p.keyFocus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CA Specific Educational Guides */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="text-teal-400 w-5 h-5" />
            <span>Featured CA Study Guides & Subject Blueprints</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caArticles.map((article) => (
              <article
                key={article.id}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                      {article.level}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 group-hover:translate-x-1 transition-all"
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
