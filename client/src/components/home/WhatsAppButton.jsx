import React from 'react';

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
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#25D366] to-[#1cbd57] hover:from-[#22c35e] hover:to-[#17a84c] text-white font-extrabold rounded-2xl text-lg shadow-lg hover:shadow-[0_12px_24px_rgba(37,211,102,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-300 focus:outline-none"
        >
          {/* Official WhatsApp SVG logo without outer circles in path */}
          <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402.002 9.799-4.382 9.802-9.77.001-2.61-1.01-5.063-2.846-6.9C16.393 2.1 13.94 1.088 11.332 1.087 5.928 1.087 1.53 5.472 1.528 10.86c0 1.561.432 3.09 1.25 4.43l-.329 1.2.04-.017.067.11 1.706-1.127 1.037.615zM17.487 14.39c-.3-.15-1.774-.875-2.05-.975-.276-.1-.476-.15-.676.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.892-.796-1.493-1.78-1.668-2.08-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.925-2.235-.24-.58-.485-.503-.676-.513-.175-.01-.375-.01-.575-.01-.2 0-.525.075-.8 1.025-.275.95-1.05 3.098-1.05 3.2 0 .1.1.225.25.4.15.175 1.83 2.795 4.43 3.92.617.267 1.1.425 1.475.545.62.195 1.18.168 1.625.102.495-.073 1.775-.725 2.025-1.425.25-.7.25-1.3.175-1.425-.076-.125-.276-.2-.576-.35z"/>
          </svg>
          Chat with us on WhatsApp
        </a>
      </div>
    </section>
  );
}