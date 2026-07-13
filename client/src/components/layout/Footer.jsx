import React, { useState } from 'react';
import VenomBeam from '../ui/venom-beam';
import whatsappLogo from '../../assets/whatsapp.png';
import telegramLogo from '../../assets/telegram.png';
import linkedinLogo from '../../assets/linkedin.png';

export default function Footer() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: 'support@academywale.com', // Using support email as no email input field
          subject: 'Request a Call Back',
          message: `Phone Number: ${formData.phoneNumber}\nCity: ${formData.city}`
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ success: true, message: data.message || 'Message sent successfully.' });
        setFormData({ fullName: '', phoneNumber: '', city: '' });
      } else {
        setStatus({ success: false, message: data.message || 'Failed to send message.' });
      }
    } catch (error) {
      setStatus({ success: false, message: 'An error occurred. Please try again later.' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <VenomBeam />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-4 py-6 xs:py-7 sm:py-8 lg:py-12 xl:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-7 sm:gap-8 lg:gap-10 xl:gap-12">
          {/* Company info */}
          <div className="sm:col-span-2 lg:col-span-1 mb-6 xs:mb-7 sm:mb-0">
            <div className="flex items-center space-x-3 mb-3 xs:mb-4 sm:mb-6">
              <img src="/FooterLogo.svg" alt="Academywale Footer Logo" className="h-14 xs:h-16 sm:h-18 lg:h-20 w-auto object-contain" />
            </div>
            <p className="text-gray-300 mb-4 xs:mb-5 sm:mb-6 leading-relaxed text-sm xs:text-sm sm:text-base">
              Academywale is India's most reliable platform for CA & CMA aspirants to access high-quality exam preparation resources. 
              We offer online video lectures, pendrive classes, test series, and study materials from some of the best faculties across the country.
            </p>
            <div className="flex space-x-3 xs:space-x-4 mt-3 xs:mt-4 sm:mt-6">
              <a href="https://chat.whatsapp.com/HmUSCs1IguT7Tew1z82JwO" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block">
                <img src={whatsappLogo} alt="WhatsApp" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </a>
              <a href="https://t.me/CMAspirants_01" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block">
                <img src={telegramLogo} alt="Telegram" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </a>
              <a href="https://www.linkedin.com/in/sourav-pathak-30b385279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="hover:scale-110 active:scale-95 transition-all duration-200 block">
                <img src={linkedinLogo} alt="LinkedIn" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-6 xs:mb-7 sm:mb-0">
            <h4 className="font-heading font-semibold text-base xs:text-lg sm:text-lg mb-3 xs:mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 xs:space-y-2.5 sm:space-y-3">
              <li><a href="/about" className="text-gray-300 hover:text-white transition text-sm xs:text-sm sm:text-base">About Us</a></li>
              <li><a href="/faculties" className="text-gray-300 hover:text-white transition text-sm xs:text-sm sm:text-base">Our Faculties</a></li>
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition text-sm xs:text-sm sm:text-base">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="mb-6 xs:mb-7 sm:mb-0">
            <h4 className="font-heading font-semibold text-base xs:text-lg sm:text-lg mb-3 xs:mb-4 sm:mb-6">Contact Us</h4>
            <div className="space-y-3 xs:space-y-3.5 sm:space-y-4">
              <div className="flex items-center space-x-2 xs:space-x-3">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 text-[#20b2aa] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-300 text-sm xs:text-sm sm:text-base">+91 9693320108</span>
              </div>
              <div className="flex items-center space-x-2 xs:space-x-3">
                <svg className="w-4 h-4 xs:w-5 xs:h-5 text-[#20b2aa] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-300 text-sm xs:text-sm sm:text-base break-all">support@academywale.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
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
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#20b2aa] text-white py-2.5 px-4 rounded-xl font-bold hover:bg-[#17817a] transition-all duration-300 shadow-md hover:shadow-[#20b2aa]/10 hover:scale-[1.01] active:scale-[0.99] text-sm"
              >
                Request a Call Back
              </button>

              <div className="flex items-center justify-center my-4 py-1">
                <span className="h-px bg-gray-800 flex-grow"></span>
                <span className="px-3 text-xs text-gray-500 uppercase tracking-widest font-semibold">or</span>
                <span className="h-px bg-gray-800 flex-grow"></span>
              </div>

              <a 
                href="https://wa.me/919693320108?text=I%20want%20to%20know%20further"
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white py-2.5 px-4 rounded-xl font-bold hover:bg-[#1ebd56] hover:shadow-[0_4px_15px_rgba(37,211,102,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-sm"
              >
                <img src={whatsappLogo} alt="WhatsApp" className="w-5 h-5 object-contain" />
                Chat on WhatsApp
              </a>

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
