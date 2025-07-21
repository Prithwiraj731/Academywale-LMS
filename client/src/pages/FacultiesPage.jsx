import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../components/common/Particles';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { PinContainer } from '../components/ui/3d-pin';

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    fetch('/api/faculties')
      .then(res => res.json())
      .then(data => setFaculties(data.faculties || []));
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Helper to get image
  const getFacultyImage = fac => {
    if (fac.imageUrl && fac.imageUrl !== '/logo.svg') {
      if (fac.imageUrl.startsWith('http')) return fac.imageUrl;
      if (fac.imageUrl.startsWith('/uploads')) return `${API_URL}${fac.imageUrl}`;
      if (fac.imageUrl.startsWith('/static')) return fac.imageUrl;
    }
    return '/logo.svg';
  };

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
      <div className="flex-1 flex flex-col">
        <Navbar />
        <section className="flex-1 py-6 sm:py-8 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#20b2aa] text-center mb-8">Meet Our <span className="text-[#ffd600]">Expert Faculties</span></h2>
            {faculties.length === 0 ? (
              <div className="text-center text-gray-400 py-12">No faculties yet. Please check back soon!</div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {faculties.map(fac => {
                const name = fac.firstName + (fac.lastName ? ' ' + fac.lastName : '');
                return (
                  <PinContainer
                    key={fac.slug}
                    title={name.replace(/_/g, ' ')}
                    href={`/faculties/${fac.slug}`}
                    containerClassName="w-full h-full min-w-[220px] max-w-[220px] min-h-[300px] max-h-[300px] mx-auto"
                  >
                    <div
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-4 sm:p-6 cursor-pointer hover:scale-105 w-full h-full"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-[#20b2aa] bg-gradient-to-br from-[#e0f7f4] to-[#e0f7f4] flex items-center justify-center group-hover:border-[#17817a] transition-colors duration-300">
                        <img
                          src={getFacultyImage(fac)}
                          alt={name}
                          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                          style={{ background: '#fff' }}
                        />
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-black text-center leading-tight group-hover:text-[#20b2aa] transition-colors duration-300">
                        {name.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </PinContainer>
                );
              })}
            </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
} 