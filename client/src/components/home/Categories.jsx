import React from "react";
import { motion } from "framer-motion";
import banner4 from "../../assets/banner4.png";

const steps = [
  { title: "Choose Course", icon: "📚", desc: "Find the perfect course for your goals.", step: "01" },
  { title: "Learn from Experts", icon: "🎓", desc: "Get guidance from top faculty.", step: "02" },
  { title: "Practice & Review", icon: "📝", desc: "Test yourself and master concepts.", step: "03" },
  { title: "Get Support", icon: "🤝", desc: "Doubt-solving and mentorship.", step: "04" },
  { title: "Achieve Success", icon: "🏆", desc: "Crack your exams and celebrate!", step: "05" },
];

const Categories = () => {
  return (
    <section className="w-full py-12 bg-slate-50/50 border-y border-slate-200/40 animate-fadeIn">
      {/* Banner */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-10">
        <div className="overflow-hidden rounded-2xl shadow-md border border-slate-200/50">
          <img
            src={banner4}
            alt="Learning Journey Banner"
            className="w-full h-auto object-cover hover:scale-[1.005] transition-transform duration-300"
          />
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-[#20b2aa]/40 transition-all duration-200 flex flex-col items-center text-center relative group"
            >
              {/* Step indicator */}
              <span className="absolute top-4 right-4 text-xs font-semibold text-slate-300 select-none group-hover:text-[#20b2aa]/40 transition-colors">
                {step.step}
              </span>

              {/* Icon Container */}
              <div className="w-12 h-12 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center text-xl mb-5 border border-slate-100 group-hover:bg-[#20b2aa]/10 group-hover:text-[#20b2aa] group-hover:border-[#20b2aa]/20 transition-all duration-200">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-slate-800 tracking-tight mb-2 group-hover:text-[#20b2aa] transition-colors">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[180px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
