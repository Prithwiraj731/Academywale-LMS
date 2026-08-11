import React, { useState } from 'react';
import { 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaClock, FaPaperPlane 
} from 'react-icons/fa';
import { AlertTriangle, Calendar, Zap, FileText, MessageSquare, HelpCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    subject: 'Course Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#20b2aa]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#20b2aa]/10 border border-[#20b2aa]/30 text-[#20b2aa] text-xs font-extrabold uppercase tracking-widest">
            Contact & Support
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            We're Here to Help You <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20b2aa] to-teal-300">Succeed</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Have a question regarding CA or CMA courses, mode selection, or delivery? Reach out to our dedicated support team.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Contact Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#20b2aa] via-teal-400 to-blue-500" />
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Send Us a Message</h2>
            <p className="text-slate-400 text-sm mb-8">Fill out the form below and our team will get back to you within a few hours.</p>

            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-semibold flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-teal-500/10 border border-teal-500/30 rounded-2xl p-8">
                <div className="w-16 h-16 bg-[#20b2aa] rounded-full flex items-center justify-center mx-auto text-white text-3xl font-bold">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">Thank You!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Your message has been received. Our course advisor will contact you on your email or mobile shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ fullName: '', email: '', mobile: '', subject: 'Course Inquiry', message: '' }); }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa] text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@gmail.com"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa] text-sm transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa] text-sm transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Inquiry Category
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:border-[#20b2aa] text-sm transition"
                    >
                      <option value="Course Inquiry">CA / CMA Course Inquiry</option>
                      <option value="Payment Issue">Payment & Order Inquiry</option>
                      <option value="Mode Support">Drive Link & Mobile App Support</option>
                      <option value="Book Delivery">Book / Study Material Dispatch</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Message / Query Details *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what course you are looking for or any specific doubts..."
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#20b2aa] focus:ring-1 focus:ring-[#20b2aa] text-sm transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#20b2aa] to-teal-500 hover:from-teal-600 hover:to-teal-400 text-slate-950 font-black text-base shadow-lg shadow-[#20b2aa]/20 transition-all flex items-center justify-center gap-3 ${
                    loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.01]'
                  }`}
                >
                  <FaPaperPlane />
                  <span>{loading ? 'Submitting Message...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl flex items-start gap-4 hover:border-[#20b2aa]/50 transition group">
              <div className="w-12 h-12 rounded-2xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                <FaPhoneAlt />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Phone & Call Support</h4>
                <p className="text-lg font-bold text-white tracking-wide">+91 9693320108</p>
                <p className="text-xs text-slate-400">Direct helpline for admissions and queries</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <a
              href="https://wa.me/919693320108"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl flex items-start gap-4 hover:border-emerald-500/50 transition group block"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition">
                <FaWhatsapp />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Instant WhatsApp Support</h4>
                <p className="text-lg font-bold text-white tracking-wide">Chat on WhatsApp</p>
                <p className="text-xs text-slate-400">Get quick replies for course details & links</p>
              </div>
            </a>

            {/* Email Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl flex items-start gap-4 hover:border-blue-500/50 transition group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                <FaEnvelope />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Official Email</h4>
                <p className="text-base font-bold text-white tracking-wide">support@academywale.com</p>
                <p className="text-xs text-slate-400">For formal queries and transaction receipts</p>
              </div>
            </div>

            {/* Office Address Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl flex items-start gap-4 hover:border-purple-500/50 transition group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                <FaMapMarkerAlt />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Headquarter Office</h4>
                <p className="text-sm font-bold text-white leading-snug">AcademyWale Education Center</p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hotel Grand, Purana Bazar , Bank More, Dhanbad - 826001
                </p>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-3 mb-3 text-slate-300">
                <FaClock className="text-[#20b2aa] text-lg" />
                <h4 className="text-sm font-extrabold uppercase tracking-wider">Support Timings</h4>
              </div>
              <div className="text-xs text-slate-400 space-y-1.5 font-medium">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Monday – Saturday: 9:00 AM – 9:00 PM IST</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Sunday: 10:00 AM – 6:00 PM IST</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM QUICK FAQ BAR */}
        <div className="mt-16 sm:mt-24 pt-10 border-t border-slate-800">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#20b2aa]" />
              Quick Student Information
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-[#20b2aa] mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Instant Course Activation</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Courses are automatically linked to your student dashboard immediately upon payment verification.
              </p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Tax Invoice Receipts</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A formal tax receipt and confirmation is emailed to your registered email address automatically.
              </p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-amber-400 mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Faculty Doubt Clearing</span>
              </h4>
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
