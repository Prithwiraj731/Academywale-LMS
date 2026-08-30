import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import VenomBeam from '../ui/venom-beam';
import whatsappLogo from '../../assets/whatsapp.png';
import telegramLogo from '../../assets/telegram.png';
import linkedinLogo from '../../assets/linkedin.png';
import { MorphyButton } from '../ui/morphy-button';
import { API_URL } from '../../api';

export default function Footer() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          fullName: formData.fullName,
          phone: formData.phoneNumber,
          phoneNumber: formData.phoneNumber,
          city: formData.city,
          email: 'support@academywale.com',
          subject: 'Request a Call Back (Footer Form)',
          message: `Request a call back submitted from Footer Form.\nPhone: ${formData.phoneNumber}\nCity: ${formData.city}`
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setStatus({ success: true, message: data.message || 'Message sent successfully.' });
        setFormData({ fullName: '', phoneNumber: '', city: '' });
      } else {
        setStatus({ success: false, message: data.message || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ success: false, message: 'An error occurred. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <VenomBeam />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-4 py-6 xs:py-7 sm:py-8 lg:py-12 xl:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6 xl:gap-8">
          {/* Company info */}
          <div className="sm:col-span-2 lg:col-span-2 mb-6 sm:mb-0">
            <div className="flex items-center space-x-3 mb-3 sm:mb-6">
              <img src="/FooterLogo.svg" alt="Academywale Footer Logo" className="h-14 sm:h-18 lg:h-20 w-auto object-contain" />
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm">
              Academywale is India's premier academic platform for CA & CMA aspirants. We provide structured video lectures, test series, syllabus blueprints, revision notes, and comprehensive exam preparation guidance from India's top faculties.
            </p>
            <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-6">
              <a href="https://chat.whatsapp.com/HmUSCs1IguT7Tew1z82JwO" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block" title="WhatsApp Community">
                <img src={whatsappLogo} alt="WhatsApp" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </a>
              <a href="https://t.me/CMAspirants_010" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block" title="Telegram Channel">
                <img src={telegramLogo} alt="Telegram" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </a>
              <a href="https://www.linkedin.com/in/sourav-pathak-30b385279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block" title="LinkedIn">
                <img src={linkedinLogo} alt="LinkedIn" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-6 sm:mb-0">
            <h4 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-6 text-white border-l-4 border-[#20b2aa] pl-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-[#20b2aa] transition">About Us</Link></li>
              <li><Link to="/courses/all" className="text-gray-300 hover:text-[#20b2aa] transition">All Courses</Link></li>
              <li><Link to="/test-series" className="text-gray-300 hover:text-[#20b2aa] transition">Test Series Hub</Link></li>
              <li><Link to="/faculties" className="text-gray-300 hover:text-[#20b2aa] transition">Top Faculties</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[#20b2aa] transition">Contact Us</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-[#20b2aa] transition">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="text-gray-300 hover:text-[#20b2aa] transition">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-gray-300 hover:text-[#20b2aa] transition">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Free Learning Hub */}
          <div className="mb-6 sm:mb-0">
            <h4 className="font-heading font-semibold text-base sm:text-lg mb-3 sm:mb-6 text-white border-l-4 border-teal-400 pl-3">Learning Hub</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources" className="text-teal-300 hover:text-teal-200 font-bold transition">All Free Resources</Link></li>
              <li><Link to="/resources/ca" className="text-gray-300 hover:text-[#20b2aa] transition">CA Study Guides</Link></li>
              <li><Link to="/resources/cma" className="text-gray-300 hover:text-[#20b2aa] transition">CMA Study Guides</Link></li>
              <li><Link to="/resources/notes" className="text-gray-300 hover:text-[#20b2aa] transition">Ind AS & SFM Notes</Link></li>
              <li><Link to="/resources/mcqs" className="text-gray-300 hover:text-[#20b2aa] transition">Interactive MCQs</Link></li>
              <li><Link to="/resources/exam-preparation" className="text-gray-300 hover:text-[#20b2aa] transition">3-Hour Exam Masterclass</Link></li>
              <li><Link to="/resources/exam-updates" className="text-gray-300 hover:text-[#20b2aa] transition">Passing Criteria & Set-off</Link></li>
            </ul>
          </div>

          {/* Contact & Request Call Back Form */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-heading font-semibold text-base xs:text-lg sm:text-lg mb-3 xs:mb-4 sm:mb-6 text-white border-l-4 border-[#20b2aa] pl-3">Get In Touch</h4>
            <p className="text-gray-300 mb-4 text-xs xs:text-sm leading-relaxed">
              Have questions? Fill out the form below to request a call back, or reach out to us instantly on WhatsApp.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative group">
                <input 
                  type="text" 
                  name="fullName" 
                  placeholder="Full Name" 
                  className="w-full px-3.5 py-2.5 bg-gray-800/80 border border-gray-700/85 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/20 transition-all duration-300 text-sm hover:border-gray-600"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  name="phoneNumber" 
                  placeholder="Phone Number" 
                  className="w-full px-3.5 py-2.5 bg-gray-800/80 border border-gray-700/85 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/20 transition-all duration-300 text-sm hover:border-gray-600"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="relative group">
                <input 
                  type="text" 
                  name="city" 
                  placeholder="City" 
                  className="w-full px-3.5 py-2.5 bg-gray-800/80 border border-gray-700/85 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/20 transition-all duration-300 text-sm hover:border-gray-600"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <MorphyButton 
                type="submit" 
                size="default"
                className="w-full shadow-md hover:shadow-[#20b2aa]/10 font-bold"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Request a Call Back'}
              </MorphyButton>


              {status && (
                <p className={`mt-3 text-center text-xs ${status.success ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-4 py-3 xs:py-4 sm:py-5 lg:py-6">
          <div className="flex flex-col xs:flex-row justify-between items-center">
            <div className="text-gray-300 text-xs xs:text-xs sm:text-sm mb-2 xs:mb-0 font-medium text-center xs:text-left">
              ©2025 Academywale. All Rights Reserved.
            </div>
            <div className="text-gray-300 text-xs xs:text-xs sm:text-sm font-medium text-center xs:text-right">
              Designed and developed by <a href="https://www.linkedin.com/in/prithwiraj-mazumdar-963086291/" className="hover:text-[#20b2aa] transition-colors">Prithwiraj</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
