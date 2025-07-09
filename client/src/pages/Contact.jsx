import Particles from '../components/common/Particles';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for email.js integration
    setSubmitted(true);
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
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 px-4 bg-transparent">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4 animate-pulse">Contact <span className="text-[#00eaff]">Us</span></h1>
          <p className="text-xl md:text-2xl text-cyan-200 max-w-2xl mx-auto mb-8">We'd love to hear from you! Reach out for support, partnership, or just to say hello. Our team is here 24x7 for you.</p>
        </section>
        {/* Contact Form & Info */}
        <section className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 px-2 sm:px-4 py-6 md:py-10 w-full max-w-6xl mx-auto">
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md border-t-4 border-[#00eaff] flex flex-col gap-4 hover:scale-105 transition-transform">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a6ebd] mb-2">Send a Message</h2>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-sm sm:text-base"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-sm sm:text-base"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              className="bg-[#00eaff] hover:bg-[#0a6ebd] text-white font-bold py-2 px-4 sm:px-6 rounded transition-colors text-base sm:text-lg shadow"
              disabled={submitted}
            >
              {submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
          {/* Contact Info */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 bg-white/90 rounded-2xl shadow-xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md border-t-4 border-[#ffd600] hover:scale-105 transition-transform">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0a6ebd] mb-2">Contact Info</h2>
            <div className="flex flex-col gap-1 sm:gap-2 text-gray-700 text-base sm:text-lg">
              <span><strong>Email:</strong> support@academywale.com</span>
              <span><strong>Phone:</strong> 8910416751</span>
              <span><strong>Website:</strong> www.academywale.com</span>
            </div>
            <div className="flex gap-3 sm:gap-4 mt-2 sm:mt-4">
              <a href="https://wa.me/918910416751" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white rounded-full p-2 sm:p-3 shadow-lg"><i className="fab fa-whatsapp text-xl sm:text-2xl"></i></a>
              <a href="https://www.youtube.com/@AcademyWale" target="_blank" rel="noopener noreferrer" className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 sm:p-3 shadow-lg"><i className="fab fa-youtube text-xl sm:text-2xl"></i></a>
              <a href="https://twitter.com/AcademyWale" target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 sm:p-3 shadow-lg"><i className="fab fa-twitter text-xl sm:text-2xl"></i></a>
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