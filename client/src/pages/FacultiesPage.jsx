import React from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../components/common/Particles';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { PinContainer } from '../components/ui/3d-pin';

// Import all faculty images
import vijaySarda from '../assets/facultyProfiles/VIJAY SARDA.png';
import aadityaJain from '../assets/facultyProfiles/AADITYA JAIN.png';
import avinashLala from '../assets/facultyProfiles/AVINASH LALA.png';
import bishnuKedia from '../assets/facultyProfiles/BISHNU KEDIA.png';
import mayankSaraf from '../assets/facultyProfiles/MAYANK SARAF.png';
import darshanKhare from '../assets/facultyProfiles/DARSHAN KHARE.png';
import divyaAgarwal from '../assets/facultyProfiles/DIVYA AGARWAL.png';
import santoshKumar from '../assets/facultyProfiles/SANTOSH KUMAR.png';
import ranjanPeriwal from '../assets/facultyProfiles/RANJAN PERIWAL.png';
import vishalBhattad from '../assets/facultyProfiles/VISHAL BHATTAD.png';
import shivangiAgarwal from '../assets/facultyProfiles/SHIVANGI AGARWAL.png';

const facultyList = [
  { name: 'VIJAY SARDA', img: vijaySarda },
  { name: 'AADITYA JAIN', img: aadityaJain },
  { name: 'AVINASH LALA', img: avinashLala },
  { name: 'BISHNU KEDIA', img: bishnuKedia },
  { name: 'MAYANK SARAF', img: mayankSaraf },
  { name: 'DARSHAN KHARE', img: darshanKhare },
  { name: 'DIVYA AGARWAL', img: divyaAgarwal },
  { name: 'SANTOSH KUMAR', img: santoshKumar },
  { name: 'RANJAN PERIWAL', img: ranjanPeriwal },
  { name: 'VISHAL BHATTAD', img: vishalBhattad },
  { name: 'SHIVANGI AGARWAL', img: shivangiAgarwal },
];

export default function FacultiesPage() {
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
        <section className="flex flex-col items-center justify-center text-center py-16 px-4 bg-transparent mt-20">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-6">
            Meet Our <span className="text-[#00eaff]">Expert Faculties</span>
          </h1>
          <p className="text-lg md:text-xl text-cyan-200 max-w-3xl mx-auto mb-8">
            Learn from the best CA & CMA professionals who have years of experience in teaching and industry practice
          </p>
        </section>
        {/* Faculties Grid */}
        <section className="flex-1 py-6 sm:py-8 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {facultyList.map(fac => (
                <PinContainer
                  key={fac.name}
                  title={fac.name.replace(/_/g, ' ')}
                  href={`/faculties/${encodeURIComponent(fac.name)}`}
                  containerClassName="w-full h-full min-w-[160px] sm:min-w-[200px] max-w-[200px] sm:max-w-[240px] min-h-[220px] sm:min-h-[300px] max-h-[240px] sm:max-h-[320px] mx-auto"
                >
                  <div
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-4 sm:p-6 cursor-pointer hover:scale-105 w-full h-full"
                  >
                    <div className="w-20 h-20 sm:w-28 sm:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:border-blue-400 transition-colors duration-300">
                      <img
                        src={fac.img}
                        alt={fac.name}
                        className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                        style={{ background: '#fff' }}
                      />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-gray-800 text-center leading-tight group-hover:text-blue-600 transition-colors duration-300">
                      {fac.name.replace(/_/g, ' ')}
                    </div>
                  </div>
                </PinContainer>
              ))}
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