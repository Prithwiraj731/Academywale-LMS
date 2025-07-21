import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Reviews() {
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data.testimonials || []));
  }, []);
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) return `${API_URL}${url}`;
    return url;
  };
  return (
    <section className="py-12 bg-gradient-to-r from-[#e0f7f4] via-white to-[#e0f7f4]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#17817a] font-pacifico">See What Teachers & Students Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {testimonials.length === 0 ? (
            <div className="text-gray-400 text-center col-span-2">No testimonials yet.</div>
          ) : testimonials.map((rev) => (
            <div key={rev._id} className="flex items-center bg-white rounded-xl shadow p-4 sm:p-6 gap-3 sm:gap-4">
              {rev.imageUrl && <img src={getImageUrl(rev.imageUrl)} alt={rev.name} className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-[#20b2aa]" />}
              <div>
                <div className="font-semibold text-gray-800 text-sm sm:text-base">{rev.name} <span className="text-xs text-gray-500">({rev.role})</span></div>
                <div className="text-gray-600 text-xs sm:text-sm">{rev.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 