import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import Categories from '../components/home/Categories';
import Numbers from '../components/home/Numbers';
import SearchBy from '../components/home/SearchBy';
import Faculties from '../components/home/Faculties';
import CAInterClasses from '../components/home/CAInterClasses';
import CMAInterClasses from '../components/home/CMAInterClasses';
import Partners from '../components/home/Partners';
import Reviews from '../components/home/Reviews';
import ContactForm from '../components/home/ContactForm';
import Footer from '../components/layout/Footer';
import Particles from '../components/common/Particles';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col relative" style={{zIndex: 1}}>
      {/* Background Particles Animation */}
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        <section className="flex flex-col items-center justify-center text-center py-16 px-4 bg-transparent mt-2 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-gray-100/80 to-transparent pointer-events-none z-0" />
          <div className="relative z-10">
            <Hero />
          </div>
        </section>
        <Categories />
        <Numbers />
        <SearchBy />
        <Faculties />
        <CAInterClasses />
        <CMAInterClasses />
        <Partners />
        <Reviews />
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
} 