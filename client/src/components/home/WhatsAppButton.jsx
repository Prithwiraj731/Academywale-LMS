import React from 'react';
import whatsappLogo from '../../assets/whatsapp.png';
import { MorphyButton } from '../ui/morphy-button';

export default function WhatsAppButton() {
  const phoneNumber = '919693320108'; 
  const message = 'I want to know further'; 
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden border-t border-gray-100">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        {/* Badge */}
        <span className="text-xs font-extrabold text-[#20b2aa] uppercase tracking-widest bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-100/60 shadow-sm mb-4">
          Instant Support
        </span>
        
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight mb-3">
          Have Questions? <span className="text-[#20b2aa]">Get in Touch</span>
        </h2>
        
        {/* Subtitle */}
        <p className="text-gray-500 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
          Need help picking a course or having payment issues? Connect with our expert advisors directly on WhatsApp.
        </p>

        {/* WhatsApp Button */}
        <MorphyButton
          asChild
          variant="whatsapp"
          size="lg"
          className="shadow-lg hover:shadow-[0_12px_24px_rgba(37,211,102,0.25)] h-14 px-8 rounded-2xl"
        >
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {/* Official WhatsApp Logo */}
            <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6 object-contain group-hover:rotate-12 transition-transform duration-300" />
            Chat with us on WhatsApp
          </a>
        </MorphyButton>
      </div>
    </section>
  );
}