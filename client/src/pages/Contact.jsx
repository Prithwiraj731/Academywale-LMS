import Particles from '../components/common/Particles';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
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
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {submitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Thank you for your message! We will get back to you soon.
              </div>
            )}
            
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-sm sm:text-base"
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-sm sm:text-base"
              required
              disabled={loading}
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-sm sm:text-base"
              required
              disabled={loading}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="px-3 sm:px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00eaff] text-sm sm:text-base"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className={`font-bold py-2 px-4 sm:px-6 rounded transition-colors text-base sm:text-lg shadow ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#00eaff] hover:bg-[#0a6ebd]'
              } text-white`}
              disabled={loading || submitted}
            >
              {loading ? 'Sending...' : submitted ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
          {/* Contact Info */}
          <div className="flex flex-col items-center gap-4 sm:gap-6 bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md border-2 border-blue-200 hover:scale-105 transition-transform">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2 drop-shadow">Contact Info</h2>
            <div className="flex flex-col gap-4 text-gray-800 text-base sm:text-lg w-full">
              <div className="flex items-center gap-3">
                <span className="text-green-600 text-2xl">🟢</span>
                <span>
                  WhatsApp or call us on
                  <a href="https://wa.me/919693320108" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">+91 9693320108</a>,
                  <a href="https://wa.me/916203132544" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">+91 6203132544</a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-600 text-2xl">✉️</span>
                <span>
                  E-mail your query on
                  <a href="mailto:Support@academywale.com" className="text-blue-600 hover:underline ml-2">Support@academywale.com</a>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 text-2xl">🌐</span>
                <span>
                  Website:
                  <a href="https://academywale.com" className="text-blue-600 hover:underline ml-2" target="_blank" rel="noopener noreferrer">academywale.com</a>
                </span>
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