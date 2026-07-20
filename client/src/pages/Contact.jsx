import React, { useState } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCommentDots, 
  FaPaperPlane, 
  FaWhatsapp, 
  FaClock, 
  FaGlobe, 
  FaCheckCircle, 
  FaHeadset, 
  FaQuestionCircle 
} from 'react-icons/fa';
import { API_URL } from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact submit error:', err);
      setError('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-850 to-neutral-950 text-white relative overflow-hidden font-sans py-12 sm:py-20">
      
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#20b2aa]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-[#20b2aa] text-xs sm:text-sm font-extrabold uppercase tracking-widest shadow-sm">
            <FaHeadset className="w-4 h-4 animate-bounce" />
            24/7 Student Support & Inquiries
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Get in Touch with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#20b2aa] via-teal-300 to-blue-400 bg-clip-text text-transparent">
              AcademyWale
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-medium">
            Have questions regarding CA, CMA, or CS course admissions, pricing, or technical setup? 
            Our counselors and support team are ready to assist you.
          </p>
        </div>

        {/* MAIN GRID SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Contact Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#20b2aa] via-teal-400 to-blue-500" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Send Us a Message</h2>
            <p className="text-slate-400 text-sm mb-8">Fill out the form below and our team will get back to you within a few hours.</p>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-semibold flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl p-8">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto text-[#20b2aa] text-3xl">
                  <FaCheckCircle />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you for contacting AcademyWale. Our student counselor will reach out to you shortly via Email / WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 inline-block bg-[#20b2aa] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-600 transition-all text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Your Full Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        required
                        disabled={loading}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#20b2aa] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Email Address</label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        required
                        disabled={loading}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#20b2aa] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Phone / WhatsApp Number</label>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                        disabled={loading}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#20b2aa] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Subject / Query Topic</label>
                    <div className="relative">
                      <FaCommentDots className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="e.g. CA Inter Course Inquiry"
                        required
                        disabled={loading}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#20b2aa] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Your Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write your message or inquiry details here..."
                    required
                    disabled={loading}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#20b2aa] focus:border-transparent transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 rounded-xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-[#20b2aa] via-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 shadow-xl hover:shadow-teal-500/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending Your Message...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-lg" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Direct Contact Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-emerald-500/30 shadow-xl hover:border-emerald-500/60 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  <FaWhatsapp />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-extrabold text-white">WhatsApp & Call Support</h3>
                  <p className="text-slate-400 text-xs">Direct instant support for admission & student queries.</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="https://wa.me/919693320108"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                    >
                      <span>+91 9693320108</span>
                    </a>
                    <a
                      href="https://wa.me/916203132544"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 border border-emerald-500/40 transition-colors"
                    >
                      <span>+91 6203132544</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Support Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-teal-500/30 shadow-xl hover:border-teal-500/60 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-[#20b2aa] text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  <FaEnvelope />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-extrabold text-white">Email Us</h3>
                  <p className="text-slate-400 text-xs">Send detailed inquiries, course issues or feedback.</p>
                  <a
                    href="mailto:support@academywale.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[#20b2aa] text-sm font-bold hover:underline"
                  >
                    support@academywale.com
                  </a>
                </div>
              </div>
            </div>

            {/* Website & Portal Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-blue-500/30 shadow-xl hover:border-blue-500/60 transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 text-2xl shrink-0 group-hover:scale-110 transition-transform">
                  <FaGlobe />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-extrabold text-white">Official Learning Portal</h3>
                  <p className="text-slate-400 text-xs">Browse courses, view demos, and manage orders.</p>
                  <a
                    href="https://academywale.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-400 text-sm font-bold hover:underline"
                  >
                    www.academywale.com
                  </a>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-slate-300">
                <FaClock className="text-[#20b2aa] text-lg" />
                <h4 className="text-sm font-extrabold uppercase tracking-wider">Support Timings</h4>
              </div>
              <div className="text-xs text-slate-400 space-y-1 font-medium">
                <p>🗓️ Monday – Saturday: 9:00 AM – 9:00 PM IST</p>
                <p>🗓️ Sunday: 10:00 AM – 6:00 PM IST</p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM QUICK FAQ BAR */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-slate-800">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <FaQuestionCircle className="text-[#20b2aa]" />
              Quick Student Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-[#20b2aa] mb-2">⚡ Instant Course Activation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Courses are automatically linked to your student dashboard immediately upon payment verification.
              </p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-blue-400 mb-2">📄 Tax Invoice Receipts</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A formal tax receipt and confirmation is emailed to your registered email address automatically.
              </p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-amber-400 mb-2">💬 Faculty Doubt Clearing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct WhatsApp and Telegram access for faculty doubt resolution is included with enrolled batches.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
