import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';

// Try to use remote API URL first, fall back to local if not available
const REMOTE_API_URL = import.meta.env.VITE_API_URL || '';
const LOCAL_API_URL = import.meta.env.VITE_API_URL_LOCAL || 'http://localhost:5000';
const API_URL = REMOTE_API_URL || LOCAL_API_URL;

console.log('Using API URL:', API_URL);
if (!API_URL) {
  console.warn('Warning: No API URL is available. Image URLs and API calls may fail.');
}

const CMAFinalPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract paper ID from paperSlug (e.g., 'paper-1' -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.cma.final.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        console.log(`Fetching CMA final courses from: ${API_URL}/api/courses/CMA/final/${paperId}`);
        
        // Try different URL variations
        const urlVariations = [
          `${API_URL}/api/courses/CMA/final/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/cma/final/${paperId}?includeStandalone=true`,
          `${API_URL}/api/courses/CMA/Final/${paperId}`,
          `${API_URL}/api/courses/CMA/FINAL/${paperId}`,
        ];
        
        let coursesFound = false;
        
        // Try each URL variation
        for (const url of urlVariations) {
          if (coursesFound) break;
          
          try {
            console.log(`Trying URL: ${url}`);
            const res = await fetch(url, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (!res.ok) {
              console.log(`URL ${url} returned status: ${res.status}`);
              continue;
            }
            
            const data = await res.json();
            
            if (data.courses && data.courses.length > 0) {
              console.log(`Found ${data.courses.length} courses using URL: ${url}`);
              setCourses(data.courses);
              coursesFound = true;
              break;
            }
          } catch (urlError) {
            console.error(`Error with URL ${url}:`, urlError);
          }
        }
        
        // If no courses found with any URL variation, show 'no courses' message
        if (!coursesFound) {
          console.log('No courses found for this paper. Not creating mock courses anymore.');
          setCourses([]);
          setError('No courses available for this paper yet. Check back later.');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Server error');
      }
      setLoading(false);
    }
    if (currentPaper) fetchCourses();
  }, [paperSlug, currentPaper]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col'>
      <div className='max-w-7xl w-full mx-auto flex-1'>
        <BackButton />
        {currentPaper ? (
          <div className='text-center mb-8'>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg'>
              CMA Final Paper - {currentPaper.id}
            </h2>
            <h3 className='text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight drop-shadow-lg'>
              {currentPaper.title}
            </h3>
          </div>
        ) : (
          <div className='text-center text-red-600'>Paper not found.</div>
        )}

        {loading && <div className='text-[#20b2aa] text-center'>Loading courses...</div>}
        {error && <div className='text-red-600 text-center'>{error}</div>}
        {!loading && !error && courses.length === 0 && (
          <div className='text-center text-gray-400 py-12'>
            No courses found for this paper.
          </div>
        )}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mb-8'>
          {courses.map((course, idx) => (
            <CourseCard 
              key={idx}
              course={course}
              apiUrl={API_URL}
              showModal={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMAFinalPaperDetailPage;
