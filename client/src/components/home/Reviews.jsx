import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Reviews() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/testimonials`)
      .then(res => res.json())
      .then(data => setTestimonials(data.testimonials || []));
  }, []);
 const getImageUrl = (url) => {
    if (!url) return '';
    console.log('Original image URL:', url);
    // If url already contains /uploads/, avoid duplicating
    if (url.startsWith('/uploads/')) {
      const fullUrl = `${API_URL}${encodeURIComponent(url)}`;
      console.log('Constructed full image URL:', fullUrl);
      return fullUrl;
    }
    const fullUrl = `${API_URL}/uploads/${encodeURIComponent(url)}`;
    console.log('Constructed full image URL:', fullUrl);
    return fullUrl;
  };
  return (
    <section className="py-8 xs:py-10 sm:py-12 bg-gradient-to-r from-[#e0f7f4] via-white to-[#e0f7f4]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4 xs:mb-6">
          <h2 className="text-xl xs:text-2xl md:text-3xl lg:text-4xl font-bold text-[#17817a] font-pacifico">See What Teachers & Students Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4 sm:gap-8">
          {testimonials.length === 0 ? (
            <div className="text-gray-400 text-center col-span-2">No testimonials yet.</div>
          ) : testimonials.map((rev) => (
            <div key={rev._id} className="flex items-start bg-[#fef9f4] rounded-xl shadow-lg p-4 xs:p-5 gap-3 xs:gap-4 sm:gap-8 border border-yellow-200">
              {rev.imageUrl && <img src={getImageUrl(rev.imageUrl)} alt={rev.name} className="w-12 h-12 xs:w-14 xs:h-14 rounded-full object-cover border-2 border-[#d4af37]" />}
              <div>
                <div className="font-semibold text-gray-800 text-sm xs:text-base">{rev.name} <span className="text-xs text-gray-500">({rev.role})</span></div>
                <div className="text-gray-700 text-sm xs:text-base mt-1 font-comic-neue">{rev.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}