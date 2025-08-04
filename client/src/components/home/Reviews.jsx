
import React, { useEffect, useState } from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { getTestimonialImageUrl, getTestimonialCloudinaryId } from '../../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Reviews() {
  const [testimonials, setTestimonials] = useState([]);
  const cld = new Cloudinary({ cloud: { cloudName: 'drlqhsjgm' } });

  useEffect(() => {
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data.testimonials || []));
  }, []);

  return (
    <section className="py-8 xs:py-10 sm:py-12 bg-gradient-to-r from-[#e0f7f4] via-white to-[#e0f7f4]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4 xs:mb-6">
          <h2 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl font-bold text-[#17817a] font-pacifico">See What Teachers & Students Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-8">
          {testimonials.length === 0 ? (
            <div className="text-gray-400 text-center col-span-2">No testimonials yet.</div>
          ) : testimonials.map((rev) => {
            const cloudinaryId = getTestimonialCloudinaryId(rev);
            const fallbackImageUrl = getTestimonialImageUrl(rev);

            return (
              <div key={rev._id} className="flex items-start bg-[#fef9f4] rounded-xl shadow-lg p-4 xs:p-5 gap-3 xs:gap-4 sm:gap-8 border border-yellow-200">
                <div className="w-12 h-12 xs:w-14 xs:h-14 rounded-full overflow-hidden border-2 border-[#d4af37] flex-shrink-0">
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
                  <div className="font-semibold text-gray-800 text-sm xs:text-base">
                    {rev.name} 
                    {rev.course && <span className="text-xs text-gray-500"> ({rev.course})</span>}
                  </div>
                  <div className="text-gray-700 text-sm xs:text-base mt-1 font-comic-neue">
                    {rev.message || rev.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
