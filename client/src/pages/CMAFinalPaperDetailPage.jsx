﻿import React, { useState, useEffect } from 'react';
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

  // Extract paper ID from paperSlug (e.g., "paper-1" -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.cma.final.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      
      console.log(`🔍 Fetching CMA final courses for Paper ${paperId}`);
      console.log(`📍 Paper slug: ${paperSlug}`);
      console.log(`📋 Current paper:`, currentPaper);
      
      try {
        let foundCourses = [];
        
        // Strategy 1: Try exact paper ID match
        console.log(`📡 Strategy 1: Trying exact match for Paper ${paperId}`);
        const primaryUrl = `${API_URL}/api/courses/CMA/final/${paperId}`;
        
        try {
          console.log(`🔗 Trying URL: ${primaryUrl}`);
          const res = await fetch(primaryUrl, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            cache: 'no-cache',
            mode: 'cors',
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.courses && data.courses.length > 0) {
              console.log(`✅ Strategy 1 SUCCESS: Found ${data.courses.length} courses`);
              foundCourses = data.courses;
            }
          }
        } catch (error) {
          console.log(`❌ Strategy 1 failed:`, error.message);
        }
        
        // Strategy 2: If no courses found, try different case variations
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 2: Trying case variations`);
          
          const variations = [
            `${API_URL}/api/courses/cma/final/${paperId}`,
            `${API_URL}/api/courses/CMA/Final/${paperId}`,
            `${API_URL}/api/courses/cma/Final/${paperId}`
          ];
          
          for (const url of variations) {
            try {
              console.log(`🔗 Trying variation: ${url}`);
              const res = await fetch(url, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                cache: 'no-cache',
                mode: 'cors',
              });
              
              if (res.ok) {
                const data = await res.json();
                if (data.courses && data.courses.length > 0) {
                  console.log(`✅ Strategy 2 SUCCESS: Found ${data.courses.length} courses with ${url}`);
                  foundCourses = data.courses;
                  break;
                }
              }
            } catch (error) {
              console.log(`❌ Variation failed: ${url}`, error.message);
            }
          }
        }
        
        // Strategy 3: Try alternative paper ID formats
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 3: Trying alternative paper ID formats`);
          
          const alternativeIds = [
            paperId.toString(),
            parseInt(paperId).toString(),
            `0${paperId}`, // padded
            `paper${paperId}`, // with prefix
            paperId.replace('paper-', '') // clean version
          ];
          
          for (const altId of alternativeIds) {
            if (altId !== paperId) { // skip if same as original
              try {
                const url = `${API_URL}/api/courses/CMA/final/${altId}`;
                console.log(`🔗 Trying alternative ID: ${url}`);
                const res = await fetch(url, {
                  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                  cache: 'no-cache',
                  mode: 'cors',
                });
                
                if (res.ok) {
                  const data = await res.json();
                  if (data.courses && data.courses.length > 0) {
                    console.log(`✅ Strategy 3 SUCCESS: Found ${data.courses.length} courses with ID ${altId}`);
                    foundCourses = data.courses;
                    break;
                  }
                }
              } catch (error) {
                console.log(`❌ Alternative ID ${altId} failed:`, error.message);
              }
            }
          }
        }
        
        // Strategy 4: Get all CMA Final courses and filter client-side
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 4: Fetching all CMA Final courses and filtering client-side`);
          
          try {
            const allCoursesUrl = `${API_URL}/api/courses/all`;
            console.log(`🔗 Fetching all courses: ${allCoursesUrl}`);
            const res = await fetch(allCoursesUrl, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (res.ok) {
              const data = await res.json();
              if (data.courses && data.courses.length > 0) {
                console.log(`📊 Got ${data.courses.length} total courses, filtering for CMA Final Paper ${paperId}`);
                
                // Filter for CMA Final courses with our paper ID
                const filteredCourses = data.courses.filter(course => {
                  const isCMA = course.category && course.category.toUpperCase().includes('CMA');
                  const isFinal = course.subcategory && course.subcategory.toLowerCase().includes('final');
                  
                  // Try multiple paper ID matches
                  const paperMatches = (
                    course.paperId == paperId ||
                    course.paperId == parseInt(paperId) ||
                    String(course.paperId) === paperId ||
                    String(course.paperId) === String(paperId)
                  );
                  
                  const matches = isCMA && isFinal && paperMatches;
                  
                  if (matches) {
                    console.log(`🎯 Found matching course: ${course.subject} (Category: ${course.category}, Subcategory: ${course.subcategory}, PaperId: ${course.paperId})`);
                  }
                  
                  return matches;
                });
                
                if (filteredCourses.length > 0) {
                  console.log(`✅ Strategy 4 SUCCESS: Found ${filteredCourses.length} courses after client-side filtering`);
                  foundCourses = filteredCourses;
                } else {
                  console.log(`📋 No CMA Final Paper ${paperId} courses found in ${data.courses.length} total courses`);
                  
                  // Debug: show what CMA Final courses exist
                  const allCMAFinal = data.courses.filter(course => {
                    const isCMA = course.category && course.category.toUpperCase().includes('CMA');
                    const isFinal = course.subcategory && course.subcategory.toLowerCase().includes('final');
                    return isCMA && isFinal;
                  });
                  
                  console.log(`🔍 Available CMA Final courses:`);
                  allCMAFinal.forEach(course => {
                    console.log(`   - ${course.subject} (Paper ${course.paperId})`);
                  });
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 4 failed:`, error.message);
          }
        }
        
        // Strategy 6: Use dedicated CMA Final debug endpoint
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 6: Using dedicated CMA Final debug endpoint`);
          
          try {
            const debugUrl = `${API_URL}/api/courses/debug/cma/final`;
            console.log(`🔗 Trying debug endpoint: ${debugUrl}`);
            const res = await fetch(debugUrl, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (res.ok) {
              const data = await res.json();
              if (data.success && data.debug) {
                console.log(`📊 Debug endpoint response:`, data.debug.summary);
                
                // Check if we have courses for the specific paper
                if (data.debug.coursesByPaperId[paperId]) {
                  const paperCourses = data.debug.coursesByPaperId[paperId];
                  console.log(`✅ Strategy 6 SUCCESS: Found ${paperCourses.length} courses for Paper ${paperId}`);
                  
                  // Convert debug format to expected course format
                  foundCourses = paperCourses.map(course => ({
                    ...course,
                    _id: `debug-${course.subject}-${paperId}`,
                    title: course.subject,
                    isActive: true
                  }));
                } else {
                  // Show available papers for user guidance
                  const availablePapers = data.debug.summary.paperIdsWithCourses || [];
                  console.log(`📌 Available CMA Final papers:`, availablePapers);
                  
                  if (availablePapers.length > 0) {
                    setError(`No courses found for Paper ${paperId}. Available CMA Final papers: ${availablePapers.join(', ')}`);
                  } else {
                    console.log(`📋 No CMA Final courses found at all`);
                  }
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 6 failed:`, error.message);
          }
        }
        
        // Set final results
        if (foundCourses.length > 0) {
          console.log(`🎉 FINAL RESULT: Setting ${foundCourses.length} courses`);
          setCourses(foundCourses);
          if (!error) {
            setError(''); // Clear any previous error
          }
        } else {
          console.log(`❌ FINAL RESULT: No courses found at all`);
          setCourses([]);
          setError("No courses available for this paper yet. Check back later.");
        }
        
      } catch (err) {
        console.error('❌ Overall error fetching courses:', err);
        setError('Server error: ' + err.message);
        setCourses([]);
      }
      
      setLoading(false);
    }
    
    if (currentPaper) {
      fetchCourses();
    } else {
      console.log(`❌ No current paper found for slug: ${paperSlug}`);
      setLoading(false);
      setError('Paper not found');
    }
  }, [paperSlug, currentPaper, paperId]);

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
              key={course._id || idx}
              course={course}
              onViewDetails={() => navigate(`/course-details/${encodeURIComponent(course.courseType || 'course')}/${course._id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CMAFinalPaperDetailPage;