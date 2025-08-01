import React from 'react';

export default function WhatsAppButton() {
  const phoneNumber = '919693320108'; // Replace with your actual WhatsApp number
  const message = 'I want to know further'; // Default message
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <section className="py-8 xs:py-10 sm:py-12 bg-white/70">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-blue-800 mb-6 xs:mb-8 text-center font-pacifico">Get In Touch</h2>
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:bg-green-600 transition-all duration-300 animate-pulse hover:animate-none transform hover:scale-105"
        >
          <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#25D366"/>
            <path d="M21.6 18.7c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5.1 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.6-.3z" fill="#fff"/>
            <path d="M16 6.2c-5.4 0-9.8 4.4-9.8 9.8 0 1.7.4 3.3 1.2 4.7l-1.3 4.7 4.8-1.3c1.3.7 2.8 1.1 4.3 1.1 5.4 0 9.8-4.4 9.8-9.8S21.4 6.2 16 6.2zm0 17.6c-1.4 0-2.7-.4-3.9-1.1l-.3-.2-2.8.7.7-2.7-.2-.3c-.7-1.2-1.1-2.6-1.1-4 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8.2-8.2 8.2z" fill="#fff"/>
          </svg>
          Chat with us on WhatsApp
        </a>
      </div>
    </section>
  );
}