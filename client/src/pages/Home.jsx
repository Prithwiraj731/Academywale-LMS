import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Numbers from '../components/home/Numbers';
import SearchBy from '../components/home/SearchBy';
import Partners from '../components/home/Partners';
// Import the modern testimonial component
import ModernTestimonial from '../components/ui/modern-testimonial';
import WhatsAppButton from '../components/home/WhatsAppButton';
import Footer from '../components/layout/Footer';
import Particles from '../components/common/Particles';
import { PinContainer } from '../components/ui/3d-pin';
import { useNavigate } from 'react-router-dom';
import CAClasses from '../components/home/CAClasses';
import CMAClasses from '../components/home/CMAClasses';
import { getHomepageFaculties, getAllFaculties } from '../data/hardcodedFaculties';
import { getAllFacultiesWithUpdates } from '../data/facultyUpdates';
import InstitutesPage from './InstitutesPage';
import sjcCert from '../assets/sjcCert.jpg';

// import banner3 from '../assets/banner3.png';

export default function Home() {
  const navigate = useNavigate();
  const [topFaculties, setTopFaculties] = useState([]);

  // Load faculties with updates on component mount
  useEffect(() => {
    const baseFaculties = getHomepageFaculties();
    const facultiesWithUpdates = getAllFacultiesWithUpdates(baseFaculties);
    setTopFaculties(facultiesWithUpdates);
  }, []);

  // Listen for faculty updates
  useEffect(() => {
    const handleFacultyUpdate = () => {
      const baseFaculties = getHomepageFaculties();
      const facultiesWithUpdates = getAllFacultiesWithUpdates(baseFaculties);
      setTopFaculties(facultiesWithUpdates);
    };

    window.addEventListener('facultyUpdated', handleFacultyUpdate);
    return () => window.removeEventListener('facultyUpdated', handleFacultyUpdate);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100 overflow-x-hidden">
      {/* Removed the first Particles component to restrict particles to dark background section only */}
      <Navbar />
      <Hero />
      <div className="h-2 xs:h-3 sm:h-4 md:h-8" />
      {/* Move Categories (Your Learning Journey) section to the top */}
{/* Rearranged CA/CMA Path Buttons Section */}
      <div className="relative py-8 xs:py-10 sm:py-12 md:py-16 flex justify-center items-center overflow-hidden text-white relative z-10 bg-gray-900">
        <Particles
          particleColors={['#ffffff', '#00eaff', '#ffd600']}
          particleCount={180}
          particleSpread={12}
          speed={0.12}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
          className="absolute top-0 left-0 w-full h-full z-0"
        />
        <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 pt-4 xs:pt-5 sm:pt-6 pb-6 xs:pb-7 sm:pb-8">
          {/* Titles */}
          <div className="grid grid-cols-2 gap-x-3 xs:gap-x-4 sm:gap-x-6 md:gap-x-8 w-full mb-4 xs:mb-5 sm:mb-6">
            <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center">CA Courses</h3>
            <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-center">CMA Courses</h3>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-2 gap-x-3 xs:gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 xs:gap-y-5 sm:gap-y-6 w-full">
            {/* --- Foundation Row --- */}
            <button
              onClick={() => navigate('/ca/foundation-papers')}
              className="text-xs xs:text-sm sm:text-base md:text-lg px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-400 hover:bg-teal-700 transition-colors"
            >
              Foundation
            </button>
            <button
              onClick={() => navigate('/cma/foundation-papers')}
              className="text-xs xs:text-sm sm:text-base md:text-lg px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-400 hover:bg-teal-700 transition-colors"
            >
              Foundation
            </button>

            {/* --- Inter Row --- */}
            <button
              onClick={() => navigate('/ca/inter-papers')}
              className="text-xs xs:text-sm sm:text-base md:text-lg px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-400 hover:bg-teal-700 transition-colors"
            >
              Inter
            </button>
            <button
              onClick={() => navigate('/cma/inter-papers')}
              className="text-xs xs:text-sm sm:text-base md:text-lg px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-400 hover:bg-teal-700 transition-colors"
            >
              Inter
            </button>

            {/* --- Final Row --- */}
            <button
              onClick={() => navigate('/ca/final-papers')}
              className="text-xs xs:text-sm sm:text-base md:text-lg px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-400 hover:bg-teal-700 transition-colors"
            >
              Final
            </button>
            <button
              onClick={() => navigate('/cma/final-papers')}
              className="text-xs xs:text-sm sm:text-base md:text-lg px-2 xs:px-3 sm:px-4 py-2 xs:py-2.5 sm:py-3 rounded-full bg-teal-600 text-white font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-400 hover:bg-teal-700 transition-colors"
            >
              Final
            </button>
          </div>

          <div className="mt-6 xs:mt-7 sm:mt-8 text-center text-sm xs:text-base sm:text-lg text-gray-300 font-semibold tracking-wide drop-shadow-lg px-3 xs:px-4">
            Choose your path to success
          </div>
          
          {/* Browse All Courses Button */}
          <div className="mt-5 xs:mt-6 sm:mt-6 text-center">
            <button
              onClick={() => navigate('/courses/all')}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold py-2.5 xs:py-3 sm:py-3 px-6 xs:px-7 sm:px-8 rounded-full text-sm xs:text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400"
            >
              🎓 Browse All Available Courses
            </button>
          </div>
        </div>
      </div>
      {/* End rearranged section */}
      <Categories />
      {/* Restore Meet Our Expert Faculties section */}
      <section className="flex-1 py-8 xs:py-10 sm:py-12 md:py-14 px-2 xs:px-3 sm:px-4 section-light">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-6 xs:mb-8 sm:mb-10 font-heading tracking-tight drop-shadow-lg">
            Meet Our <span className="text-[#000000]">Expert Faculties</span>
          </h2>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {topFaculties.map(faculty => {
              return (
                <PinContainer
                  key={faculty.id}
                  title={faculty.name}
                  href={`/faculties/${faculty.slug}`}
                  containerClassName="w-full h-full min-w-[120px] xs:min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] max-w-[140px] xs:max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[240px] min-h-[160px] xs:min-h-[180px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[300px] max-h-[180px] xs:max-h-[200px] sm:max-h-[220px] md:max-h-[260px] lg:max-h-[320px] mx-auto"
                >
                  <div className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center p-2 xs:p-3 sm:p-4 md:p-5 lg:p-8 cursor-pointer hover:scale-105 w-full h-full">
                    <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 mb-1 xs:mb-2 sm:mb-3 md:mb-4 rounded-full overflow-hidden border-2 xs:border-3 sm:border-4 border-gradient-to-r from-blue-500 to-purple-500 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group-hover:border-blue-400 transition-colors duration-300">
                      <img
                        src={faculty.image}
                        alt={faculty.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg xs:text-xl sm:text-2xl font-bold text-gray-700" style={{ display: 'none' }}>
                        {faculty.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-xs xs:text-sm sm:text-base md:text-base font-semibold text-black text-center leading-tight group-hover:text-blue-600 transition-colors duration-300 px-1">
                      {faculty.name}
                    </div>
                  </div>
                </PinContainer>
              );
            })}
          </div>
          {/* Browse All Faculty Button */}
          <div className="flex justify-center mt-6 xs:mt-7 sm:mt-8">
            <button
              onClick={() => navigate('/faculties')}
              className="px-6 xs:px-7 sm:px-8 py-2.5 xs:py-3 sm:py-3 bg-teal-600 text-white font-bold rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-400 text-base xs:text-lg sm:text-lg tracking-wide hover:bg-teal-700 transition-colors duration-300"
            >
              Browse All Faculty
            </button>
          </div>
        </div>
      </section>
      <SearchBy />
      {/* Insert banner3.png here */}
          {/* <div className="my-0 w-full max-w-full overflow-hidden">
            <img
              src={banner3}
              alt="Banner"
              className="w-full h-auto object-cover"
            />
          </div> */}
      {/* <Partners /> */}
      <Numbers />
      
      {/* SJC Certificate Section */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
              Recognized by <span className="text-blue-600">SJC Institute</span>
            </h2>
            <div className="w-full max-w-2xl shadow-xl rounded-lg overflow-hidden">
              <img 
                src={sjcCert}
                alt="SJC Institute Certificate" 
                className="w-full h-auto object-contain"
                onError={(e) => {
                  console.error('Image failed to load');
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-lg" 
                style={{ display: 'none' }}
              >
                Certificate image not available
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Modern Testimonial component */}
      <ModernTestimonial 
        title="See What Teachers & Students Say"
        subtitle="Feedback from our community of learners and educators"
      />
      <WhatsAppButton />
      <Footer />
    </div>
  );
}