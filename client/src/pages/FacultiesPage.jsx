import React from 'react';
import { useNavigate } from 'react-router-dom';
import Particles from '../components/common/Particles';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { PinContainer } from '../components/ui/3d-pin';
import { getAllFaculties } from '../data/hardcodedFaculties';

export default function FacultiesPage() {
  // Get all faculties from hardcoded data
  const faculties = getAllFaculties();

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 overflow-x-hidden">
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
      <div className="flex-1 flex flex-col">
        <Navbar />
        <section className="flex-1 py-6 sm:py-8 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#20b2aa] text-center mb-8">Meet Our <span className="text-[#ffd600]">Expert Faculties</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {faculties.map(faculty => {
                return (
                  <PinContainer
                    key={faculty.id}
                    title={faculty.name}
                    href={`/faculties/${faculty.slug}`}
                    containerClassName="w-full h-full min-w-[220px] max-w-[220px] min-h-[300px] max-h-[300px] mx-auto"
                  >
                    <div
                      className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-4 sm:p-6 cursor-pointer hover:scale-105 w-full h-full"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-[#20b2aa] bg-gradient-to-br from-[#e0f7f4] to-[#e0f7f4] flex items-center justify-center group-hover:border-[#17817a] transition-colors duration-300">
                        <img
                          src={faculty.image}
                          alt={faculty.name}
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-[#e0f7f4] to-[#b3e5e0] flex items-center justify-center text-2xl font-bold text-gray-700" style={{ display: 'none' }}>
                          {faculty.name.charAt(0)}
                        </div>
                      </div>
                      <div className="text-sm sm:text-base font-semibold text-black text-center leading-tight group-hover:text-[#20b2aa] transition-colors duration-300">
                        {faculty.name}
                      </div>
                    </div>
                  </PinContainer>
                );
              })}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}