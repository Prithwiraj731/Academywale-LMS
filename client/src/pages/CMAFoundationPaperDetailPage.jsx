import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';

const API_URL = import.meta.env.VITE_API_URL || '';
if (!API_URL) {
  console.warn('Warning: VITE_API_URL is not set. Image URLs may be invalid.');
}

const CMAFoundationPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract paper ID from paperSlug (e.g., "paper-1" -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.cma.foundation.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      
      console.log(`🔍 Fetching CMA Foundation courses for Paper ${paperId}`);
      console.log(`📍 Paper slug: ${paperSlug}`);
      console.log(`📋 Current paper:`, currentPaper);
      
      try {
        let foundCourses = [];
        
        // Strategy 1: Try exact paper ID match
        console.log(`📡 Strategy 1: Trying exact match for CMA Foundation Paper ${paperId}`);
        const primaryUrl = `${API_URL}/api/courses/CMA/foundation/${paperId}`;
        
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
        
        // Strategy 2: Try case variations
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 2: Trying case variations`);
          
          const variations = [
            `${API_URL}/api/courses/cma/foundation/${paperId}`,
            `${API_URL}/api/courses/CMA/Foundation/${paperId}`,
            `${API_URL}/api/courses/cma/Foundation/${paperId}`
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
            `0${paperId}`,
            `paper${paperId}`,
            paperId.replace('paper-', '')
          ];
          
          for (const altId of alternativeIds) {
            if (altId !== paperId) {
              try {
                const url = `${API_URL}/api/courses/CMA/foundation/${altId}`;
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
        
        // Strategy 4: Get all courses and filter client-side
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 4: Fetching all courses and filtering client-side`);
          
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
                console.log(`📊 Got ${data.courses.length} total courses, filtering for CMA Foundation Paper ${paperId}`);
                
                const filteredCourses = data.courses.filter(course => {
                  const isCMA = course.category && course.category.toUpperCase().includes('CMA');
                  const isFoundation = course.subcategory && course.subcategory.toLowerCase().includes('foundation');
                  
                  const paperMatches = (
                    course.paperId == paperId ||
                    course.paperId == parseInt(paperId) ||
                    String(course.paperId) === paperId ||
                    String(course.paperId) === String(paperId)
                  );
                  
                  const matches = isCMA && isFoundation && paperMatches;
                  
                  if (matches) {
                    console.log(`🎯 Found matching course: ${course.subject} (Category: ${course.category}, Subcategory: ${course.subcategory}, PaperId: ${course.paperId})`);
                  }
                  
                  return matches;
                });
                
                if (filteredCourses.length > 0) {
                  console.log(`✅ Strategy 4 SUCCESS: Found ${filteredCourses.length} courses after client-side filtering`);
                  foundCourses = filteredCourses;
                } else {
                  console.log(`📋 No CMA Foundation Paper ${paperId} courses found in ${data.courses.length} total courses`);
                  
                  // Debug: show what CMA Foundation courses exist
                  const allCMAFoundation = data.courses.filter(course => {
                    const isCMA = course.category && course.category.toUpperCase().includes('CMA');
                    const isFoundation = course.subcategory && course.subcategory.toLowerCase().includes('foundation');
                    return isCMA && isFoundation;
                  });
                  
                  console.log(`🔍 Available CMA Foundation courses:`);
                  allCMAFoundation.forEach(course => {
                    console.log(`   - ${course.subject} (Paper ${course.paperId})`);
                  });
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 4 failed:`, error.message);
          }
        }
        
        // Strategy 5: Show any CMA Foundation courses as fallback
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 5: Showing any available CMA Foundation courses as fallback`);
          
          try {
            const allCoursesUrl = `${API_URL}/api/courses/all`;
            const res = await fetch(allCoursesUrl, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (res.ok) {
              const data = await res.json();
              if (data.courses) {
                const cmaFoundationCourses = data.courses.filter(course => {
                  const isCMA = course.category && course.category.toUpperCase().includes('CMA');
                  const isFoundation = course.subcategory && course.subcategory.toLowerCase().includes('foundation');
                  return isCMA && isFoundation;
                });
                
                if (cmaFoundationCourses.length > 0) {
                  console.log(`✅ Strategy 5 SUCCESS: Showing ${cmaFoundationCourses.length} CMA Foundation courses as fallback`);
                  foundCourses = cmaFoundationCourses;
                  setError(`No courses found for Paper ${paperId} specifically, but showing all available CMA Foundation courses:`);
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 5 failed:`, error.message);
          }
        }
        
        // Set final results
        if (foundCourses.length > 0) {
          console.log(`🎉 FINAL RESULT: Setting ${foundCourses.length} courses`);
          setCourses(foundCourses);
          if (!error) {
            setError('');
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
    
    if (paperId) {
      fetchCourses();
    }
  }, [paperId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <BackButton />
        
        {currentPaper && (
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              CMA Foundation Paper {paperId} - {currentPaper.title}
            </h1>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-700 mb-4">{currentPaper.description}</p>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin mb-4"></div>
            <p className="text-gray-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-xl text-gray-500">No courses available for this paper yet.</p>
            <p className="mt-2 text-gray-500">Check back later or contact support.</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <CourseCard 
                  key={course._id || index} 
                  course={course}
                  onViewDetails={() => navigate(`/course-details/${encodeURIComponent(course.courseType || 'course')}/${course._id}`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CMAFoundationPaperDetailPage;