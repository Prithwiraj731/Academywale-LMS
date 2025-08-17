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
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4 animate-pulse text-center">About <span className="text-[#20b2aa]">AcademyWale</span></h1>
          <p className="text-base sm:text-lg md:text-xl text-cyan-200 max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto mb-8 text-left md:text-center leading-relaxed md:leading-8">
            AcademyWale is a trusted educational platform committed to delivering high-quality learning experiences through strategic partnerships with some of the most reputed faculties across India. We bring together expert educators, dynamic content, and a student-first approach to provide affordable and result-oriented courses for competitive and professional exams.<br/><br/>
            With a vision to empower every learner, AcademyWale collaborates with top-rated faculties from diverse domains like CMA, CA, CS, and other commerce-related streams, ensuring students get access to the best guidance, updated curriculum, and practical insights — all in one place.<br/><br/>
            Whether you're a beginner or a repeater, our platform is your one-stop solution for quality education at your convenience. Together with our partner faculties, we aim to build a learning ecosystem where students succeed not just in exams, but in their careers.
          </p>
        </section>
        {/* Mission & Vision */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 px-2 sm:px-4 py-6 sm:py-10">
          <div className="bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8 max-w-xs sm:max-w-md w-full border-t-4 border-[#ffd600] hover:scale-105 transition-transform">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a6ebd] mb-2">Our Mission</h2>
            <p className="text-gray-700 text-base sm:text-lg">To provide high-quality, affordable, and accessible education for CA & CMA aspirants, leveraging technology and the best teaching talent in India.</p>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8 max-w-xs sm:max-w-md w-full border-t-4 border-[#00eaff] hover:scale-105 transition-transform">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a6ebd] mb-2">Our Vision</h2>
            <p className="text-gray-700 text-base sm:text-lg">To be the most trusted platform for commerce education, inspiring and enabling every student to achieve their professional dreams.</p>
          </div>
        </section>
        {/* Team Section */}
        <section className="py-8 sm:py-12 px-2 sm:px-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white text-center mb-6 sm:mb-8">Meet Our Team</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {/* Example team cards, replace with real data/images if available */}
            <div className="bg-white/90 rounded-xl shadow-lg p-4 sm:p-6 w-48 sm:w-64 flex flex-col items-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#0a6ebd] to-[#00eaff] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-2xl sm:text-4xl text-white font-bold">S</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0a6ebd]">Sourav Pathak</h3>
              <p className="text-gray-700 text-sm sm:text-base">Founder</p>
            </div>
            <div className="bg-white/90 rounded-xl shadow-lg p-4 sm:p-6 w-48 sm:w-64 flex flex-col items-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#ffd600] to-[#00eaff] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-2xl sm:text-4xl text-white font-bold">P</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0a6ebd]">Prithwiraj Mazumdar</h3>
              <p className="text-gray-700 text-sm sm:text-base">Tech Lead</p>
            </div>
            <div className="bg-white/90 rounded-xl shadow-lg p-4 sm:p-6 w-48 sm:w-64 flex flex-col items-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-[#0a6ebd] to-[#ffd600] rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-2xl sm:text-4xl text-white font-bold">R</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0a6ebd]">Raj Pathak</h3>
              <p className="text-gray-700 text-sm sm:text-base">Sales Executive</p>
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