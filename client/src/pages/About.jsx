import Particles from '../components/common/Particles';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';


export default function About() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 overflow-x-hidden">
      {/* Animated Background */}
      <Particles
        particleColors={['#ffffff', '#00eaff', '#ffd600']}
        particleCount={180}
        particleSpread={12}
        speed={0.12}
        particleBaseSize={80}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-16 px-4 bg-transparent">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-10 text-center">
            <span className="text-slate-300">About</span> 
            <span className="text-amber-400 ml-4">AcademyWale</span>
          </h1>
          
          {/* About Content - Redesigned */}
          <div className="w-full max-w-6xl mx-auto">
            {/* Section 1 */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-900/80 to-indigo-900/80 rounded-2xl p-8 md:p-10 mb-8 backdrop-blur-sm border border-blue-800/30 shadow-lg transform transition hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-300 mb-4">Our Foundation</h2>
              <p className="text-lg text-cyan-100 leading-relaxed">
                AcademyWale is a trusted educational platform committed to delivering high-quality learning experiences through strategic partnerships with some of the most reputed faculties across India. We bring together expert educators, dynamic content, and a student-first approach to provide affordable and result-oriented courses for competitive and professional exams.
              </p>
            </div>
            
            {/* Section 2 */}
            <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/80 to-purple-900/80 rounded-2xl p-8 md:p-10 mb-8 backdrop-blur-sm border border-indigo-800/30 shadow-lg transform transition hover:scale-[1.01]">
              <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full -ml-20 -mt-20 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-purple-400/10 rounded-full -mr-14 -mb-14 blur-xl"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="md:w-1/4 flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h2 className="text-2xl md:text-3xl font-bold text-indigo-300 mb-4">Our Commitment</h2>
                  <p className="text-lg text-indigo-100 leading-relaxed">
                    With a vision to empower every learner, AcademyWale collaborates with top-rated faculties from diverse domains like CMA, CA, CS, and other commerce-related streams, ensuring students get access to the best guidance, updated curriculum, and practical insights — all in one place.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Section 3 */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/80 to-blue-900/80 rounded-2xl p-8 md:p-10 backdrop-blur-sm border border-purple-800/30 shadow-lg transform transition hover:scale-[1.01]">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 rounded-full -ml-16 -mb-16 blur-xl"></div>
              
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-6">
                <div className="md:w-1/4 flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg mb-4 md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h2 className="text-2xl md:text-3xl font-bold text-purple-300 mb-4">Our Promise</h2>
                  <p className="text-lg text-purple-100 leading-relaxed">
                    Whether you're a beginner or a repeater, our platform is your one-stop solution for quality education at your convenience. Together with our partner faculties, we aim to build a learning ecosystem where students succeed not just in exams, but in their careers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Mission & Vision */}
        <section className="py-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">Our Purpose</span>
          </h2>
          
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-2xl transform group-hover:scale-[1.02] transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-8 h-full backdrop-blur-sm border border-amber-500/30 shadow-xl">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-300"></div>
                
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Our Mission</h3>
                </div>
                
                <p className="text-lg text-slate-300 leading-relaxed">
                  To provide high-quality, affordable, and accessible education for CA & CMA aspirants, leveraging technology and the best teaching talent in India.
                </p>
                
                <div className="absolute w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            </div>
            
            {/* Vision Card */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl transform group-hover:scale-[1.02] transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-8 h-full backdrop-blur-sm border border-cyan-500/30 shadow-xl">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-300"></div>
                
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">Our Vision</h3>
                </div>
                
                <p className="text-lg text-slate-300 leading-relaxed">
                  To be the most trusted platform for commerce education, inspiring and enabling every student to achieve their professional dreams.
                </p>
                
                <div className="absolute w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-600 bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </div>
            </div>
          </div>
        </section>
        {/* Team Section */}
        <section className="py-16 px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">Meet Our Team</span>
          </h2>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transform group-hover:scale-[1.03] transition-all duration-300"></div>
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-8 backdrop-blur-sm border border-slate-700 shadow-xl h-full">
                {/* Glass effect circles */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-cyan-400/5 rounded-full blur-lg"></div>
                
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative mb-6 group-hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full blur-md opacity-50 group-hover:opacity-70 scale-110 group-hover:scale-125 transition-all duration-300"></div>
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20">
                      <span className="text-3xl sm:text-4xl text-white font-bold">S</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 text-center">Sourav Pathak</h3>
                  <p className="text-cyan-300 font-medium mb-4 text-center">Founder</p>
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mb-4 group-hover:w-24 transition-all duration-300"></div>
                  <p className="text-slate-400 text-center">Visionary leader with a passion for education and innovation.</p>
                </div>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transform group-hover:scale-[1.03] transition-all duration-300"></div>
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-8 backdrop-blur-sm border border-slate-700 shadow-xl h-full">
                {/* Glass effect circles */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-amber-400/5 rounded-full blur-lg"></div>
                
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative mb-6 group-hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full blur-md opacity-50 group-hover:opacity-70 scale-110 group-hover:scale-125 transition-all duration-300"></div>
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20">
                      <span className="text-3xl sm:text-4xl text-white font-bold">P</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 text-center">Prithwiraj Mazumdar</h3>
                  <p className="text-amber-300 font-medium mb-4 text-center">Tech Lead</p>
                  <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mb-4 group-hover:w-24 transition-all duration-300"></div>
                  <p className="text-slate-400 text-center">Innovative developer crafting seamless digital learning experiences.</p>
                </div>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transform group-hover:scale-[1.03] transition-all duration-300"></div>
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-8 backdrop-blur-sm border border-slate-700 shadow-xl h-full">
                {/* Glass effect circles */}
                <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-400/5 rounded-full blur-lg"></div>
                
                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="relative mb-6 group-hover:-translate-y-1 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-400 rounded-full blur-md opacity-50 group-hover:opacity-70 scale-110 group-hover:scale-125 transition-all duration-300"></div>
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-purple-600 to-indigo-400 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20">
                      <span className="text-3xl sm:text-4xl text-white font-bold">R</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 text-center">Raj Pathak</h3>
                  <p className="text-indigo-300 font-medium mb-4 text-center">Sales Executive</p>
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full mb-4 group-hover:w-24 transition-all duration-300"></div>
                  <p className="text-slate-400 text-center">Connecting students with the right learning resources to achieve success.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
} 