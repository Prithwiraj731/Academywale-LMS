import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import BackButton from '../components/common/BackButton';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function InstituteDetailPage() {
  const { slug } = useParams();
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

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!institute) return <div className="text-center py-10">Institute not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img
              src={getImageUrl(institute.imageUrl)}
              alt={institute.name}
              className="w-48 h-48 rounded-lg object-contain border-4 border-teal-500 mb-6 md:mb-0 md:mr-8"
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{institute.name}</h1>
              <p className="text-gray-600 text-lg">{institute.address}</p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Courses Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institute.courses.map((course, index) => (
                <div key={index} className="bg-gray-100 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2">{course.subject}</h3>
                  <p className="text-gray-700">{course.courseType}</p>
                  <Link to={`/payment/${slug}/${index}`} className="text-teal-500 hover:underline mt-4 inline-block">View Details</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 