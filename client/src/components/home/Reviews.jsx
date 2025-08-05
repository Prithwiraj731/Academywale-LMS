
import React, { useEffect, useState, useRef } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { getTestimonialImageUrl, getTestimonialCloudinaryId } from '../../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Reviews() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const scrollRef = useRef(null);
  const cld = new Cloudinary({ cloud: { cloudName: 'drlqhsjgm' } });

  useEffect(() => {
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data.testimonials || []));
  }, []);

  // Auto-play functionality for mobile
  useEffect(() => {
    if (!isAutoPlay || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  // Handle manual slide change
  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % testimonials.length);
  };

  const prevSlide = () => {
    goToSlide(currentSlide === 0 ? testimonials.length - 1 : currentSlide - 1);
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e) => {
    setIsAutoPlay(false);
    const touch = e.touches[0];
    scrollRef.current.startX = touch.clientX;
  };

  const handleTouchEnd = (e) => {
    if (!scrollRef.current.startX) return;
    
    const touch = e.changedTouches[0];
    const diffX = scrollRef.current.startX - touch.clientX;
    
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <section className="py-8 xs:py-10 sm:py-12 bg-gradient-to-r from-[#e0f7f4] via-white to-[#e0f7f4]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4 xs:mb-6">
          <h2 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl font-bold text-[#17817a] font-pacifico">See What Teachers & Students Say</h2>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-gray-400 text-center">No testimonials yet.</div>
        ) : (
          <>
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <div 
                ref={scrollRef}
                className="relative overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {testimonials.map((rev) => {
                    const cloudinaryId = getTestimonialCloudinaryId(rev);
                    const fallbackImageUrl = getTestimonialImageUrl(rev);

                    return (
                      <div key={rev._id} className="w-full flex-shrink-0 px-2">
                        <div className="bg-[#fef9f4] rounded-lg shadow-md p-4 border border-yellow-200 mx-auto max-w-sm">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37] flex-shrink-0">
                              {cloudinaryId ? (
                                <AdvancedImage 
                                  cldImg={cld
                                    .image(cloudinaryId)
                                    .format('auto')
                                    .quality('auto')
                                    .resize(auto().gravity(autoGravity()).width(80).height(80))
                                  } 
                                  alt={rev.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'block';
                                  }}
                                />
                              ) : null}
                              <img 
                                src={fallbackImageUrl} 
                                alt={rev.name}
                                className="w-full h-full object-cover"
                                style={{ 
                                  display: cloudinaryId ? 'none' : 'block'
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-800 text-sm">
                                {rev.name}
                              </div>
                              {rev.course && (
                                <div className="text-xs text-gray-500 mb-1">{rev.course}</div>
                              )}
                            </div>
                          </div>
                          <div 
                            className="text-gray-700 text-sm leading-relaxed font-comic-neue"
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            "{rev.message || rev.text}"
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="flex items-center justify-center mt-4 gap-4">
                <button 
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-[#17817a] text-white hover:bg-[#146b65] transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-[#17817a]' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-[#17817a] text-white hover:bg-[#146b65] transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8">
              {testimonials.map((rev) => {
                const cloudinaryId = getTestimonialCloudinaryId(rev);
                const fallbackImageUrl = getTestimonialImageUrl(rev);

                return (
                  <div key={rev._id} className="flex items-start bg-[#fef9f4] rounded-xl shadow-lg p-5 gap-4 sm:gap-6 border border-yellow-200">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#d4af37] flex-shrink-0">
                      {cloudinaryId ? (
                        <AdvancedImage 
                          cldImg={cld
                            .image(cloudinaryId)
                            .format('auto')
                            .quality('auto')
                            .resize(auto().gravity(autoGravity()).width(100).height(100))
                          } 
                          alt={rev.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <img 
                        src={fallbackImageUrl} 
                        alt={rev.name}
                        className="w-full h-full object-cover"
                        style={{ 
                          display: cloudinaryId ? 'none' : 'block'
                        }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-base">
                        {rev.name} 
                        {rev.course && <span className="text-sm text-gray-500"> ({rev.course})</span>}
                      </div>
                      <div className="text-gray-700 text-base mt-2 font-comic-neue leading-relaxed">
                        "{rev.message || rev.text}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
