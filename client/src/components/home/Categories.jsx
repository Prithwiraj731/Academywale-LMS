import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import banner4 from "../../assets/banner4.png";
import "./categories.css";

const steps = [
  { title: "Choose Course", icon: "📚", desc: "Find the perfect course for your goals." },
  { title: "Learn from Experts", icon: "🎓", desc: "Get guidance from top faculty." },
  { title: "Practice & Review", icon: "📝", desc: "Test yourself and master concepts." },
  { title: "Get Support", icon: "🤝", desc: "Doubt-solving and mentorship." },
  { title: "Achieve Success", icon: "🏆", desc: "Crack your exams and celebrate!" },
];

const Categories = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth <= 768,
    isExtraSmall: window.innerWidth <= 480,
    isVerySmall: window.innerWidth <= 360
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth <= 768,
        isExtraSmall: window.innerWidth <= 480,
        isVerySmall: window.innerWidth <= 360
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Add touch detection for mobile devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    const isTouchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouchEnabled);
  }, []);

  return (
    <section className="timeline-section-premium py-10 xs:py-12 sm:py-16">
      <div className="timeline-heading-container px-4" style={{ overflow: 'visible' }}>
        <img
          src={banner4}
          alt="Learning Journey Banner"
          className="w-full h-auto object-contain rounded-lg shadow-lg transition-transform duration-500 ease-in-out hover:scale-105 cursor-pointer"
          style={{ maxHeight: '400px' }}
        />
      </div>
      <div className="timeline-scroll-wrapper">
        <div className="timeline-scroll-fade left" />
        <motion.div
          className="timeline-container-premium"
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { 
              transition: { 
                staggerChildren: screenSize.isVerySmall ? 0.1 : (screenSize.isExtraSmall ? 0.12 : (screenSize.isMobile ? 0.15 : 0.18)) 
              } 
            },
          }}
        >
          {/* Animated line */}
          <motion.div
            className="timeline-line-premium"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ 
              duration: screenSize.isVerySmall ? 0.6 : (screenSize.isExtraSmall ? 0.7 : (screenSize.isMobile ? 0.85 : 1)), 
              ease: "easeOut" 
            }}
          />
          {steps.map((step, idx) => (
            <motion.div
              className="timeline-step-premium"
              key={step.title}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: screenSize.isVerySmall ? 25 : (screenSize.isExtraSmall ? 30 : (screenSize.isMobile ? 40 : 60)), 
                  scale: screenSize.isVerySmall ? 0.98 : (screenSize.isExtraSmall ? 0.97 : (screenSize.isMobile ? 0.95 : 0.92))
                },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ 
                type: "spring", 
                stiffness: screenSize.isVerySmall ? 80 : (screenSize.isExtraSmall ? 90 : (screenSize.isMobile ? 100 : 120)), 
                damping: screenSize.isVerySmall ? 10 : (screenSize.isExtraSmall ? 12 : (screenSize.isMobile ? 14 : 16))
              }}
              whileHover={{ 
                scale: isTouchDevice ? 1 : (screenSize.isVerySmall ? 1.01 : (screenSize.isExtraSmall ? 1.02 : (screenSize.isMobile ? 1.03 : 1.06))), 
                boxShadow: isTouchDevice ? "none" : "0 8px 32px 0 rgba(96, 165, 250, 0.4)" 
              }}
              whileTap={{
                scale: isTouchDevice ? 1.02 : 1,
                boxShadow: isTouchDevice ? "0 8px 32px 0 rgba(96, 165, 250, 0.4)" : "none"
              }}
            >
              <div className="timeline-step-icon-premium">{step.icon}</div>
              <div className="timeline-step-title-premium">{step.title}</div>
              <div className="timeline-step-desc-premium">{step.desc}</div>
            </motion.div>
          ))}
        </motion.div>
        <div className="timeline-scroll-fade right" />
      </div>
      {(screenSize.isMobile || isTouchDevice) && (
        <div className="text-center text-gray-500 text-sm mt-2 px-4">
          <span className="inline-flex items-center animate-swipe">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Swipe to see more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        </div>
      )}
    </section>
  );
};

export default Categories;
