import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitted || loading) return; // prevent multiple submissions

    setLoading(true);

    const payload = {
      name: formData.name,
      email: 'no-reply@academywale.com', // placeholder since no email input
      subject: 'Request a Call Back',
      message: `Phone Number: ${formData.phone}\nCity: ${formData.city}`,
    };

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      // Fail silently, do not show error to user
      setLoading(false);
      setSubmitted(true);
    }
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
            disabled={submitted || loading}
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={submitted || loading}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="px-3 xs:px-4 py-2 xs:py-3 rounded border text-sm xs:text-base"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={submitted || loading}
          />
          <button
            type="submit"
            disabled={submitted || loading}
            className={`bg-blue-600 text-white rounded px-3 xs:px-4 py-2 xs:py-3 text-sm xs:text-base font-semibold hover:bg-blue-700 transition-colors duration-300 ${submitted || loading ? 'cursor-default' : ''}`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : submitted ? (
              'We will get back soon'
            ) : (
              'Request a Call Back'
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
