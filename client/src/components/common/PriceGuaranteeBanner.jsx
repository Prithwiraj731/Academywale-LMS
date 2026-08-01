import React from 'react';
import { FaPhoneAlt, FaTag } from 'react-icons/fa';

export default function PriceGuaranteeBanner() {
  return (
    <div className="w-full bg-red-50/90 border-b border-red-200/80 text-red-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-red-100 p-1.5 rounded-full text-red-600">
            <FaTag className="text-xs sm:text-sm" />
          </span>
          <span className="bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs select-none">
            Best Price Assurance
          </span>
        </div>
        
        <p className="text-xs sm:text-sm font-bold text-red-800 leading-snug tracking-normal">
          Dear Students, If you get the same product on any other website at lower than this price, Kindly get in touch with our Sales Team at{' '}
          <a
            href="tel:+919693320108"
            className="inline-flex items-center gap-1 bg-white hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-300 px-2.5 py-0.5 rounded-lg font-extrabold text-xs sm:text-sm transition-all shadow-xs"
          >
            <FaPhoneAlt className="text-[11px] text-red-600" /> +91 9693320108
          </a>
          . We assure you to provide same discount and some extra reward as well.
        </p>
      </div>
    </div>
  );
}
