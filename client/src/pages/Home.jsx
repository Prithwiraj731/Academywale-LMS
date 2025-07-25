import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Numbers from '../components/home/Numbers';
import SearchBy from '../components/home/SearchBy';
import Partners from '../components/home/Partners';
import Reviews from '../components/home/Reviews';
import ContactForm from '../components/home/ContactForm';
import Footer from '../components/layout/Footer';
import Particles from '../components/common/Particles';
import { PinContainer } from '../components/ui/3d-pin';
import { useNavigate } from 'react-router-dom';
import CAClasses from '../components/home/CAClasses';
import CMAClasses from '../components/home/CMAClasses';
import InstitutesPage from './InstitutesPage';

export default function Home() {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/faculties`)
      .then(res => res.json())
      .then(data => setFaculties(data.faculties || []));
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  // Helper to get image
  const getFacultyImage = fac => {
    if (fac.imageUrl) {
      return `/uploads/${fac.imageUrl}`;
    }
    return '/logo.svg';
  };

  // Only show first 10 faculties on homepage
  const topFaculties = faculties.slice(0, 10);

  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-x-hidden">
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
      <Navbar />
      <Hero />
      <div className="h-4 sm:h-8" />
      {/* Move Categories (Your Learning Journey) section to the top */}
{/* Rearranged CA/CMA Path Buttons Section */}
      <div className="relative py-10 xs:py-12 sm:py-16 flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 opacity-90"></div>
        <div className="absolute -top-10 left-1/4 w-40 xs:w-56 sm:w-72 h-40 xs:h-56 sm:h-72 bg-gradient-to-tr from-blue-300 via-purple-200 to-pink-200 opacity-30 rounded-full filter blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-32 xs:w-48 sm:w-60 h-32 xs:h-48 sm:h-60 bg-gradient-to-tr from-green-200 via-blue-200 to-purple-200 opacity-20 rounded-full filter blur-2xl animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-2xl mx-auto px-4">
          {/* Titles */}
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 w-full mb-6">
            <h3 className="text-xl font-bold text-center text-gray-800">CA Courses</h3>
            <h3 className="text-xl font-bold text-center text-gray-800">CMA Courses</h3>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-6 w-full">
            {/* --- Foundation Row --- */}
            <button
              onClick={() => navigate('/courses/ca/foundation')}
              className="text-base xs:text-lg px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Foundation
            </button>
            <button
              onClick={() => navigate('/courses/cma/foundation')}
              className="text-base xs:text-lg px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-purple-200"
            >
              Foundation
            </button>

            {/* --- Inter Row --- */}
            <button
              onClick={() => navigate('/courses/ca/inter')}
              className="text-base xs:text-lg px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Inter
            </button>
            <button
              onClick={() => navigate('/courses/cma/inter')}
              className="text-base xs:text-lg px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-purple-200"
            >
              Inter
            </button>

            {/* --- Final Row --- */}
            <button
              onClick={() => navigate('/courses/ca/final')}
              className="text-base xs:text-lg px-4 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Final
            </button>
            <button
              onClick={() => navigate('/courses/cma/final')}
              className="text-base xs:text-lg px-4 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 animate-pulse focus:outline-none focus:ring-4 focus:ring-purple-200"
            >
              Final
            </button>
          </div>

          <div className="mt-8 text-center text-base xs:text-lg text-gray-700 font-semibold tracking-wide drop-shadow-lg px-4">
            Choose your path to success
          </div>
        </div>
      </div>
      {/* End rearranged section */}
      <Categories />
      {/* Restore Meet Our Expert Faculties section */}
      <section className="flex-1 py-10 sm:py-14 px-2 sm:px-4 section-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-10 font-heading tracking-tight drop-shadow-lg">
            Meet Our <span className="text-[#000000]">Expert Faculties</span>
          </h2>
          {topFaculties.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No faculties yet. Please check back soon!</div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-6">
              {topFaculties.map(fac => {
                const name = fac.firstName + (fac.lastName ? ' ' + fac.lastName : '');
                return (
                  <PinContainer
                    key={fac.slug}
                    title={name.replace(/_/g, ' ')}
                    href={`/faculties/${fac.slug}`}
                    containerClassName="w-full h-full min-w-[140px] xs:min-w-[160px] sm:min-w-[200px] max-w-[160px] xs:max-w-[180px] sm:max-w-[240px] min-h-[180px] xs:min-h-[200px] sm:min-h-[300px] max-h-[200px] xs:max-h-[220px] sm:max-h-[320px] mx-auto"
                  >
                    <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-2 xs:p-3 sm:p-6 cursor-pointer hover:scale-105 w-full h-full">
                      <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-28 sm:h-28 mb-2 xs:mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:border-blue-400 transition-colors duration-300">
                        <img
                          src={getFacultyImage(fac)}
                          alt={name}
                          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                          style={{ background: '#fff' }}
                          />
                      </div>
                      <div className="text-xs xs:text-sm sm:text-base font-semibold text-black text-center leading-tight group-hover:text-blue-600 transition-colors duration-300">
                        {name.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </PinContainer>
                );
              })}
            </div>
          )}
          {/* Other Faculties Button */}
          {faculties.length > 10 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => navigate('/faculties')}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-2xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg tracking-wide animate-pulse"
              >
                Other Faculties
              </button>
            </div>
          )}
        </div>
      </section>
      <SearchBy />
      {/* <Partners /> */}
      <Numbers />
      <Reviews />
      <ContactForm />
      <Footer />
    </div>
  );
}