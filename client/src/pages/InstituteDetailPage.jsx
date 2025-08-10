import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackButton from '../components/common/BackButton';
import { getCourseImageUrl } from '../utils/imageUtils';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function InstituteDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInstitute() {
      try {
        const res = await fetch(`${API_URL}/api/institutes/${slug}`);
        const data = await res.json();
        if (res.ok) {
          setInstitute(data.institute);
        } else {
          setError(data.message || 'Institute not found');
        }
      } catch (err) {
        setError('Server error');
      }
      setLoading(false);
    }
    fetchInstitute();
  }, [slug]);

  const getImageUrl = (url) => {
    if (!url) return '/logo.svg';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  const getPosterUrl = (course) => {
    return getCourseImageUrl(course);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!institute) return <div className="text-center py-10">Institute not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fffde7]">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={getImageUrl(institute.imageUrl)}
              alt={institute.name}
              className="w-48 h-48 rounded-2xl object-contain border-4 border-teal-500 bg-gray-50"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-4 text-gray-900">{institute.name}</h1>
              {institute.address && (
                <p className="text-gray-600 text-lg mb-4">{institute.address}</p>
              )}
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <span className="text-teal-700 font-semibold">
                  {institute.courses?.length || 0} courses available
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-6 text-purple-700">Courses Offered</h2>
          
          {(!institute.courses || institute.courses.length === 0) ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No courses available for this institute yet.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {institute.courses.map((course, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-200">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Course Poster */}
                    <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                      {course.posterUrl ? (
                        <img 
                          src={getPosterUrl(course)} 
                          alt="Course Poster" 
                          className="object-cover w-full h-full" 
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">No Poster</div>
                      )}
                    </div>
                    
                    {/* Course Details */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{course.subject}</h3>
                      
                      {course.courseType && (
                        <span className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-2 w-fit">
                          {course.courseType}
                        </span>
                      )}
                      
                      <div className="text-sm text-gray-600 mb-3 space-y-1">
                        {course.facultyName && (
                          <div>
                            <span className="font-semibold">Faculty:</span> 
                            {course.facultySlug ? (
                              <Link 
                                to={`/faculty/${course.facultySlug}`}
                                className="text-blue-600 hover:underline ml-1"
                              >
                                {course.facultyName}
                              </Link>
                            ) : (
                              <span className="ml-1">{course.facultyName}</span>
                            )}
                          </div>
                        )}
                        {course.noOfLecture && (
                          <div><span className="font-semibold">Lectures:</span> {course.noOfLecture}</div>
                        )}
                        {course.videoLanguage && (
                          <div><span className="font-semibold">Language:</span> {course.videoLanguage}</div>
                        )}
                      </div>
                      
                      {/* Price */}
                      {(course.costPrice || course.sellingPrice) && (
                        <div className="flex items-center gap-3 mb-3">
                          {course.costPrice && course.sellingPrice && course.costPrice > course.sellingPrice ? (
                            <>
                              <span className="text-lg font-semibold text-gray-400 line-through">₹{course.costPrice}</span>
                              <span className="text-xl font-bold text-green-600">₹{course.sellingPrice}</span>
                              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                                {Math.round(((course.costPrice - course.sellingPrice) / course.costPrice) * 100)}% off
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-blue-600">₹{course.sellingPrice || course.costPrice}</span>
                          )}
                        </div>
                      )}
                      
                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (course.facultySlug) {
                            navigate(`/faculty/${course.facultySlug}`);
                          } else {
                            alert('Faculty information not available');
                          }
                        }}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm w-fit"
                      >
                        View Course Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 