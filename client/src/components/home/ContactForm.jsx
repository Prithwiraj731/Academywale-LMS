import React from 'react';

export default function ContactForm() {
  return (
    <section className="py-8 xs:py-10 sm:py-12 bg-white/70">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-blue-800 mb-6 xs:mb-8 text-center font-pacifico">Get In Touch</h2>
        <form className="bg-white rounded-xl shadow p-4 xs:p-6 sm:p-8 flex flex-col gap-3 xs:gap-4">
          <input type="text" placeholder="Full Name" className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base" />
          <input type="text" placeholder="Phone Number" className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base" />
          <input type="text" placeholder="City" className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base" />
          <button type="submit" className="bg-blue-600 text-white rounded px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base font-semibold hover:bg-blue-700">Request a Call Back</button>
        </form>
      </div>
    </section>
  );
}