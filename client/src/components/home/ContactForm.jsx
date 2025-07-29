import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Construct mailto URL with encoded subject and body
    const subject = encodeURIComponent('Request a Call Back');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nPhone Number: ${formData.phone}\nCity: ${formData.city}`
    );
    const mailtoUrl = `mailto:support@academywale.com?subject=${subject}&body=${body}`;

    // Redirect to mailto URL to open user's email client (Gmail)
    window.location.href = mailtoUrl;
  };

  return (
    <section className="py-8 xs:py-10 sm:py-12 bg-white/70">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="text-xl xs:text-2xl md:text-3xl font-bold text-blue-800 mb-6 xs:mb-8 text-center font-pacifico">Get In Touch</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 xs:p-6 sm:p-8 flex flex-col gap-3 xs:gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Request a Call Back
          </button>
        </form>
      </div>
    </section>
  );
}
