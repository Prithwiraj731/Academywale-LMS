import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Cookie, 
  FileText, 
  Eye, 
  CreditCard, 
  Truck, 
  Users, 
  Bell, 
  HelpCircle, 
  ExternalLink, 
  CheckCircle2, 
  Globe, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    document.title = 'Privacy Policy | AcademyWale';
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'intro', title: '1. Introduction & Overview' },
    { id: 'collect', title: '2. Information We Collect' },
    { id: 'how-we-use', title: '3. How We Use Your Information' },
    { id: 'log-files', title: '4. Log Files & Analytics' },
    { id: 'cookies', title: '5. Cookies & Tracking Technologies' },
    { id: 'adsense', title: '6. Google AdSense & Third-Party Ads' },
    { id: 'payments', title: '7. Payment Security' },
    { id: 'partners', title: '8. Logistics & Faculty Partners' },
    { id: 'security', title: '9. Data Security & Storage' },
    { id: 'children', title: "10. Children's Information" },
    { id: 'rights', title: '11. Your Data Rights' },
    { id: 'contact', title: '12. Grievance & Contact Us' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-5 w-96 h-96 bg-[#20b2aa]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 right-5 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* BREADCRUMB & HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#20b2aa]/10 border border-[#20b2aa]/30 text-[#20b2aa] text-xs font-extrabold uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Legal & Compliance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20b2aa] to-teal-300">Policy</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            At <strong className="text-white">AcademyWale</strong>, we prioritize the confidentiality and protection of your personal information. This Privacy Policy details our data collection, security standards, and third-party advertising transparency.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-[#20b2aa]" /> Last Updated: August 2026
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-[#20b2aa]" /> Applies to: academywale.com
            </span>
          </div>
        </div>

        {/* QUICK NAVIGATION CHIPS */}
        <div className="mb-10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 border border-slate-800 shadow-lg">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#20b2aa]" /> Quick Navigation
          </div>
          <div className="flex flex-wrap gap-2">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all duration-200 text-left ${
                  activeSection === sec.id
                    ? 'bg-[#20b2aa] text-slate-950 font-bold border-[#20b2aa]'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-[#20b2aa]/50 hover:text-white'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTENT AREA */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Section 1: Introduction */}
            <div id="intro" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Introduction & Platform Scope</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  Welcome to <strong>AcademyWale</strong> (<a href="https://academywale.com" className="text-[#20b2aa] underline">https://academywale.com</a>), an online educational portal dedicated to serving Chartered Accountancy (CA) and Cost & Management Accountancy (CMA) aspirants across India.
                </p>
                <p>
                  This Privacy Policy governs the manner in which AcademyWale collects, uses, maintains, and discloses information gathered from users across our website, mobile interface, course checkout forms, and customer communication channels.
                </p>
                <p>
                  By accessing or utilizing our website, browsing course catalogs, enrolling in classes, purchasing study materials, or interacting with our counselors, you signify your acceptance of this policy.
                </p>
              </div>
            </div>

            {/* Section 2: Information We Collect */}
            <div id="collect" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  We collect information in several ways depending on your interaction with AcademyWale:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#20b2aa]" /> Personal Identifiers
                    </h3>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      <li>Full Legal Name</li>
                      <li>Email Address</li>
                      <li>Contact Mobile & WhatsApp Number</li>
                      <li>Course Stream & Level (e.g. CA Inter, CMA Final)</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#20b2aa]" /> Shipping & Fulfillment
                    </h3>
                    <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                      <li>Complete Postal Shipping Address</li>
                      <li>City, State & Postal PIN Code</li>
                      <li>Alternate delivery contact number</li>
                      <li>Selected mode (Google Drive / Pen Drive / Hard Copy)</li>
                    </ul>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Technical Device Data:</strong> We may collect non-identifiable technical information when you browse our site, such as browser type, operating system version, screen resolution, IP address, and interaction analytics.
                </p>
              </div>
            </div>

            {/* Section 3: How We Use Your Information */}
            <div id="how-we-use" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>AcademyWale utilizes the collected data strictly for lawful and authorized educational purposes, including:</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold">✓</span>
                    <span><strong>Order Fulfillment:</strong> Provisioning digital course access links, serial software activation keys, and dispatching physical books and pendrives.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold">✓</span>
                    <span><strong>Student Academic Support:</strong> Assisting in software player activation, answering syllabus queries, and resolving technical playback issues.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold">✓</span>
                    <span><strong>Operational Communication:</strong> Sending order confirmations, invoice receipts, shipment tracking numbers, and critical exam amendment notices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold">✓</span>
                    <span><strong>Security & Fraud Prevention:</strong> Protecting against unauthorized software piracy, multiple device credential sharing, and unauthorized transactions.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 4: Log Files */}
            <div id="log-files" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Log Files & Web Analytics</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  AcademyWale follows standard website maintenance procedures by utilizing log files. These files automatically log visitors when they access the platform.
                </p>
                <p>
                  The information recorded in log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamps, referring/exit pages, and click paths. This information is not linked to any personally identifiable information and is used exclusively for analyzing web traffic trends, administering the site, tracking user movement, and server health diagnostics.
                </p>
              </div>
            </div>

            {/* Section 5: Cookies */}
            <div id="cookies" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Cookies & Web Beacons</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  Like most modern platforms, AcademyWale uses "cookies". Cookies are small text files placed on your device to store user preferences, optimize session persistence (such as shopping cart and authentication state), and tailor web page content according to your browser settings.
                </p>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Cookie className="w-4 h-4 text-[#20b2aa]" /> Cookie Management & Disabling
                  </h3>
                  <p className="text-xs text-slate-400">
                    You can choose to disable cookies through your individual browser options (such as Chrome, Firefox, Safari, or Edge settings). Please note that disabling cookies may impair certain features, such as cart retention and authenticated dashboard sessions.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Google AdSense & Third-Party Advertising */}
            <div id="adsense" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  6
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Google AdSense & Third-Party Advertising</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  To support our operational infrastructure and provide free preparatory resources, AcademyWale may partner with third-party advertising networks, including <strong>Google AdSense</strong>.
                </p>
                
                <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#20b2aa]" /> Google DoubleClick DART Cookie
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Google is a third-party vendor on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <code className="text-[#20b2aa] bg-slate-900 px-1 py-0.5 rounded">academywale.com</code> and other websites on the internet.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL:{' '}
                    <a 
                      href="https://policies.google.com/technologies/ads" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#20b2aa] underline inline-flex items-center gap-1 font-semibold"
                    >
                      Google Ads Policies <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-400">
                  <p>
                    Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on AcademyWale. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                  </p>
                  <p>
                    <strong className="text-slate-300">Note:</strong> AcademyWale has no access to or control over cookies used by third-party advertisers. We advise you to consult the respective Privacy Policies of these third-party ad servers for detailed information.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7: Payment Security */}
            <div id="payments" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  7
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Payment & Financial Information Security</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  All commercial transactions and course payments on AcademyWale are processed through industry-standard, PCI-DSS compliant payment gateways (such as Razorpay, authorized UPI QR rails, and Net Banking gateways).
                </p>
                <div className="p-4 rounded-2xl bg-[#20b2aa]/5 border border-[#20b2aa]/20 text-slate-300 text-xs sm:text-sm space-y-1">
                  <strong className="text-white block font-bold">Zero Credential Storage Guarantee:</strong>
                  <span>AcademyWale does NOT store, capture, or have access to your full credit card numbers, debit card CVV, bank passwords, or UPI MPINs on our web servers. All payment transactions occur over 256-bit SSL encrypted pipelines directly with the financial processor.</span>
                </div>
              </div>
            </div>

            {/* Section 8: Logistics & Partners */}
            <div id="partners" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  8
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Logistics, Couriers & Faculty Partners</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  AcademyWale operates as an authorized educational partner for leading CA/CMA educators and coaching institutes (such as SJC Institute, Bishnu Kedia Classes, and renowned faculties).
                </p>
                <p>
                  To fulfill your order:
                </p>
                <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-300">
                  <li><strong>Physical Study Material:</strong> Your name, delivery address, and contact number are shared with verified courier partners (e.g. DTDC, Delhivery, Speed Post) solely for dispatch and tracking.</li>
                  <li><strong>Digital Lectures:</strong> Your email and contact details are used to issue authorized Google Drive access, software player license serial keys, and exam amendments.</li>
                </ul>
                <p className="text-xs text-slate-400">
                  We strictly prohibit our fulfillment partners from using your personal information for independent marketing or unsolicited communications.
                </p>
              </div>
            </div>

            {/* Section 9: Data Security */}
            <div id="security" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  9
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Data Security & Retention</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  We implement administrative, technical, and physical safeguards designed to protect personal information against unauthorized access, accidental loss, destruction, or disclosure.
                </p>
                <p>
                  We retain personal information for as long as necessary to provide purchased educational courses, resolve disputes, satisfy accounting audits, and comply with legal requirements under applicable Indian laws.
                </p>
              </div>
            </div>

            {/* Section 10: Children's Information */}
            <div id="children" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  10
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Children's Privacy Protection</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  AcademyWale is designed for higher education students and professionals preparing for professional examinations (CA Foundation, Inter, Final and CMA Foundation, Inter, Final).
                </p>
                <p>
                  We do not knowingly collect any personally identifiable information from children under the age of 13. If a parent or guardian believes that a child under 13 has provided personal data to us, please contact us immediately and we will promptly remove such information from our records.
                </p>
              </div>
            </div>

            {/* Section 11: Your Rights */}
            <div id="rights" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  11
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Your Data Protection Rights</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>As a valued student, you possess the following rights regarding your personal information:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">Right to Access</strong>
                    <span className="text-slate-400">Request a copy of the personal information stored in your student profile.</span>
                  </div>
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">Right to Rectification</strong>
                    <span className="text-slate-400">Request correction of inaccurate email, phone number, or shipping address.</span>
                  </div>
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">Right to Erasure</strong>
                    <span className="text-slate-400">Request deletion of your data once active course license periods have concluded.</span>
                  </div>
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1">Opt-Out of Marketing</strong>
                    <span className="text-slate-400">Unsubscribe from non-essential promotional SMS or discount email updates anytime.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 12: Contact & Grievance */}
            <div id="contact" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  12
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Grievance Officer & Contact Information</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact our support team:
                </p>

                <div className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-[#20b2aa] shrink-0" />
                    <span className="text-xs sm:text-sm">
                      <strong className="text-white">Email:</strong>{' '}
                      <a href="mailto:support@academywale.com" className="text-[#20b2aa] underline">support@academywale.com</a>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaWhatsapp className="text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm">
                      <strong className="text-white">WhatsApp Helpline:</strong>{' '}
                      <a href="https://wa.me/919693320108" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">+91 9693320108</a>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-purple-400 shrink-0 mt-1" />
                    <span className="text-xs sm:text-sm">
                      <strong className="text-white">Center Office:</strong>{' '}
                      AcademyWale Education Center, Hotel Grand, Purana Bazar, Bank More, Dhanbad - 826001, Jharkhand, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR: QUICK LINKS & SUMMARY */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            
            {/* Quick Summary Card */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-[#20b2aa]" /> Privacy Highlights
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>We never sell or rent your personal information to unverified third parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Card and bank payment processing is handled through PCI-DSS encrypted gateways.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>You can opt out of personalized Google advertising at any time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Shipping addresses are strictly used for study material physical dispatches.</span>
                </li>
              </ul>
            </div>

            {/* Other Legal Pages Links */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Related Legal Documents
              </h3>
              <Link 
                to="/terms-and-conditions"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-[#20b2aa]/50 text-sm font-semibold text-slate-200 hover:text-white transition group"
              >
                <span>Terms & Conditions</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#20b2aa] group-hover:translate-x-0.5 transition" />
              </Link>
              <Link 
                to="/disclaimer"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-[#20b2aa]/50 text-sm font-semibold text-slate-200 hover:text-white transition group"
              >
                <span>Disclaimer</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#20b2aa] group-hover:translate-x-0.5 transition" />
              </Link>
              <Link 
                to="/contact"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-[#20b2aa]/50 text-sm font-semibold text-slate-200 hover:text-white transition group"
              >
                <span>Contact & Support</span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#20b2aa] group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            {/* Direct Helpline Card */}
            <div className="bg-gradient-to-br from-[#20b2aa]/20 to-teal-900/40 rounded-[28px] p-6 border border-[#20b2aa]/30 space-y-3 text-center">
              <h4 className="text-white font-bold text-sm">Need Help or Clarification?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our support counselors are available to assist you with course registration, enrollment, or privacy queries.
              </p>
              <a
                href="https://wa.me/919693320108"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#20b2aa] text-slate-950 font-black text-xs hover:bg-teal-400 transition"
              >
                <FaWhatsapp className="text-sm" /> Chat on WhatsApp
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}