import React from 'react';

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
    <section className="py-20 section-dark relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-accent rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
            Our Numbers Say it All
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful students who have achieved their goals with Academywale
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {numbers.map((num, index) => (
            <div 
              key={num.label} 
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card p-4 sm:p-8 hover-lift">
                <div className="text-2xl sm:text-4xl mb-2 sm:mb-4">
                  {num.icon}
                </div>
                <div className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-primary mb-1 sm:mb-2">
                  {num.value}
                </div>
                <h3 className="font-heading font-semibold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">
                  {num.label}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {num.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-primary">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-primary">100%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-heading font-bold text-primary">50+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 