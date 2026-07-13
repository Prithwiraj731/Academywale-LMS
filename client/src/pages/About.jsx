import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAward, FaLightbulb, FaBullseye, FaUserCheck, FaCode, FaHandshake, FaBookOpen } from 'react-icons/fa';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#20b2aa]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Dot pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Hero Header Section */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="group inline-flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm font-heading">
              About <span className="text-[#20b2aa] group-hover:text-teal-600 transition-colors duration-300">AcademyWale</span>
            </h1>
            <div className="h-1.5 w-16 group-hover:w-full bg-[#20b2aa] transition-all duration-500 mt-3 rounded-full" />
          </div>
          <p className="text-gray-500 mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Empowering CA & CMA aspirants across India with premium guidance, expert resources, and an unwavering commitment to educational excellence.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 sm:mb-28">
          {/* Pillar 1: Our Foundation */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#20b2aa] mb-6 border border-teal-100 group-hover:bg-[#20b2aa]/10 transition-colors duration-300">
              <FaBookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Our Foundation</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              AcademyWale is a trusted educational platform committed to delivering high-quality learning experiences through strategic partnerships with the most reputed faculties across India. We bring together expert educators, dynamic content, and a student-first approach to provide affordable and result-oriented courses.
            </p>
          </div>

          {/* Pillar 2: Our Commitment */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100 group-hover:bg-blue-600/10 transition-colors duration-300">
              <FaAward className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Our Commitment</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              With a vision to empower every learner, AcademyWale collaborates with top-rated faculties from diverse domains like CMA, CA, CS, and other commerce-related streams, ensuring students get access to the best guidance, updated curriculum, and practical insights — all in one place.
            </p>
          </div>

          {/* Pillar 3: Our Promise */}
          <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6 border border-amber-100 group-hover:bg-amber-500/10 transition-colors duration-300">
              <FaHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Our Promise</h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Whether you're a beginner or a repeater, our platform is your one-stop solution for quality education at your convenience. Together with our partner faculties, we aim to build a learning ecosystem where students succeed not just in exams, but in their careers.
            </p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-24 sm:mb-32">
          {/* Mission Card */}
          <div className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-[100px] pointer-events-none" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#20b2aa] border border-teal-100">
                <FaBullseye className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              To provide high-quality, affordable, and accessible education for CA & CMA aspirants, leveraging technology and the best teaching talent in India. We strive to simplify exam preparation and build a pathway to student success.
            </p>
          </div>

          {/* Vision Card */}
          <div className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-[100px] pointer-events-none" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                <FaLightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              To be the most trusted and student-preferred platform for commerce and professional education in India, inspiring and enabling every student to confidently achieve their career aspirations and professional dreams.
            </p>
          </div>
        </div>

        {/* Executive Team Section */}
        <div className="mt-16">
          <div className="text-center mb-12 sm:mb-16">
            <div className="group inline-flex flex-col items-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm font-heading">
                Meet Our <span className="text-[#20b2aa] group-hover:text-teal-600 transition-colors duration-300">Executive Team</span>
              </h2>
              <div className="h-1 w-12 group-hover:w-full bg-[#20b2aa] transition-all duration-500 mt-2 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Team Member 1 */}
            <div className="group relative bg-white rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.01] hover:border-[#20b2aa]/30">
              <div className="flex flex-col items-center">
                {/* Modern Avatar Container */}
                <div className="relative w-24 h-24 mb-6 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-[#20b2aa] rounded-3xl blur-md opacity-20 group-hover:opacity-45 group-hover:scale-110 transition-all duration-300" />
                  <div className="relative w-full h-full bg-gradient-to-br from-teal-50 to-teal-100/30 border-2 border-white rounded-3xl flex items-center justify-center shadow-md overflow-hidden">
                    <span className="text-3xl font-black text-[#20b2aa]">SP</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1">Sourav Pathak</h3>
                <p className="text-xs font-extrabold text-[#20b2aa] uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100/60 shadow-sm mb-4">
                  Founder
                </p>
                <p className="text-gray-500 text-sm text-center leading-relaxed">
                  Visionary leader with a passion for education and a commitment to quality student support.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group relative bg-white rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.01] hover:border-[#20b2aa]/30">
              <div className="flex flex-col items-center">
                {/* Modern Avatar Container */}
                <div className="relative w-24 h-24 mb-6 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-md opacity-20 group-hover:opacity-45 group-hover:scale-110 transition-all duration-300" />
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-blue-100/30 border-2 border-white rounded-3xl flex items-center justify-center shadow-md overflow-hidden">
                    <span className="text-3xl font-black text-blue-600">PM</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1">Prithwiraj Mazumdar</h3>
                <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100/60 shadow-sm mb-4">
                  Tech Lead
                </p>
                <p className="text-gray-500 text-sm text-center leading-relaxed">
                  Innovative developer crafting seamless digital systems and learning platforms.
                </p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group relative bg-white rounded-3xl p-8 border border-gray-200/60 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.01] hover:border-[#20b2aa]/30">
              <div className="flex flex-col items-center">
                {/* Modern Avatar Container */}
                <div className="relative w-24 h-24 mb-6 group-hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl blur-md opacity-20 group-hover:opacity-45 group-hover:scale-110 transition-all duration-300" />
                  <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-amber-100/30 border-2 border-white rounded-3xl flex items-center justify-center shadow-md overflow-hidden">
                    <span className="text-3xl font-black text-amber-500">RP</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1">Raj Pathak</h3>
                <p className="text-xs font-extrabold text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-100/60 shadow-sm mb-4">
                  Sales Executive
                </p>
                <p className="text-gray-500 text-sm text-center leading-relaxed">
                  Dedicated specialist connecting students with the right learning paths for success.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}