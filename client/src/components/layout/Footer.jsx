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
              <a href="https://chat.whatsapp.com/HmUSCs1IguT7Tew1z82JwO" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition shadow-md hover:shadow-green-500/20 hover:-translate-y-0.5 duration-200">
                {/* Official WhatsApp Logo */}
                <svg className="w-5.5 h-5.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402.002 9.799-4.382 9.802-9.77.001-2.61-1.01-5.063-2.846-6.9C16.393 2.1 13.94 1.088 11.332 1.087 5.928 1.087 1.53 5.472 1.528 10.86c0 1.561.432 3.09 1.25 4.43l-.329 1.2.04-.017.067.11 1.706-1.127 1.037.615zM17.487 14.39c-.3-.15-1.774-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.493-1.78-1.668-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.925-2.235-.24-.58-.485-.503-.676-.513-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.025-.275.95-1.05 3.098-1.05 3.2 0 .1.1.225.25.4.15.175 1.83 2.795 4.43 3.92.617.267 1.1.425 1.475.545.62.195 1.18.168 1.625.102.495-.073 1.775-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.076-.125-.276-.2-.576-.35z"/>
                </svg>
              </a>
              <a href="https://t.me/CMAspirants_01" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 duration-200">
                {/* Telegram Brand Icon */}
                <svg className="w-5.5 h-5.5 text-white mr-[1px] mt-[0.5px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.78 18.65l.28-4.28 7.76-7.01c.34-.3-.07-.47-.52-.17L7.74 12.5 3.59 11.2c-.9-.28-.92-.9.19-1.33L20.1 3.5c.75-.28 1.4.17 1.15 1.16l-2.87 13.5c-.21.99-.8 1.24-1.63.78l-4.42-3.25-2.13 2.05c-.24.24-.44.44-.9.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/sourav-pathak-30b385279?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition shadow-md hover:shadow-blue-700/20 hover:-translate-y-0.5 duration-200">
                {/* LinkedIn Brand Icon */}
                <svg className="w-5.5 h-5.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
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
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white py-2.5 px-4 rounded-xl font-bold hover:bg-[#1ebd56] hover:shadow-[0_4px_15px_rgba(37,211,102,0.2)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 text-sm"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402.002 9.799-4.382 9.802-9.77.001-2.61-1.01-5.063-2.846-6.9C16.393 2.1 13.94 1.088 11.332 1.087 5.928 1.087 1.53 5.472 1.528 10.86c0 1.561.432 3.09 1.25 4.43l-.329 1.2.04-.017.067.11 1.706-1.127 1.037.615zM17.487 14.39c-.3-.15-1.774-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.493-1.78-1.668-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.925-2.235-.24-.58-.485-.503-.676-.513-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.025-.275.95-1.05 3.098-1.05 3.2 0 .1.1.225.25.4.15.175 1.83 2.795 4.43 3.92.617.267 1.1.425 1.475.545.62.195 1.18.168 1.625.102.495-.073 1.775-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.076-.125-.276-.2-.576-.35z"/>
                </svg>
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
