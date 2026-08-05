import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaClipboardCheck, 
  FaRocket, 
  FaChartLine, 
  FaUserGraduate, 
  FaBell, 
  FaArrowLeft, 
  FaCheckCircle,
  FaFileAlt
} from 'react-icons/fa';

export default function TestSeriesPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail('');
    }
  };

  const features = [
    {
      icon: <FaClipboardCheck className="text-3xl text-teal-400" />,
      title: "Chapter-Wise & Mock Tests",
      description: "Comprehensive test series covering chapter-wise assessments and full syllabus mock exams designed strictly according to ICAI & ICMAI standards."
    },
    {
      icon: <FaChartLine className="text-3xl text-indigo-400" />,
      title: "Performance Analytics",
      description: "Get detailed insights into your speed, accuracy, and weak areas with granular analytics after every submitted test."
    },
    {
      icon: <FaUserGraduate className="text-3xl text-blue-400" />,
      title: "Expert Faculty Evaluation",
      description: "Your answer sheets will be checked and evaluated by top experienced faculties with personalized feedback to boost your rank."
    },
    {
      icon: <FaFileAlt className="text-3xl text-amber-400" />,
      title: "Suggested Answer Keys",
      description: "Step-by-step suggested answers, marking schemes, and toppers' answer sheets provided for thorough self-assessment."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Navigation / Back Button */}
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-teal-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 px-4 py-2 rounded-xl transition-all shadow-md backdrop-blur-md"
          >
            <FaArrowLeft className="text-xs" /> Back to Home
          </Link>
          <span className="text-xs font-mono tracking-widest text-teal-400/80 uppercase font-semibold bg-teal-950/60 border border-teal-500/30 px-3 py-1 rounded-full">
            AcademyWale • Prep Portal
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-3xl mx-auto pt-6">
          {/* Launch Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-blue-500/10 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-inner">
            <FaRocket className="text-teal-400 animate-bounce" />
            <span>CA & CMA Test Series Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none">
            Test Series Will Be{' '}
            <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
              Coming Soon
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            We are engineering an ultra-responsive, realistic exam environment tailored for CA & CMA students. 
            Get ready for chapter-wise evaluation, ranker feedback, and full-length mock tests to clear your exams in the first attempt.
          </p>

          {/* Email Subscription Form */}
          <div className="pt-4 max-w-md mx-auto">
            {submitted ? (
              <div className="bg-teal-500/20 border border-teal-400/50 text-teal-200 px-5 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg backdrop-blur-md">
                <FaCheckCircle className="text-teal-400 text-lg shrink-0" />
                <span className="text-sm font-semibold">Thank you! We'll notify you as soon as the Test Series launches.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md">
                <input
                  type="email"
                  required
                  placeholder="Enter your email to get early access..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-teal-500/25 flex items-center justify-center gap-2 shrink-0"
                >
                  <FaBell /> Notify Me
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {features.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 hover:border-slate-600 p-6 rounded-2xl transition-all duration-300 shadow-xl backdrop-blur-md group hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-900/60 rounded-xl w-fit border border-slate-700/60 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-teal-900/40 via-indigo-900/40 to-slate-900/40 border border-teal-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Need Online Classes or Study Material Right Now?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Explore our comprehensive Video Lectures, Pendrive Batches, and ICMAI / ICAI study materials available from India's top faculties.
          </p>
          <div className="pt-2">
            <Link
              to="/courses/all"
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-teal-50 font-bold text-sm px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-white/10 hover:scale-105"
            >
              Explore All Courses
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
