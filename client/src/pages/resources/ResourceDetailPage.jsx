import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  User, 
  CheckCircle, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  FileText, 
  ChevronRight, 
  Sparkles,
  Award,
  GraduationCap,
  Layers
} from 'lucide-react';
import { educationalArticles } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function ResourceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const article = educationalArticles.find(a => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      document.title = `${article.title} | AcademyWale Learning Hub`;
    }
  }, [article, slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <BookOpen className="w-12 h-12 text-teal-400 mx-auto" />
          <h2 className="text-2xl font-bold">Resource Not Found</h2>
          <p className="text-sm text-slate-400">The study guide or article you're looking for doesn't exist or has moved.</p>
          <button
            onClick={() => navigate('/resources')}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition-all"
          >
            Back to Learning Hub
          </button>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const relatedArticles = educationalArticles.filter(a => a.id !== article.id && (a.category === article.category || a.level === article.level)).slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-8">
        
        {/* Navigation & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-teal-400">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/resources" className="hover:text-teal-400">Learning Hub</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/resources/${article.category}`} className="hover:text-teal-400 uppercase">{article.category}</Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Article Header Card */}
        <header className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full font-bold text-xs bg-teal-500/10 text-teal-300 border border-teal-500/30">
              {article.level}
            </span>
            {article.paper && (
              <span className="px-3 py-1 rounded-full font-mono text-xs bg-slate-800 text-slate-300 border border-slate-700">
                {article.paper}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {article.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {article.description}
          </p>

          {/* Author & Meta Row */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-white">{article.author}</div>
                <div className="text-[11px] text-slate-500">AcademyWale Academic Advisory</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" /> {article.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-400" /> Updated {article.lastUpdated}
              </span>
            </div>
          </div>
        </header>

        {/* Key Takeaways Callout Box */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-900 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-teal-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <span>Key Takeaways & Exam Pointers</span>
            </h2>
            <ul className="space-y-2.5">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Syllabus Breakdown Table (if present) */}
        {article.syllabusCoverage && article.syllabusCoverage.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-400" />
              <span>Chapter-Wise Syllabus Weightage & Module Coverage</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse rounded-xl overflow-hidden border border-slate-800">
                <thead>
                  <tr className="bg-slate-800 text-slate-300 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-4 w-1/3">Module / Topic Area</th>
                    <th className="py-3 px-4 w-1/6">Weightage</th>
                    <th className="py-3 px-4 w-1/2">Key Concepts & Focus Topics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/50">
                  {article.syllabusCoverage.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-teal-300 align-top">{item.module}</td>
                      <td className="py-3.5 px-4 text-amber-300 font-mono font-bold align-top">{item.weightage}</td>
                      <td className="py-3.5 px-4 text-slate-300 align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {item.topics.map((t, tIdx) => (
                            <span key={tIdx} className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-xs">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Article Body Sections */}
        <main className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-10 shadow-xl">
          {article.sections && article.sections.map((section, sIdx) => (
            <section key={sIdx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight text-teal-200 border-b border-slate-800 pb-2">
                {section.heading}
              </h2>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {section.content}
              </div>
            </section>
          ))}
        </main>

        {/* Contextual Course Recommendation Banner */}
        {article.relatedCourses && article.relatedCourses.length > 0 && (
          <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Related Video Classes</span>
              <h3 className="text-xl font-bold text-white">{article.relatedCourses[0].title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Looking for complete structured classes? Learn from India's top CA & CMA faculties with updated ICMAI/ICAI study material and test series.
              </p>
            </div>
            <Link
              to="/courses/all"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all shrink-0"
            >
              Browse All Courses
            </Link>
          </div>
        )}

        {/* Related Educational Guides */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="text-teal-400 w-5 h-5" />
              <span>Related Free Study Guides</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/resources/articles/${rel.slug}`}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all block group space-y-2 shadow-md"
                >
                  <span className="text-[11px] font-bold text-teal-400 uppercase">{rel.level}</span>
                  <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {rel.readTime}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
