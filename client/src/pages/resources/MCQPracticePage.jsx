import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  GraduationCap, 
  Award, 
  Info,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { practiceMCQSets } from '../../data/resourcesData';
import BackButton from '../../components/common/BackButton';

export default function MCQPracticePage() {
  const [activeSetId, setActiveSetId] = useState(practiceMCQSets[0].id);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanations, setShowExplanations] = useState({});

  const currentSet = practiceMCQSets.find(s => s.id === activeSetId) || practiceMCQSets[0];

  const handleSelectOption = (questionId, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [`${activeSetId}-${questionId}`]: optionIndex
    }));
    setShowExplanations(prev => ({
      ...prev,
      [`${activeSetId}-${questionId}`]: true
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanations({});
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 space-y-10">
        
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
            <HelpCircle className="w-4 h-4 text-rose-400" />
            <span>INTERACTIVE CA & CMA MCQ PORTAL</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Chapter-Wise <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">MCQ Practice</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Test your conceptual grasp with examination-standard multiple choice questions. Receive instant feedback, scoring, and detailed step-by-step statutory rationales.
          </p>
        </div>

        {/* Set Selector Tabs */}
        <div className="flex flex-wrap gap-2.5 justify-center border-b border-slate-800 pb-4">
          {practiceMCQSets.map((set) => (
            <button
              key={set.id}
              onClick={() => setActiveSetId(set.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeSetId === set.id
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {set.category === 'ca' ? <GraduationCap className="w-4 h-4" /> : <Award className="w-4 h-4" />}
              <span>{set.subject}</span>
            </button>
          ))}
        </div>

        {/* Active Quiz Card Container */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">{currentSet.level} • {currentSet.category.toUpperCase()}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">{currentSet.title}</h2>
            </div>
            <button
              onClick={handleResetQuiz}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Answers
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-8">
            {currentSet.questions.map((q, qIndex) => {
              const selectedIdx = selectedAnswers[`${activeSetId}-${q.id}`];
              const isAnswered = selectedIdx !== undefined;
              const isCorrect = selectedIdx === q.correctIndex;

              return (
                <div key={q.id} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      Q{qIndex + 1}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  {/* Options List */}
                  <div className="space-y-2.5 pt-1 pl-0 sm:pl-10">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700";

                      if (isAnswered) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 font-bold shadow-md shadow-emerald-500/10";
                        } else if (optIdx === selectedIdx) {
                          btnStyle = "bg-rose-950/70 border-rose-500 text-rose-200 font-bold shadow-md shadow-rose-500/10";
                        } else {
                          btnStyle = "bg-slate-900/40 border-slate-850 text-slate-500 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-mono">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </span>

                          {isAnswered && optIdx === q.correctIndex && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isAnswered && optIdx === selectedIdx && optIdx !== q.correctIndex && (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  {isAnswered && (
                    <div className={`mt-4 p-4 rounded-xl text-xs sm:text-sm border leading-relaxed space-y-1.5 ${
                      isCorrect 
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200' 
                        : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
                    }`}>
                      <div className="font-bold flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Info className="w-4 h-4" />
                        <span>{isCorrect ? 'Correct! Detailed Rationale:' : 'Explanation & Correct Answer:'}</span>
                      </div>
                      <p className="text-slate-300">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA to explore full courses */}
        <div className="text-center py-6">
          <Link
            to="/courses/all"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all"
          >
            Explore Full CA & CMA Video Courses <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
