import React, { useState } from 'react';
import VenomBeam from '../ui/venom-beam';

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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 xs:py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8 lg:gap-12">
          {/* Company info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <img src="/FooterLogo.svg" alt="Academywale Footer Logo" className="h-16 sm:h-20 w-auto object-contain" />
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Academywale is India's most reliable platform for CA & CMA aspirants to access high-quality exam preparation resources. 
              We offer online video lectures, pendrive classes, test series, and study materials from some of the best faculties across the country.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-6">
              <a href="https://chat.whatsapp.com/HmUSCs1IguT7Tew1z82JwO" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition">
                {/* Official WhatsApp Logo */}
                <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#25D366"/>
                  <path d="M21.6 18.7c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.6-.3z" fill="#fff"/>
                  <path d="M16 6.2c-5.4 0-9.8 4.4-9.8 9.8 0 1.7.4 3.3 1.2 4.7l-1.3 4.7 4.8-1.3c1.3.7 2.8 1.1 4.3 1.1 5.4 0 9.8-4.4 9.8-9.8S21.4 6.2 16 6.2zm0 17.6c-1.4 0-2.7-.4-3.9-1.1l-.3-.2-2.8.7.7-2.7-.2-.3c-.7-1.2-1.1-2.6-1.1-4 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2z" fill="#fff"/>
                </svg>
              </a>
              <a href="https://t.me/CMAspirants_01" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition">
                {/* Telegram Brand Icon */}
                <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#229ED9"/>
                  <path d="M23.707 9.293a1 1 0 0 0-1.02-.242l-13 5a1 1 0 0 0 .09 1.89l3.44 1.15 1.32 4.41a1 1 0 0 0 1.77.27l2.02-2.53 3.36 2.48a1 1 0 0 0 1.58-.57l2-9a1 1 0 0 0-.56-1.18zm-2.13 2.14-7.19 4.7a.5.5 0 0 0 .11.89l2.13.71a.5.5 0 0 1 .31.31l.66 2.2a.5.5 0 0 0 .89.13l1.01-1.27a.5.5 0 0 1 .7-.09l1.77 1.31a.5.5 0 0 0 .8-.29l1.5-6.75a.5.5 0 0 0-.74-.55z" fill="#fff"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/about" className="text-gray-300 hover:text-white transition text-sm sm:text-base">About Us</a></li>
              <li><a href="/faculties" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Our Faculties</a></li>
              <li><a href="/privacy-policy" className="text-gray-300 hover:text-white transition text-sm sm:text-base">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 sm:mb-6">Contact Us</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#20b2aa] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-300 text-sm sm:text-base">+91 9693320108</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-[#20b2aa] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-gray-300 text-sm sm:text-base break-all">support@academywale.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-heading font-semibold text-lg mb-4 sm:mb-6">Get In Touch</h4>
            <p className="text-gray-300 mb-4 text-sm sm:text-base">
              Simply fill out the form to request a callback from one of our team members.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                type="text" 
                name="fullName" 
                placeholder="Full Name" 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#20b2aa] text-sm sm:text-base"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input 
                type="text" 
                name="phoneNumber" 
                placeholder="Phone Number" 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#20b2aa] text-sm sm:text-base"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
              <input 
                type="text" 
                name="city" 
                placeholder="City" 
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#20b2aa] text-sm sm:text-base"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <button 
                type="submit" 
                className="w-full bg-[#20b2aa] text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:bg-[#17817a] transition text-sm sm:text-base"
              >
                Request a Call Back
              </button>
              {status && (
                <p className={`mt-3 text-center ${status.success ? 'text-green-600' : 'text-red-600'}`}>
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 xs:py-5 sm:py-6">
          <div className="flex flex-col xs:flex-row justify-between items-center">
            <div className="text-gray-300 text-xs xs:text-sm mb-2 xs:mb-0 font-medium">
              ©2025 Academywale. All Rights Reserved.
            </div>
            <div className="text-gray-300 text-xs xs:text-sm font-medium">
              Designed and developed by <a href="https://www.linkedin.com/in/prithwiraj-mazumdar-963086291/" className="hover:text-[#20b2aa] transition-colors">Prithwiraj</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
