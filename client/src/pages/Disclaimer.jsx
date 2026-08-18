import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Info, 
  BookOpen, 
  Award, 
  Globe, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText,
  HelpCircle
} from 'lucide-react';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Disclaimer() {
  const [activeSection, setActiveSection] = useState('educational');

  useEffect(() => {
    document.title = 'Disclaimer | AcademyWale';
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
    { id: 'educational', title: '1. General Educational Purpose' },
    { id: 'statutory-non-affiliation', title: '2. Non-Affiliation with ICAI / ICMAI' },
    { id: 'faculty-content', title: '3. Faculty & Institute Content' },
    { id: 'exam-results', title: '4. Exam Results & Performance' },
    { id: 'adsense-external', title: '5. Third-Party Ads & External Links' },
    { id: 'technical-specs', title: '6. Technical & Device Compatibility' },
    { id: 'accuracy-updates', title: '7. Syllabus Updates & Accuracy' },
    { id: 'contact-queries', title: '8. Contact for Disclaimers' },
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
            <Info className="w-3.5 h-3.5" />
            Legal Notices & Disclosures
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#20b2aa] to-teal-300">Disclaimer</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Please review the essential disclosures regarding course representations, non-affiliation with statutory bodies, and third-party advertising on <strong className="text-white">AcademyWale</strong>.
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
            
            {/* Section 1: General Educational Purpose */}
            <div id="educational" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">General Educational Purpose</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  All content, video lectures, test papers, study notes, mock tests, and supplementary preparatory materials available on <strong>AcademyWale</strong> (<a href="https://academywale.com" className="text-[#20b2aa] underline">academywale.com</a>) are provided strictly for educational and exam preparation guidance.
                </p>
                <p>
                  The information provided across our website does not constitute official statutory legal, financial, accounting, auditing, or tax advice. Users are encouraged to refer to official pronouncements, bare acts, and institute guidelines for formal legal interpretation.
                </p>
              </div>
            </div>

            {/* Section 2: Non-Affiliation with ICAI / ICMAI */}
            <div id="statutory-non-affiliation" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Non-Affiliation with ICAI & ICMAI</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-2">
                  <strong className="text-white flex items-center gap-2 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Independent Educational Platform Notice:
                  </strong>
                  <p>
                    <strong>AcademyWale is an independent private educational aggregator and authorized course distributor.</strong> We are NOT affiliated with, associated with, authorized by, endorsed by, or in any way officially connected with:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-amber-300">
                    <li>The Institute of Chartered Accountants of India (ICAI) (<a href="https://www.icai.org" target="_blank" rel="noopener noreferrer" className="underline">icai.org</a>)</li>
                    <li>The Institute of Cost Accountants of India (ICMAI) (<a href="https://icmai.in" target="_blank" rel="noopener noreferrer" className="underline">icmai.in</a>)</li>
                  </ul>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  The terms "CA", "Chartered Accountant", "CMA", "Cost and Management Accountant", "ICAI", "ICMAI", and related syllabus designations are registered trademarks of their respective statutory bodies in India. Their mention on AcademyWale is solely for nominative identification and descriptive reference to the corresponding professional examination levels.
                </p>
              </div>
            </div>

            {/* Section 3: Faculty & Institute Independence */}
            <div id="faculty-content" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Faculty & Partner Institute Content</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  AcademyWale collaborates with certified individual educators and authorized institutes (such as SJC Institute, Bishnu Kedia Classes, and renowned faculties).
                </p>
                <p>
                  The opinions, teaching methodologies, lecture interpretations, case study illustrations, and problem-solving shortcuts presented in video courses are solely those of the respective faculty members. AcademyWale does not control or dictate the individual teaching style or pedagogical methodology of independent educators.
                </p>
              </div>
            </div>

            {/* Section 4: Exam Results & Performance */}
            <div id="exam-results" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Exam Results & Academic Performance</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  While AcademyWale curates high-caliber video classes, comprehensive books, and structured test series designed to assist students in their exam preparation:
                </p>
                <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs sm:text-sm">
                  <strong className="text-white block font-bold">No Guarantee of Marks or Ranks:</strong>
                  <span>We do NOT guarantee, warrant, or promise that enrolling in any course, viewing lectures, or purchasing study kits will result in passing marks, specific rank attainment, or employment placement. Professional examination outcomes depend entirely on individual student dedication, revision rigor, exam-day performance, and statutory evaluation standards.</span>
                </div>
              </div>
            </div>

            {/* Section 5: Third-Party Ads & External Links */}
            <div id="adsense-external" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Third-Party Advertising & External Links</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  AcademyWale may display advertisements served by third-party advertising networks, such as <strong>Google AdSense</strong>, or link to external third-party websites (such as courier tracking portals, video player download utilities, and academic blogs).
                </p>
                
                <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#20b2aa]" /> Third-Party Content & Ad Responsibility
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    The presence of third-party advertisements or outbound hyperlinks on AcademyWale does not constitute an endorsement, recommendation, or warranty of the third-party products, services, or claims advertised. We have no control over the content, privacy practices, or reliability of external third-party websites.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Users interact with third-party advertisers and external links entirely at their own discretion and risk.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6: Technical Compatibility */}
            <div id="technical-specs" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  6
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Technical Specifications & Device Compatibility</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  Video lectures and pen drive courses require specific hardware and software prerequisites (e.g. Windows 10/11 operating systems with minimum 4GB RAM or Android 9.0+ smartphones without root permissions).
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  It is the student's responsibility to verify hardware compatibility prior to purchasing a course. AcademyWale is not liable for playback issues resulting from unsupported operating systems (such as iOS/Mac when Windows-only is specified), rooted devices, virtual machines, or incompatible display drivers.
                </p>
              </div>
            </div>

            {/* Section 7: Syllabus Updates & Accuracy */}
            <div id="accuracy-updates" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  7
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Syllabus Updates & Content Accuracy</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-3">
                <p>
                  While we make continuous efforts to ensure that all course descriptions, paper titles, faculty information, and pricing details are accurate and updated for the latest exam attempts (e.g., ICAI / ICMAI new schemes), information is provided on an "as is" and "as available" basis without warranties of completeness.
                </p>
                <p className="text-xs sm:text-sm text-slate-400">
                  Statutory amendments and statutory notifications released by ICAI or ICMAI after course recording will be supplemented through faculty amendment lectures and PDF notes as made available by the respective educators.
                </p>
              </div>
            </div>

            {/* Section 8: Contact for Disclaimers */}
            <div id="contact-queries" className="bg-slate-900/80 backdrop-blur-xl rounded-[28px] p-6 sm:p-8 border border-slate-800 shadow-xl scroll-mt-24 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#20b2aa]/10 text-[#20b2aa] flex items-center justify-center font-bold">
                  8
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Contact & Clarifications</h2>
              </div>
              <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  If you require any further clarification regarding these disclaimers, course licensing, or faculty authorizations, please reach out to us:
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

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            
            {/* Disclaimer Key Highlights */}
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-[28px] p-6 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Info className="w-5 h-5 text-[#20b2aa]" /> Key Disclosures
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>AcademyWale is not officially affiliated with ICAI or ICMAI.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Course lectures represent independent opinions of faculties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>No guarantee of specific exam scores or passing percentages.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#20b2aa] shrink-0 mt-0.5" />
                  <span>Third-party advertisements are subject to independent policies.</span>
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
                to="/terms-and-conditions"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-[#20b2aa]/50 text-sm font-semibold text-slate-200 hover:text-white transition group"
              >
                <span>Terms & Conditions</span>
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
              <h4 className="text-white font-bold text-sm">Have Questions?</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reach out on WhatsApp or email for instant assistance with course inquiries.
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
