import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import BackButton from '../components/common/BackButton';
import { getInstituteImageUrl } from '../utils/imageUtils';
import { API_URL } from '../api';
import CourseCard from '../components/common/CourseCard/CourseCard';

export default function InstituteDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInstitute() {
      try {
        const res = await fetch(`${API_URL}/api/institutes/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (res.ok && data.institute) {
          setInstitute(data.institute);
        } else {
          setError(data.message || 'Institute not found');
        }
      } catch (err) {
        console.error('Error fetching institute details:', err);
        setError('Server error');
      }
      setLoading(false);
    }
    fetchInstitute();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-gray-500 font-bold text-lg">Loading institute details...</div>
      </div>
    );
  }

  if (error || !institute) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="text-red-500 text-xl font-bold mb-4">{error || 'Institute Not Found'}</div>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#20b2aa] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-teal-700 shadow"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Institute Header Box */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/80 mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-[#20b2aa] bg-white shadow-md flex items-center justify-center p-3 shrink-0">
              <img
                src={getInstituteImageUrl(institute)}
                alt={institute.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/logo.svg';
                }}
              />
            </div>
            <div className="text-center md:text-left flex-1 space-y-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {institute.name}
              </h1>
              {institute.address && (
                <p className="text-gray-600 text-sm sm:text-base font-medium">{institute.address}</p>
              )}
              <div className="inline-block bg-teal-50 px-4 py-2 rounded-xl border border-teal-200 text-teal-800 text-sm font-bold">
                {institute.courses?.length || 0} courses available
              </div>
            </div>
          </div>
        </div>

        {/* Courses Offered Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-200/80">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
            Courses Offered
          </h2>

          {(!institute.courses || institute.courses.length === 0) ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="text-gray-500 font-semibold text-base">No courses available for this institute yet.</div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
              {institute.courses.map((course) => (
                <CourseCard key={course.id || course._id} course={course} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
