import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldAlert, 
  BookOpen, 
  Tv, 
  CreditCard, 
  Truck, 
  RefreshCw, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Globe, 
  Clock,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    document.title = 'Terms & Conditions | AcademyWale';
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
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'services', title: '2. Educational Services & Offerings' },
    { id: 'accounts', title: '3. Student Accounts & Eligibility' },
    { id: 'course-access', title: '4. Views, Validity & Device Policy' },
    { id: 'intellectual-property', title: '5. Intellectual Property & Anti-Piracy' },
    { id: 'pricing-payments', title: '6. Pricing, Taxes & Billing' },
    { id: 'shipping-delivery', title: '7. Shipping & Dispatch of Books' },
    { id: 'cancellation-refund', title: '8. Refund & Replacement Policy' },
    { id: 'user-conduct', title: '9. Prohibited User Conduct' },
    { id: 'liability', title: '10. Limitation of Liability' },
    { id: 'governing-law', title: '11. Governing Law & Jurisdiction' },
    { id: 'contact-info', title: '12. Contact & Grievance Redressal' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-5 w-96 h-96 bg-[#20b2aa]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 right-5 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#20b2aa]/10 border border-[#20b2aa]/30 text-[#20b2aa] text-xs font-extrabold uppercase tracking-widest">
            <Scale className="w-3.5 h-3.5" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20b2aa] to-teal-300">Conditions</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Please read these Terms and Conditions carefully before using the <strong className="text-white">AcademyWale</strong> platform, enrolling in CA/CMA courses, or purchasing study kits.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2">
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-[#20b2aa]" /> Last Updated: August 2026
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
              <Globe className="w-3.5 h-3.5 text-[#20b2aa]" /> Domain: academywale.com
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
            
            {/* Section 1: Acceptance */}
            <div id="acceptance" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Acceptance of Terms</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("Student", "User", "You") and <strong>AcademyWale</strong> ("AcademyWale", "We", "Us", "Our"), governing your access to and use of <a href="https://academywale.com" className="text-[#20b2aa] underline">academywale.com</a>, including all related subdomains, mobile views, digital content, test series, and physical goods.
                </p>
                <p>
                  By creating an account, browsing course materials, placing an order, or making a payment, you acknowledge that you have read, understood, and agreed to be bound by these Terms, as well as our <Link to="/privacy-policy" className="text-[#20b2aa] underline">Privacy Policy</Link> and <Link to="/disclaimer" className="text-[#20b2aa] underline">Disclaimer</Link>.
                </p>
              </div>
            </div>

            {/* Section 2: Services Overview */}
            <div id="services" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Educational Services & Offerings</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  AcademyWale is an educational platform providing resources for professional accounting aspirants in India, specializing in:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
                  <li><strong>CA Exam Preparation:</strong> Video lectures, test series, and study materials for CA Foundation, CA Intermediate, and CA Final.</li>
                  <li><strong>CMA Exam Preparation:</strong> Structured courses, paper-wise bundles, and test packages for CMA Foundation, CMA Intermediate, and CMA Final.</li>
                  <li><strong>Delivery Modes:</strong> Google Drive lecture access, encrypted Pen Drive video classes, Mobile App access, and physical printed study kits dispatched across India.</li>
                </ul>
                <p className="text-xs text-slate-400">
                  We collaborate with premier independent faculties and authorized partner institutes (such as SJC Institute, Bishnu Kedia Classes, and renowned educators) to provide official course licenses to enrolled students.
                </p>
              </div>
            </div>

            {/* Section 3: Accounts & Eligibility */}
            <div id="accounts" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Student Accounts & Eligibility</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  To purchase courses and track order status, you must provide accurate, complete, and current registration details (including your full legal name, active email, valid mobile number, and complete delivery address).
                </p>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs sm:text-sm">
                  <strong className="text-white block font-bold">Account Security & Responsibility:</strong>
                  <span>You are solely responsible for maintaining the confidentiality of your login credentials. Any activity initiated through your authenticated account shall be deemed authorized by you. You must notify AcademyWale immediately upon becoming aware of any unauthorized access.</span>
                </div>
              </div>
            </div>

            {/* Section 4: Course Access, Views & Device Policy */}
            <div id="course-access" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Views, Validity & Hardware Restrictions</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  All digital video lectures and software players provided through AcademyWale operate under specific technical licensing parameters established by the respective faculty:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Tv className="w-4 h-4 text-[#20b2aa]" /> View Limit Policy
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Lectures are provided with specified view limits (e.g. 1.5x views or 2x views). For example, a 2-hour lecture with a 1.5x view limit allows up to 3 hours of total playback time. Pausing or rewinding consumes time according to the video player system.
                    </p>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#20b2aa]" /> License Validity Period
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Access is valid for the duration selected at checkout (e.g., 6 months, 9 months, 12 months, or specific exam attempt). Once the validity expires, the software player key ceases functioning automatically.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-1">
                  <strong className="text-white flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Single Device Activation Policy
                  </strong>
                  <span>Software player serial activation keys are bound to a single laptop/desktop (Windows 10/11) or Android mobile device as specified on the course page. Device switching or formatting after key activation is strictly subject to the technical approval of the respective faculty/institute.</span>
                </div>
              </div>
            </div>

            {/* Section 5: Intellectual Property */}
            <div id="intellectual-property" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Intellectual Property & Anti-Piracy Policy</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  All educational content, video lectures, test papers, solution keys, lecture summaries, printed books, logos, software players, and UI elements accessible through AcademyWale are the exclusive intellectual property of AcademyWale and its authorized faculty partners, protected under Indian Copyright and Trademark laws.
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-200 text-xs sm:text-sm space-y-2">
                  <strong className="text-white flex items-center gap-2 font-bold">
                    <ShieldAlert className="w-4 h-4 text-red-400" /> Strict Anti-Piracy Notice:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-xs text-red-300">
                    <li>Screen recording, capturing, or streaming lecture content is strictly illegal.</li>
                    <li>Reselling, sharing, renting, or group-buying of single-user licenses is prohibited.</li>
                    <li>Uploading copyrighted videos to Telegram, YouTube, Drive, or torrent channels will result in immediate permanent key revocation and legal prosecution under the Indian Copyright Act, 1957.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 6: Pricing & Payments */}
            <div id="pricing-payments" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  6
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Pricing, Taxes & Payment Terms</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  All prices listed on AcademyWale are quoted in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise.
                </p>
                <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm text-slate-300">
                  <li>We accept payments via major credit/debit cards, UPI, Net Banking, and authorized digital wallets through secure PCI-DSS compliant payment gateways.</li>
                  <li>AcademyWale reserves the right to modify course fees, launch promotional discounts, or discontinue bundles at any time without prior notice. Price revisions do not affect orders already completed.</li>
                  <li>In the event of an erroneous pricing glitch on the website, AcademyWale reserves the right to cancel the transaction and issue a full refund to the original payment source.</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Shipping & Delivery */}
            <div id="shipping-delivery" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  7
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Shipping & Dispatch of Physical Materials</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  For orders that include physical study books, hard-copy kits, or Pen Drive storage devices:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-white block">Dispatch Timeline</strong>
                    <span className="text-slate-400">Orders are typically processed and dispatched within 24 to 48 business hours following successful payment verification.</span>
                  </div>
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-white block">Delivery Window</strong>
                    <span className="text-slate-400">Estimated delivery across major Indian cities is 4 to 7 business days via reliable national courier partners (DTDC, Delhivery, Speed Post).</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Please ensure that your shipping address and pin code are completely accurate. AcademyWale is not liable for delivery delays caused by incorrect student addresses or regional logistics disruptions.
                </p>
              </div>
            </div>

            {/* Section 8: Refunds & Replacement */}
            <div id="cancellation-refund" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  8
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Cancellation, Refund & Replacement Policy</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  Due to the digital and proprietary nature of exam preparation video licenses:
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold">•</span>
                    <span><strong>Digital Courses Non-Refundable:</strong> Once digital Google Drive links or software serial keys have been issued and transmitted to the student, no cancellations or refunds can be processed under any circumstances.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold">•</span>
                    <span><strong>Defective Hardware / Transit Damage:</strong> In the rare event that a physical Pen Drive or printed study book is received in a damaged or defective condition, you must report it to <a href="mailto:support@academywale.com" className="text-[#20b2aa] underline">support@academywale.com</a> within <strong>48 hours</strong> of delivery with unboxing photos/video. A free replacement will be dispatched upon verification.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#20b2aa] font-bold">•</span>
                    <span><strong>Course Switching:</strong> Switching to a different faculty or subject is not permitted once the activation key has been assigned.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 9: User Conduct */}
            <div id="user-conduct" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  9
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Prohibited User Conduct</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-2">
                <p>While using AcademyWale, users agree NOT to:</p>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-300">
                  <li>Attempt to decompile, reverse-engineer, crack, or bypass the digital rights management (DRM) of video lecture players.</li>
                  <li>Use automated scrapers, data miners, or bots to harvest course prices or faculty data.</li>
                  <li>Impersonate any person or provide false contact details during registration.</li>
                  <li>Post abusive, harassing, or defamatory statements in student discussion forums or support channels.</li>
                </ul>
              </div>
            </div>

            {/* Section 10: Limitation of Liability */}
            <div id="liability" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  10
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Limitation of Liability</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  AcademyWale operates as an educational aggregator and authorized course distributor. While we strive to partner with top-tier faculties, we make no representations regarding exam results, marks, or rankings.
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  In no event shall AcademyWale, its directors, or its educational partners be liable for any indirect, incidental, special, or consequential damages arising from the use of or inability to access our courses. Our total aggregate liability shall not exceed the amount paid by the student for the specific course in dispute.
                </p>
              </div>
            </div>

            {/* Section 11: Governing Law */}
            <div id="governing-law" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  11
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Governing Law & Legal Jurisdiction</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  These Terms and Conditions and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of <strong>India</strong>.
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  The courts situated in <strong>Dhanbad, Jharkhand, India</strong> shall have exclusive jurisdiction over any legal proceedings arising under these terms.
                </p>
              </div>
            </div>

            {/* Section 12: Contact & Grievances */}
            <div id="contact-info" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  12
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Contact & Grievance Redressal</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  For any questions concerning these Terms, license troubleshooting, or order fulfillment:
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
                      <strong className="text-white">WhatsApp Support:</strong>{' '}
                      <a href="https://wa.me/919693320108" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">+91 9693320108</a>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-purple-400 shrink-0 mt-1" />
                    <span className="text-xs sm:text-sm">
                      <strong className="text-white">Postal Address:</strong>{' '}
                      AcademyWale Education Center, Hotel Grand, Purana Bazar, Bank More, Dhanbad - 826001, Jharkhand, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            
            {/* Quick Terms Summary */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Scale className="w-5 h-5 text-[#20b2aa]" /> Key Student Policies
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Single-device activation for software player video lectures.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Digital courses are non-refundable once activation keys are generated.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Physical book deliveries dispatched within 24–48 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Strict anti-piracy enforcement protects faculty copyright.</span>
                </li>
              </ul>
            </div>

            {/* Other Legal Pages Links */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Related Legal Documents
              </h3>
              <Link 
                to="/privacy-policy"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-[#20b2aa]/50 text-sm font-semibold text-slate-200 hover:text-white transition group"
              >
                <span>Privacy Policy</span>
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

            {/* Helpline Card */}
            <div className="bg-gradient-to-br from-[#20b2aa]/20 to-teal-900/40 rounded-[28px] p-6 border border-[#20b2aa]/30 space-y-3 text-center">
              <h4 className="text-white font-bold text-sm">Have Questions on Terms?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with our team directly for clear guidance on device compatibility and delivery schedules.
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
