import React from 'react';
import { FaPhoneAlt, FaTag } from 'react-icons/fa';

export default function PriceGuaranteeBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md border-b border-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-white/20 p-1.5 rounded-full text-yellow-300 animate-pulse">
            <FaTag className="text-xs sm:text-sm" />
          </span>
          <span className="bg-yellow-400 text-indigo-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm select-none">
            Best Price Assurance
          </span>
        </div>
        
        <p className="text-xs sm:text-sm md:text-base font-semibold leading-snug tracking-normal">
          Dear Students, If you get the same product on any other website at lower than this price, Kindly get in touch with our Sales Team at{' '}
          <a
            href="tel:+919693320108"
            className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-0.5 rounded-lg underline font-extrabold text-yellow-200 hover:text-white transition-all underline-offset-2"
          >
            <FaPhoneAlt className="text-[10px]" /> +91 9693320108
          </a>
          . We assure you to provide same discount and some extra reward as well.
        </p>
      </div>
    </div>
  );
}
