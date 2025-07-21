import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./categories.css";

const steps = [
  { title: "Choose Course", icon: "📚", desc: "Find the perfect course for your goals." },
  { title: "Learn from Experts", icon: "🎓", desc: "Get guidance from top faculty." },
  { title: "Practice & Revise", icon: "📝", desc: "Test yourself and master concepts." },
  { title: "Get Support", icon: "🤝", desc: "Doubt-solving and mentorship." },
  { title: "Achieve Success", icon: "🏆", desc: "Crack your exams and celebrate!" },
];

const Categories = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="timeline-section-premium">
      <div className="timeline-heading-container">
        <h2 className="timeline-heading">Your Learning Journey</h2>
        <div className="timeline-subtitle">How Academywale helps you succeed, step by step</div>
      </div>
      <div className="timeline-scroll-wrapper">
        <div className="timeline-scroll-fade left" />
        <motion.div
          className="timeline-container-premium"
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: { transition: { staggerChildren: 0.18 } },
          }}
        >
          {/* Animated line */}
          <motion.div
            className="timeline-line-premium"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          {steps.map((step, idx) => (
            <motion.div
              className="timeline-step-premium"
              key={step.title}
              variants={{
                hidden: { opacity: 0, y: 60, scale: 0.92 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              whileHover={{ scale: 1.06, boxShadow: "0 8px 32px 0 #60a5fa33" }}
            >
              <div className="timeline-step-icon-premium">{step.icon}</div>
              <div className="timeline-step-title-premium">{step.title}</div>
              <div className="timeline-step-desc-premium">{step.desc}</div>
            </motion.div>
          ))}
        </motion.div>
        <div className="timeline-scroll-fade right" />
      </div>
    </section>
  );
};

export default Categories;
