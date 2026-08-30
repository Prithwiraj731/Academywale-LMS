import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  FileText, 
  Compass, 
  Bookmark, 
  HelpCircle, 
  Bell, 
  Search, 
  ArrowRight, 
  Clock, 
  Calendar, 
  CheckCircle,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { educationalArticles, resourceCategories, practiceMCQSets } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function LearningHubPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return educationalArticles.filter(article => {
      const matchesCategory = selectedCategory === 'all' || 
        article.category === selectedCategory || 
        article.subCategory === selectedCategory;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query)) ||
        article.level.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredArticles = educationalArticles.filter(a => a.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[500px] h-[400px] bg-blue-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>FREE EDUCATIONAL RESOURCES</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            AcademyWale <span className="bg-gradient-to-r from-[#20b2aa] via-teal-300 to-amber-300 bg-clip-text text-transparent">Learning Hub</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Free, high-yield study resources, curriculum blueprints, step-by-step revision strategies, and MCQ practice designed specifically for CA & CMA aspirants across India.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subject guides, MCQs, GST, Costing, Ind AS..."
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 shadow-xl transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Link
            to="/resources/ca"
            className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 p-4 rounded-2xl transition-all duration-300 group text-center flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-teal-300">CA Resources</span>
            <span className="text-[11px] text-slate-400">Foundation, Inter & Final</span>
          </Link>

          <Link
            to="/resources/cma"
            className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 p-4 rounded-2xl transition-all duration-300 group text-center flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-300">CMA Resources</span>
            <span className="text-[11px] text-slate-400">ICMAI Syllabus Hub</span>
          </Link>

          <Link
            to="/resources/study-guides"
            className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 p-4 rounded-2xl transition-all duration-300 group text-center flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300">Study Guides</span>
            <span className="text-[11px] text-slate-400">Subject Blueprints</span>
          </Link>

          <Link
            to="/resources/exam-preparation"
            className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 p-4 rounded-2xl transition-all duration-300 group text-center flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300">Exam Strategy</span>
            <span className="text-[11px] text-slate-400">Time & Score Boost</span>
          </Link>

          <Link
            to="/resources/notes"
            className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 p-4 rounded-2xl transition-all duration-300 group text-center flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-purple-300">Revision Notes</span>
            <span className="text-[11px] text-slate-400">Formulas & Ind AS</span>
          </Link>

          <Link
            to="/resources/mcqs"
            className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 p-4 rounded-2xl transition-all duration-300 group text-center flex flex-col items-center justify-center space-y-2 shadow-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-white group-hover:text-rose-300">MCQ Practice</span>
            <span className="text-[11px] text-slate-400">With Rationales</span>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800 pt-2">
          {resourceCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resource Articles Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="text-teal-400 w-5 h-5" />
              <span>Available Educational Guides & Articles ({filteredArticles.length})</span>
            </h2>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    {/* Level Badge and Read Time */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-3 py-1 rounded-full font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        {article.level}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {article.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                      <Link to={`/resources/articles/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    {/* Paper Identifier */}
                    {article.paper && (
                      <div className="text-xs font-semibold text-teal-400/90 font-mono">
                        {article.paper}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {article.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
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
          ) : (
            <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800">
              <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No resources found</h3>
              <p className="text-sm text-slate-400 mb-4">Try clearing your search query or selecting another category.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
              >
                Show All Resources
              </button>
            </div>
          )}
        </div>

        {/* Bottom Banner: Free Interactive Practice */}
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/60 border border-teal-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" /> Real-time Knowledge Testing
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Try Interactive MCQ Practice Sets
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Sharpen your speed and conceptual understanding with chapter-wise MCQs covering Accounting Standards, GST block credits, and Costing formulas with full answer rationales.
            </p>
          </div>
          <Link
            to="/resources/mcqs"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all shrink-0"
          >
            Start Free MCQ Practice <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
