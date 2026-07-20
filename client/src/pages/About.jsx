import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaLightbulb, FaBullseye, FaHandshake, FaBookOpen, FaUsers, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { MorphyButton } from '../components/ui/morphy-button';

import souravImg from '../assets/about/sourav.jpeg';
import prihwiImg from '../assets/about/prihwi.jpg';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-white text-slate-800 overflow-hidden font-sans">
      
      {/* Decorative Background Patterns */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-teal-50/40 via-blue-50/20 to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#20b2aa]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-70 -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        
        {/* HERO SPLIT SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-24 sm:mb-32">
          {/* Hero Left: Message & Stats */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-[#20b2aa] text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#20b2aa] animate-pulse" />
              Who We Are
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              Bridging the Gap to <br />
              <span className="bg-gradient-to-r from-[#20b2aa] to-blue-600 bg-clip-text text-transparent">Professional Excellence</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl">
              AcademyWale is India's premier digital learning ecosystem for CA & CMA aspirants. We partner with the nation's leading coaching institutes and faculties to deliver high-quality, flexible, and affordable education straight to your screen.
            </p>
            
            {/* Interactive Stats Grid */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-gray-100">
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">50+</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Expert Mentors</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#20b2aa]">10k+</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Active Students</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-blue-600">98%</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Success Ratio</div>
              </div>
            </div>

            <div className="pt-4 flex">
              <MorphyButton 
                onClick={() => navigate('/courses/all')}
                size="lg"
                className="shadow-md shadow-[#20b2aa]/10 font-bold"
              >
                Explore Courses <FaArrowRight className="ml-1 w-4 h-4" />
              </MorphyButton>
            </div>
          </div>

          {/* Hero Right: Premium Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Decorative colored glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#20b2aa]/10 to-blue-500/10 rounded-[40px] blur-2xl transform rotate-6 scale-95 pointer-events-none -z-10" />
            
            {/* Bento Display Stack */}
            <div className="relative bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-[32px] p-6 sm:p-8 shadow-2xl w-full max-w-sm sm:max-w-md transform transition-all duration-500 hover:rotate-1 hover:scale-[1.01]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#20b2aa]">
                  <FaGraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base">AcademyWale Portal</h3>
                  <p className="text-xs text-gray-400">Accredited Learning Ecosystem</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100/40 flex items-start gap-3">
                  <span className="p-1.5 bg-[#20b2aa] text-white rounded-lg text-xs font-bold">CA</span>
                  <div>
                    <h4 className="font-semibold text-gray-850 text-xs sm:text-sm">Chartered Accountancy</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Foundation, Inter, & Final Syllabus</p>
                  </div>
                </div>
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/40 flex items-start gap-3">
                  <span className="p-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold">CMA</span>
                  <div>
                    <h4 className="font-semibold text-gray-850 text-xs sm:text-sm">Cost Management Accounting</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Comprehensive subject prep papers</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-gray-500">Live Support Available</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-400">9AM - 8PM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID PILLARS */}
        <section className="mb-24 sm:mb-32">
          <div className="text-center mb-12 sm:mb-16">
            <div className="group inline-flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm font-heading">
                Our Core <span className="text-[#20b2aa] group-hover:text-teal-600 transition-colors duration-300">Pillars</span>
              </h2>
              <div className="h-1 w-12 group-hover:w-full bg-[#20b2aa] transition-all duration-500 mt-2 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            {/* Pillar 1: Our Foundation (Span 7) */}
            <div className="group relative md:col-span-7 bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#20b2aa]/35">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-[100px] pointer-events-none" />
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#20b2aa] mb-6 border border-teal-100 group-hover:bg-[#20b2aa]/10 transition-colors duration-300">
                <FaBookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Our Foundation</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                AcademyWale is built on a single core promise: delivering outstanding education by partnering with India's most celebrated faculties. We bring together veteran CA & CMA educators, modern syllabus modules, and state-of-the-art course delivery tools to offer highly structured, exam-oriented programs at price points accessible to everyone.
              </p>
            </div>

            {/* Pillar 2: Our Commitment (Span 5) */}
            <div className="group relative md:col-span-5 bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/35">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] pointer-events-none" />
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100 group-hover:bg-blue-600/10 transition-colors duration-300">
                <FaAward className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Our Commitment</h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                We are committed to student enablement. Through direct support channels, optimized study plans, and live validation checks, we make sure that no student is left behind in their preparation journey.
              </p>
            </div>

            {/* Pillar 3: Our Promise (Span 12) */}
            <div className="group relative md:col-span-12 bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-amber-500/35">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[120px] pointer-events-none" />
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 border border-amber-100 group-hover:bg-amber-500/10 transition-colors duration-300">
                <FaHandshake className="w-5 h-5" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Our Promise</h3>
                  <p className="text-sm font-semibold text-[#20b2aa]">Student-First Ecosystem</p>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                    Whether you are starting your Foundation classes or revising for your Final papers, we guarantee standard curriculum, authentic material, and absolute transparency. Together with our partner faculties, we create a learning culture where students gain real expertise to build successful, lifelong careers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-24 sm:mb-32">
          {/* Mission Card */}
          <div className="group relative bg-slate-900 text-white rounded-[32px] p-8 sm:p-10 border border-slate-800 shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-teal-500/10 to-teal-400/0 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-[#20b2aa] border border-teal-500/20">
                <FaBullseye className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Our Mission</h3>
            </div>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              To dismantle access barriers in commerce education. By deploying cutting-edge virtual tools and collaborating with the top teaching minds in India, we provide structured, result-driven training for CA & CMA examinations that is affordable for every aspiring professional.
            </p>
          </div>

          {/* Vision Card */}
          <div className="group relative bg-slate-900 text-white rounded-[32px] p-8 sm:p-10 border border-slate-800 shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-blue-400/0 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                <FaLightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Our Vision</h3>
            </div>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              To stand as India's most trusted, choice-rich learning network for professional commerce education. We aim to inspire confidence, nurture analytical excellence, and enable students across all backgrounds to build outstanding leadership careers.
            </p>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="mt-16 sm:mt-24">
          <div className="text-center mb-16">
            <div className="group inline-flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm font-heading">
                Meet Our <span className="text-[#20b2aa] group-hover:text-teal-600 transition-colors duration-300">Executive Team</span>
              </h2>
              <div className="h-1.5 w-16 group-hover:w-full bg-[#20b2aa] transition-all duration-500 mt-3 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 max-w-4xl mx-auto px-4">
            {/* Executive 1: Sourav Pathak */}
            <div className="group relative bg-white/90 backdrop-blur-sm rounded-[32px] p-8 border border-teal-100/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-[#20b2aa]/40 flex flex-col items-center text-center">
              {/* Photo Container */}
              <div className="relative w-36 h-36 mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#20b2aa] to-teal-400 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-tr from-[#20b2aa] via-teal-300 to-blue-400 shadow-md">
                  <img
                    src={souravImg}
                    alt="Sourav Pathak"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-1">Sourav Pathak</h3>
              <p className="text-xs font-black text-[#20b2aa] uppercase tracking-widest bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200/60 shadow-sm mb-4">
                Founder
              </p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs font-medium">
                Providing strategic direction, fostering partnerships, and steering the overall vision and growth of AcademyWale.
              </p>
            </div>

            {/* Executive 2: Prithwiraj Mazumdar */}
            <div className="group relative bg-white/90 backdrop-blur-sm rounded-[32px] p-8 border border-blue-100/80 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 flex flex-col items-center text-center">
              {/* Photo Container */}
              <div className="relative w-36 h-36 mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-tr from-blue-600 via-cyan-400 to-[#20b2aa] shadow-md">
                  <img
                    src={prihwiImg}
                    alt="Prithwiraj Mazumdar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-1">Prithwiraj Mazumdar</h3>
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/60 shadow-sm mb-4">
                Tech Lead
              </p>
              <p className="text-gray-600 text-sm leading-relaxed max-w-xs font-medium">
                Architecting core learning technologies, high-performance course playback systems, and database infrastructure.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}