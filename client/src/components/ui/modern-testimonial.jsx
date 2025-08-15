import React from "react";

// Custom animation styles
const styles = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Import testimonial images
import testimonial1 from "../../assets/testimonial/1.jpg";
import testimonial2 from "../../assets/testimonial/2.jpg";
import testimonial3 from "../../assets/testimonial/3.jpg";
import testimonial4 from "../../assets/testimonial/4.jpg";
import testimonial5 from "../../assets/testimonial/5.jpg";
import testimonial6 from "../../assets/testimonial/6.jpg";

const testimonials = [
  {
    id: 1,
    name: "Sourav Pathak",
    role: "CMA Final Student",
    review: "AcademyWale made my CA/CMA journey so much smoother! I was able to purchase top faculty courses at discounted prices, with flexible validity and instant access. The support team is very responsive, and the whole process is super easy. Highly recommended for every CA/CMA aspirant looking for quality classes at affordable rates!",
    avatar: testimonial1,
    handle: "@sourav_pathak",
  },
  {
    id: 2,
    name: "Muskan",
    role: "CMA Inter Aspirant",
    review: "AcademyWale really understands student needs. I was able to choose the best faculty for my CMA Inter subjects with proper guidance. The purchase process was simple, and the team was always ready to help. Highly recommended!",
    avatar: testimonial2,
    handle: "@muskan",
  },
  {
    id: 3,
    name: "Sankalp Gupta",
    role: "CMA Final Student",
    review: "AcademyWale is a game-changer for CA & CMA students! I got my favourite faculty's classes at unbeatable prices. The buying process was seamless, and the delivery was instant. No more browsing multiple sites—AcademyWale has it all in one place!",
    avatar: testimonial3,
    handle: "@sankalp_gupta",
  },
  {
    id: 4,
    name: "Afreen Malika",
    role: "CMA Final Student",
    review: "If you're preparing for CA or CMA, AcademyWale is the best place to buy your classes. Affordable prices, multiple options, and quick support—everything a student needs. I highly recommend it to all aspirants.",
    avatar: testimonial4,
    handle: "@afreen_malika",
  },
  {
    id: 5,
    name: "Kirti Somani",
    role: "CA Student",
    review: "I was a bit unsure at first, but AcademyWale turned out to be the best decision. The support team is responsive, and the quality of study material is excellent. I cracked my exams with their help!",
    avatar: testimonial5,
    handle: "@kirti_somani",
  },
  {
    id: 6,
    name: "Yash Agarwal",
    role: "CA Aspirant",
    review: "AcademyWale has truly transformed my preparation journey. The quality of lectures and timely support helped me stay consistent and focused. Highly recommended for all CA/CMA/CS aspirants looking for genuine and affordable resources!",
    avatar: testimonial6,
    handle: "@yash_agarwal",
  },
];

export default function ModernTestimonial({ 
  title = "Customer Reviews",
  subtitle = "What our users think about our product"
}) {
  return (
    <section className="py-12 bg-black text-white overflow-hidden">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block relative">
            <h2 className="text-4xl sm:text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              {title}
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-600 rounded-lg blur opacity-20 -z-10"></div>
          </div>
          <p className="text-lg text-gray-400 mt-3">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={testimonial.id} 
              testimonial={testimonial} 
              delay={index * 0.05} // Reduced delay for faster animation
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, delay = 0 }) {
  return (
    <div 
      className="bg-gray-900/70 rounded-2xl p-6 backdrop-blur-sm border border-purple-900/30 flex flex-col h-full hover:scale-[1.05] transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 transform"
      style={{
        animation: `fadeIn 0.6s ease-out forwards`,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    >
      <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 blur-xl"></div>
      <p className="text-gray-300 mb-6 flex-grow relative z-10">"{testimonial.review}"</p>
      
      <div className="flex items-center mt-auto relative z-10">
        <div className="h-12 w-12 rounded-full overflow-hidden ring-2 ring-purple-500 hover:ring-4 hover:ring-purple-400 transition-all duration-200">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name} 
            className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div 
            className="h-full w-full bg-purple-800 flex items-center justify-center text-white"
            style={{ display: 'none' }}
          >
            {testimonial.name.charAt(0)}
          </div>
        </div>
        
        <div className="ml-3">
          <div className="font-semibold text-white">{testimonial.name}</div>
          <div className="text-sm text-purple-300">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}
