import React from 'react';

const categories = [
  { 
    name: 'CA INTER', 
    img: 'https://placehold.co/120x120?text=CA+I',
    color: 'from-blue-600 to-blue-700',
    description: 'Intermediate level preparation'
  },
  { 
    name: 'CA FINAL', 
    img: 'https://placehold.co/120x120?text=CA+Final',
    color: 'from-blue-700 to-blue-800',
    description: 'Final level expertise'
  },
  { 
    name: 'CMA INTER', 
    img: 'https://placehold.co/120x120?text=CMA+I',
    color: 'from-purple-600 to-purple-700',
    description: 'CMA intermediate level'
  },
  { 
    name: 'CMA FINAL', 
    img: 'https://placehold.co/120x120?text=CMA+Final',
    color: 'from-purple-700 to-purple-800',
    description: 'CMA final preparation'
  },
];

export default function Categories() {
  return (
    <section className="py-20 section-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6">
            Explore our Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of professional courses designed to help you excel in your career
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((cat, index) => (
            <div 
              key={cat.name} 
              className="group cursor-pointer animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card p-3 sm:p-6 text-center hover-lift h-full">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${cat.color} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-lg" 
                  />
                </div>
                <h3 className="font-heading font-semibold text-gray-800 mb-1 sm:mb-2 text-base sm:text-lg">
                  {cat.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {cat.description}
                </p>
                <div className="mt-2 sm:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-primary font-semibold text-xs sm:text-sm hover:underline">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-primary text-lg px-8 py-4">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
} 