import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Particles from '../components/common/Particles';

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen flex flex-col bg-gray-900 overflow-x-hidden">
      <Particles
        particleColors={['#ffffff', '#00eaff', '#ffd600']}
        particleCount={120}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={80}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <section className="flex flex-col items-center justify-center py-16 px-4 bg-transparent">
          <div className="max-w-2xl w-full bg-white/90 rounded-2xl shadow-xl p-6 sm:p-10 border-t-4 border-[#ffd600]">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a6ebd] mb-6 text-center">Privacy Policy</h1>
            <p className="text-gray-700 text-base sm:text-lg mb-6 text-center">
              At <span className="font-bold text-[#0a6ebd]">AcademyWale</span>, we value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data when you use our platform.
            </p>
            <ol className="list-decimal list-inside space-y-6 text-gray-800">
              <li>
                <span className="font-bold text-[#0a6ebd]">Information We Collect</span>
                <ul className="list-disc list-inside ml-5 mt-2 text-gray-700 text-sm sm:text-base">
                  <li>Name, email address, phone number</li>
                  <li>Billing and payment information</li>
                  <li>Courses viewed, purchased, or accessed</li>
                  <li>Feedback or inquiries submitted</li>
                </ul>
              </li>
              <li>
                <span className="font-bold text-[#0a6ebd]">How We Use Your Information</span>
                <ul className="list-disc list-inside ml-5 mt-2 text-gray-700 text-sm sm:text-base">
                  <li>Processing orders and delivering course access</li>
                  <li>Sending important updates and offers</li>
                  <li>Improving our website and services</li>
                  <li>Preventing fraud and ensuring account security</li>
                </ul>
              </li>
              <li>
                <span className="font-bold text-[#0a6ebd]">Data Security</span>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">We use secure servers and encryption to protect your data. We do not sell or share your information with third parties, except as needed to process payments or as required by law.</p>
              </li>
              <li>
                <span className="font-bold text-[#0a6ebd]">Payment Information</span>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">All payments are processed through trusted payment gateways. We do not store your complete card or UPI details on our servers.</p>
              </li>
              <li>
                <span className="font-bold text-[#0a6ebd]">Cookies</span>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">We use cookies to enhance your browsing experience. You can control or disable cookies through your browser settings.</p>
              </li>
              <li>
                <span className="font-bold text-[#0a6ebd]">Your Consent</span>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">By using our website, you agree to our Privacy Policy.</p>
              </li>
              <li>
                <span className="font-bold text-[#0a6ebd]">Contact Us</span>
                <p className="mt-2 text-gray-700 text-sm sm:text-base">For any questions or concerns, please drop a message on Whatsapp <a href="https://wa.me/919693320108" className="text-[#0a6ebd] underline">+91 9693320108</a> or email us at <a href="mailto:support@academywale.com" className="text-[#0a6ebd] underline">support@academywale.com</a>.</p>
              </li>
            </ol>
          </div>
        </section>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </div>
  );
} 