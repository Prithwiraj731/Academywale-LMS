import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Calculator, 
  FileQuestion, 
  HelpCircle, 
  Award, 
  Scale, 
  AlertTriangle 
} from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studyHours, setStudyHours] = useState(20);

  // CA/CMA Exam & Accounting themed quiz questions
  const quizOptions = [
    {
      id: 'A',
      option: 'I got lost in the infinite CA/CMA syllabus.',
      feedback: '📚 Relatable! The syllabus is indeed larger than our database. Let\'s get you back to a topic that actually has video lectures!',
      icon: BookOpen,
      color: 'from-blue-500/10 to-blue-600/10 border-blue-500/30 text-blue-700'
    },
    {
      id: 'B',
      option: 'My balance sheet didn\'t tally, so I ran away.',
      feedback: '⚖️ Standard accounting protocol! We have created a "Suspense Account" to hide this 404 error code. Nobody will notice... except the auditor.',
      icon: Scale,
      color: 'from-amber-500/10 to-amber-600/10 border-amber-500/30 text-amber-700'
    },
    {
      id: 'C',
      option: 'I\'m conducting audit checks for missing pages.',
      feedback: '🔎 Audit Report: Qualified opinion. The page is verified as missing, and internal controls have failed. 10/10 for professional skepticism!',
      icon: FileQuestion,
      color: 'from-emerald-500/10 to-emerald-600/10 border-emerald-500/30 text-emerald-700'
    },
    {
      id: 'D',
      option: 'I clicked a broken link (and I demand grace marks).',
      feedback: '🎓 Grace marks denied by the ICAI/ICMAI examiners! However, we will grant you a free redirection back to safety.',
      icon: Award,
      color: 'from-purple-500/10 to-purple-600/10 border-purple-500/30 text-purple-700'
    }
  ];

  // Dynamic Passing Odds Calculator outputs
  const getPassingOdds = (hours) => {
    if (hours < 40) {
      return {
        percentage: `${(hours * 0.5).toFixed(1)}%`,
        message: '⚠️ Below passing marks! Get off the 404 page and go back to lectures!',
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200'
      };
    } else if (hours < 75) {
      return {
        percentage: `${(40 + (hours - 40) * 1.2).toFixed(1)}%`,
        message: '✍️ Passing aggregate zone. Decent, but the examiner is watching. Revise more!',
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 border-yellow-200'
      };
    } else if (hours < 95) {
      return {
        percentage: `${(82 + (hours - 75) * 0.8).toFixed(1)}%`,
        message: '🔥 Rank-holder vibes! You are solid. Just don\'t write 404 on your exam sheets.',
        color: 'text-teal-600',
        bg: 'bg-teal-50 border-teal-200'
      };
    } else {
      return {
        percentage: '99.9%',
        message: '🏆 Outstanding! Even the syllabus is scared of you. Go back and claim your degree!',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200'
      };
    }
  };

  const currentOdds = getPassingOdds(studyHours);

  return (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-slate-50 via-[#e0f7f4]/20 to-slate-100 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 overflow-hidden font-body">
      
      {/* Floating Animated Background Blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#20b2aa]/10 rounded-full filter blur-3xl animate-blob pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300/10 rounded-full filter blur-3xl animate-blob animation-delay-2000 pointer-events-none" />
      
      <div className="relative z-10 max-w-5xl w-full bg-white/70 backdrop-blur-md border border-[#20b2aa]/15 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 md:p-12">
        
        {/* Main Header grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Big Error, Visuals, Copy */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start space-y-6">
            
            {/* SVG Animated Confused Calculator */}
            <motion.div
              initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', duration: 1 }}
              className="relative w-44 h-44 sm:w-48 sm:h-48"
            >
              {/* Floating question marks */}
              <motion.div
                animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute top-2 left-6 text-[#20b2aa] font-bold text-2xl"
              >
                ?
              </motion.div>
              <motion.div
                animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.7 }}
                className="absolute -top-4 right-10 text-purple-400 font-bold text-3xl"
              >
                ?!
              </motion.div>

              <svg viewBox="0 0 200 220" className="w-full h-full text-[#20b2aa]" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Shadow */}
                <ellipse cx="100" cy="205" rx="70" ry="10" fill="rgba(0,0,0,0.06)" />
                {/* Calculator Body */}
                <rect x="20" y="20" width="160" height="180" rx="24" fill="white" stroke="currentColor" strokeWidth="6" className="filter drop-shadow-md" />
                <rect x="25" y="25" width="150" height="170" rx="19" fill="#20b2aa" fillOpacity="0.05" />
                {/* Screen */}
                <rect x="36" y="36" width="128" height="46" rx="10" fill="#1e293b" />
                {/* Glowing 404 Text */}
                <text x="100" y="69" fill="#20b2aa" fontSize="30" fontWeight="800" textAnchor="middle" fontFamily="monospace" letterSpacing="4">
                  404
                </text>
                {/* Eyes - confused spins */}
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                  originX="100"
                  originY="115"
                >
                  <circle cx="75" cy="115" r="9" fill="#1e293b" />
                  <circle cx="77" cy="113" r="3" fill="white" />
                  <circle cx="125" cy="115" r="9" fill="#1e293b" />
                  <circle cx="127" cy="113" r="3" fill="white" />
                </motion.g>
                {/* Confused/Worried eyebrows */}
                <path d="M 60 102 Q 75 97 86 104" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M 114 104 Q 125 97 140 102" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Wobbling nervous mouth */}
                <motion.path 
                  animate={{ d: [
                    "M 85 145 Q 100 132 115 145",
                    "M 85 142 Q 100 137 115 142",
                    "M 85 145 Q 100 132 115 145"
                  ]}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" 
                />
                {/* Keyboard buttons */}
                <rect x="42" y="156" width="22" height="13" rx="4" fill="currentColor" fillOpacity="0.2" />
                <rect x="72" y="156" width="22" height="13" rx="4" fill="currentColor" fillOpacity="0.2" />
                <rect x="102" y="156" width="22" height="13" rx="4" fill="currentColor" fillOpacity="0.2" />
                <rect x="132" y="156" width="22" height="13" rx="4" fill="currentColor" fillOpacity="0.2" />
                <rect x="42" y="176" width="22" height="13" rx="4" fill="currentColor" fillOpacity="0.2" />
                <rect x="72" y="176" width="22" height="13" rx="4" fill="currentColor" fillOpacity="0.2" />
                <rect x="102" y="176" width="52" height="13" rx="4" fill="#20b2aa" />
              </svg>
            </motion.div>

            {/* Error messaging */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                <AlertTriangle size={13} /> AUDIT FINDING: MISSING PAGE
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Balance Sheet <span className="text-[#20b2aa]">Out of Tally!</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-500 max-w-sm">
                We audited our server database but this page has skipped the class or got filed into the Suspense Account.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#20b2aa] hover:bg-teal-600 text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <Home size={16} /> Tally Sheet (Go Home)
              </button>
              <button
                onClick={() => navigate('/courses/all')}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-teal-50/30 text-[#20b2aa] border border-[#20b2aa]/30 font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <BookOpen size={16} /> Check Syllabus (Courses)
              </button>
            </div>

          </div>

          {/* Right Column: Interactive Quiz & Calculator */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Surprise Quiz box */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="text-[#20b2aa] w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  🚨 SURPRISE TEST: Where did the page go?
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Select an option below to tally your concept score.
              </p>

              {/* Quiz grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quizOptions.map((opt) => {
                  const QuizIcon = opt.icon;
                  const isSelected = selectedQuiz === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedQuiz(isSelected ? null : opt.id)}
                      className={`flex items-start text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#20b2aa] border-[#20b2aa] text-white shadow-md scale-102' 
                          : 'bg-white hover:bg-teal-50/10 border-gray-200 text-gray-700 hover:border-[#20b2aa]/30'
                      }`}
                    >
                      <QuizIcon className={`w-4 h-4 mr-2.5 mt-0.5 shrink-0 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                      <div>
                        <span className="block font-bold text-xxs tracking-wider uppercase mb-0.5 opacity-60">Option {opt.id}</span>
                        <span>{opt.option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quiz Feedback display */}
              <AnimatePresence mode="wait">
                {selectedQuiz && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm ${
                      quizOptions.find(o => o.id === selectedQuiz)?.color
                    }`}
                  >
                    <p className="font-semibold leading-relaxed">
                      {quizOptions.find(o => o.id === selectedQuiz)?.feedback}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Passing Odds Slider widget */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="text-[#20b2aa] w-5 h-5 shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  📈 Syllabus Completion vs. Passing Odds
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                Slide to estimate your passing probability while staying on this 404 page.
              </p>

              {/* Slider Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                  <span>Syllabus Covered:</span>
                  <span className="text-[#20b2aa] text-sm bg-teal-50 px-2 py-0.5 rounded-md">{studyHours}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={studyHours}
                  onChange={(e) => setStudyHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#20b2aa]"
                />
              </div>

              {/* Result output display */}
              <motion.div 
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`p-4 rounded-xl border ${currentOdds.bg} transition-colors duration-350`}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Passing Probability:</span>
                  <span className={`text-2xl font-black ${currentOdds.color}`}>{currentOdds.percentage}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 mt-1">
                  {currentOdds.message}
                </p>
              </motion.div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
