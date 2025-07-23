import React from 'react';
import { FaHeadset, FaSmile, FaMapMarkerAlt } from 'react-icons/fa';

const numbers = [
  { 
    label: 'Students Network', 
    value: '50+',
    icon: '👥',
    description: 'Active learners'
  },
  { 
    label: 'Successful Orders', 
    value: '100+',
    icon: '📦',
    description: 'Completed orders'
  },
  { 
    label: 'Authorised Faculties', 
    value: '10+',
    icon: '👨‍🏫',
    description: 'Expert teachers'
  },
  { 
    label: 'Test Series', 
    value: '100+',
    icon: '📝',
    description: 'Practice tests'
  },
];

export default function Numbers() {
  return (
    <section className="py-10 xs:py-16 sm:py-20 section-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-accent rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8 xs:mb-12 sm:mb-16">
          <h2 className="text-3xl xs:text-4xl md:text-5xl font-heading font-bold text-primary mb-4 xs:mb-6">
            Our Numbers Say it All
          </h2>
          <p className="text-lg xs:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful students who have achieved their goals with Academywale
          </p>
        </div>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 xs:gap-6 md:gap-8">
          {numbers.map((num, index) => (
            <div 
              key={num.label} 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 xs:p-5 sm:p-6 text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <div className="flex justify-center mb-3 xs:mb-4">
                <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {num.icon}
                </div>
              </div>
              <h3 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-black mb-1 xs:mb-2">{num.value}</h3>
              <p className="text-base xs:text-lg text-gray-300">{num.label}</p>
              <p className="text-xs xs:text-sm text-gray-400 mt-1 xs:mt-2">{num.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 xs:mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
          <div className="bg-white rounded-xl shadow-lg p-4 xs:p-5 sm:p-6 flex items-center">
            <div className="bg-blue-100 p-3 xs:p-4 rounded-full mr-3 xs:mr-4">
              <FaHeadset className="text-blue-600 text-xl xs:text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base xs:text-lg">24/7 Support</h3>
              <p className="text-gray-600 text-sm xs:text-base">Always here to help you</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 xs:p-5 sm:p-6 flex items-center">
            <div className="bg-green-100 p-3 xs:p-4 rounded-full mr-3 xs:mr-4">
              <FaSmile className="text-green-600 text-xl xs:text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base xs:text-lg">98% Satisfaction</h3>
              <p className="text-gray-600 text-sm xs:text-base">From our students</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 xs:p-5 sm:p-6 flex items-center sm:col-span-2 md:col-span-1">
            <div className="bg-purple-100 p-3 xs:p-4 rounded-full mr-3 xs:mr-4">
              <FaMapMarkerAlt className="text-purple-600 text-xl xs:text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base xs:text-lg">50+ Cities</h3>
              <p className="text-gray-600 text-sm xs:text-base">Across India</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}