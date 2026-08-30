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
  FaFileAlt,
  FaDownload,
  FaBookOpen,
  FaStar,
  FaQuestionCircle
} from 'react-icons/fa';
import { 
  Clock, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  Sparkles,
  HelpCircle,
  FileText,
  ChevronRight
} from 'lucide-react';
import BackButton from '../components/common/BackButton';

export default function TestSeriesPage() {
  const [activeTab, setActiveTab] = useState('ca');
  const [selectedLevel, setSelectedLevel] = useState('inter');

  const testSeriesSchedules = {
    ca: {
      foundation: [
        { testNo: 'TS-F1', name: 'Principles and Practice of Accounting', type: 'Full Syllabus (100 Marks)', duration: '3 Hours', pattern: 'ICAI New Pattern: True/False + Practical' },
        { testNo: 'TS-F2', name: 'Business Laws', type: 'Full Syllabus (100 Marks)', duration: '3 Hours', pattern: 'Descriptive Case Studies & Section Application' },
        { testNo: 'TS-F3', name: 'Quantitative Aptitude', type: 'Full Syllabus (100 Marks)', duration: '2 Hours', pattern: 'Objective MCQ with Negative Marking' },
        { testNo: 'TS-F4', name: 'Business Economics', type: 'Full Syllabus (100 Marks)', duration: '2 Hours', pattern: 'Objective MCQ with Negative Marking' },
      ],
      inter: [
        { testNo: 'TS-I1', name: 'Advanced Accounting', type: 'Group 1 (100 Marks)', duration: '3 Hours', pattern: 'Consolidated Accounts, AS 1-29 & 30% MCQ' },
        { testNo: 'TS-I2', name: 'Corporate and Other Laws', type: 'Group 1 (100 Marks)', duration: '3 Hours', pattern: 'Company Law, FEMA & General Clauses Act' },
        { testNo: 'TS-I3', name: 'Taxation (Income Tax + GST)', type: 'Group 1 (100 Marks)', duration: '3 Hours', pattern: '50M DT + 50M GST with Case-Scenario MCQs' },
        { testNo: 'TS-I4', name: 'Cost and Management Accounting', type: 'Group 2 (100 Marks)', duration: '3 Hours', pattern: 'Standard Costing, Marginal Costing & Budgetary' },
        { testNo: 'TS-I5', name: 'Auditing and Ethics', type: 'Group 2 (100 Marks)', duration: '3 Hours', pattern: 'Standards on Auditing (SAs) & Ethics' },
        { testNo: 'TS-I6', name: 'Financial Management & Strategic Management', type: 'Group 2 (100 Marks)', duration: '3 Hours', pattern: '50M FM + 50M SM' },
      ],
      final: [
        { testNo: 'TS-FN1', name: 'Financial Reporting (FR)', type: 'Group 1 (100 Marks)', duration: '3 Hours', pattern: 'Ind AS 115, 116, 109, 103 & Consolidation' },
        { testNo: 'TS-FN2', name: 'Advanced Financial Management (AFM)', type: 'Group 1 (100 Marks)', duration: '3 Hours', pattern: 'Forex, Derivatives & Portfolio Management' },
        { testNo: 'TS-FN3', name: 'Advanced Auditing & Professional Ethics', type: 'Group 1 (100 Marks)', duration: '3 Hours', pattern: 'Standards on Auditing & CA Act 1949 Ethics' },
        { testNo: 'TS-FN4', name: 'Direct Tax Laws & International Taxation', type: 'Group 2 (100 Marks)', duration: '3 Hours', pattern: 'Corporate Tax, Transfer Pricing & DTAA' },
        { testNo: 'TS-FN5', name: 'Indirect Tax Laws (GST & Customs)', type: 'Group 2 (100 Marks)', duration: '3 Hours', pattern: 'GST, Customs Act & Foreign Trade Policy' },
        { testNo: 'TS-FN6', name: 'Integrated Business Solutions', type: 'Group 2 (100 Marks)', duration: '4 Hours', pattern: 'Multi-Disciplinary Open Book Case Studies' },
      ]
    },
    cma: {
      foundation: [
        { testNo: 'TS-CF1', name: 'Fundamentals of Business Laws', type: 'Paper 1 (100 Marks)', duration: '2 Hours', pattern: 'Commercial & Industrial Laws Objective' },
        { testNo: 'TS-CF2', name: 'Fundamentals of Financial and Cost Accounting', type: 'Paper 2 (100 Marks)', duration: '2 Hours', pattern: 'Accounting Concepts & Costing Fundamentals' },
        { testNo: 'TS-CF3', name: 'Fundamentals of Business Math & Statistics', type: 'Paper 3 (100 Marks)', duration: '2 Hours', pattern: 'Arithmetic, Central Tendency & Probability' },
        { testNo: 'TS-CF4', name: 'Fundamentals of Business Economics & Mgmt', type: 'Paper 4 (100 Marks)', duration: '2 Hours', pattern: 'Economics & Principles of Management' },
      ],
      inter: [
        { testNo: 'TS-CI1', name: 'Business Laws and Ethics', type: 'Paper 5 (100 Marks)', duration: '3 Hours', pattern: 'Company Law, Industrial Laws & Ethics' },
        { testNo: 'TS-CI2', name: 'Financial Accounting', type: 'Paper 6 (100 Marks)', duration: '3 Hours', pattern: 'Accounting Standards & Partnership Accounts' },
        { testNo: 'TS-CI3', name: 'Direct and Indirect Taxation', type: 'Paper 7 (100 Marks)', duration: '3 Hours', pattern: 'Income Tax & Goods and Services Tax' },
        { testNo: 'TS-CI4', name: 'Cost Accounting', type: 'Paper 8 (100 Marks)', duration: '3 Hours', pattern: 'Cost Sheet, Standard & Marginal Costing' },
        { testNo: 'TS-CI5', name: 'Operations & Strategic Management', type: 'Paper 9 (100 Marks)', duration: '3 Hours', pattern: 'Production Planning & Business Strategy' },
        { testNo: 'TS-CI6', name: 'Corporate Accounting and Auditing', type: 'Paper 10 (100 Marks)', duration: '3 Hours', pattern: 'Company Accounts & Audit Principles' },
      ],
      final: [
        { testNo: 'TS-CFN1', name: 'Corporate and Economic Laws', type: 'Paper 13 (100 Marks)', duration: '3 Hours', pattern: 'Companies Act, IBC 2016 & SEBI Regulations' },
        { testNo: 'TS-CFN2', name: 'Strategic Financial Management (SFM)', type: 'Paper 14 (100 Marks)', duration: '3 Hours', pattern: 'Investment Decisions, Forex & Valuation' },
        { testNo: 'TS-CFN3', name: 'Direct Tax Laws & International Taxation', type: 'Paper 15 (100 Marks)', duration: '3 Hours', pattern: 'Corporate Assessment & Cross-Border Tax' },
        { testNo: 'TS-CFN4', name: 'Strategic Cost Management', type: 'Paper 16 (100 Marks)', duration: '3 Hours', pattern: 'Target Costing, Quality Cost & Lean Mgmt' },
        { testNo: 'TS-CFN5', name: 'Cost and Management Audit', type: 'Paper 17 (100 Marks)', duration: '3 Hours', pattern: 'Cost Audit Rules & Operational Audit' },
        { testNo: 'TS-CFN6', name: 'Corporate Financial Reporting', type: 'Paper 18 (100 Marks)', duration: '3 Hours', pattern: 'Ind AS Implementation & Group Accounts' },
      ]
    }
  };

  const currentSchedule = testSeriesSchedules[activeTab][selectedLevel] || [];

  const evaluationRubrics = [
    { title: 'Step-Marking Methodology', desc: 'Working notes, journal entries, and statutory citations receive designated step points based on ICAI/ICMAI suggested answer guidelines.' },
    { title: 'Time Allocation Audit', desc: 'Identifies whether you exceeded the 1.8-minute per mark rule on complex problems and pinpoint where precious exam minutes were lost.' },
    { title: 'Conceptual Error Diagnostics', desc: 'Differentiates between calculation slips, misinterpretation of question facts, and statutory concept gaps.' },
    { title: 'Answer Presentation Feedback', desc: 'Evaluates ledger rulings, balance sheet headings, section numbers, and conclusion clarity for subjective papers.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-2/3 right-10 w-[450px] h-[450px] bg-indigo-500/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-12">
        
        {/* Navigation / Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <BackButton />
          <span className="text-xs font-mono tracking-widest text-teal-400 uppercase font-semibold bg-teal-950/60 border border-teal-500/30 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            AcademyWale • Test Series & Mock Exam Hub
          </span>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <FaClipboardCheck className="text-teal-400" />
            <span>EXAM-STANDARD MOCK EVALUATION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            CA & CMA <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Test Series Portal</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Bridge the gap between syllabus preparation and rank-holding exam performance. Attempt chapter-wise tests and 100-mark full-syllabus mock exams designed strictly according to ICAI and ICMAI standards.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl">
            <div className="p-3 bg-teal-500/10 rounded-xl w-fit text-teal-400 text-xl">
              <FaClipboardCheck />
            </div>
            <h3 className="text-base font-bold text-white">Full & Chapter-Wise Mocks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Targeted chapter tests (30% & 50% syllabus) followed by comprehensive 100-mark full-syllabus papers.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl">
            <div className="p-3 bg-indigo-500/10 rounded-xl w-fit text-indigo-400 text-xl">
              <FaChartLine />
            </div>
            <h3 className="text-base font-bold text-white">Granular Score Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identify conceptual vs presentation gaps and track your average speed per mark across all papers.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl">
            <div className="p-3 bg-blue-500/10 rounded-xl w-fit text-blue-400 text-xl">
              <FaUserGraduate />
            </div>
            <h3 className="text-base font-bold text-white">Expert Faculty Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Papers evaluated line-by-line with step marks, working note commentary, and ranker suggestions.
            </p>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-3 shadow-xl">
            <div className="p-3 bg-amber-500/10 rounded-xl w-fit text-amber-400 text-xl">
              <FaFileAlt />
            </div>
            <h3 className="text-base font-bold text-white">Model Suggested Answers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full model answer keys and step-by-step marking rubrics provided immediately after every test submission.
            </p>
          </div>
        </div>

        {/* Interactive Test Series Schedules & Blueprint */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Layers className="text-teal-400 w-5 h-5" />
                <span>Test Series Papers & Examination Blueprint</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Select your course and stage to view test configurations.</p>
            </div>

            {/* Course & Level Selector */}
            <div className="flex flex-wrap gap-2">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('ca')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'ca' ? 'bg-teal-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CA Course
                </button>
                <button
                  onClick={() => setActiveTab('cma')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'cma' ? 'bg-teal-500 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CMA Course
                </button>
              </div>

              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['foundation', 'inter', 'final'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                      selectedLevel === lvl ? 'bg-slate-800 text-teal-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Paper Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSchedule.map((test, idx) => (
              <div
                key={idx}
                className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-3 hover:border-teal-500/40 transition-all shadow-md"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/20">
                    {test.testNo}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-teal-400" /> {test.duration}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">{test.name}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">{test.type}</div>
                </div>

                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs text-slate-300">
                  <span className="text-[11px] text-slate-400">{test.pattern}</span>
                  <Link
                    to="/resources/study-guides"
                    className="text-teal-400 hover:underline font-bold inline-flex items-center gap-1"
                  >
                    Study Guide <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Methodology & Rubric */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-teal-400 w-5 h-5" />
            <span>How Your Answers Are Evaluated for Step Marks</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {evaluationRubrics.map((rubric, idx) => (
              <div key={idx} className="space-y-2 bg-slate-950/50 p-5 rounded-2xl border border-slate-850">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <FaCheckCircle className="text-teal-400 text-xs" />
                  <span>{rubric.title}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {rubric.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-teal-900/40 via-indigo-900/40 to-slate-900/40 border border-teal-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xl backdrop-blur-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to Begin Your CA or CMA Preparation?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Access free chapter-wise study notes, MCQ practice modules, and complete video lectures from India's most renowned educators.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg"
            >
              <FaBookOpen /> Free Learning Hub
            </Link>
            <Link
              to="/courses/all"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-white/20 transition-all shadow-lg"
            >
              Explore Video Courses
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
