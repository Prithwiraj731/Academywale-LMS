﻿﻿﻿import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';

const API_URL = import.meta.env.VITE_API_URL || '';
if (!API_URL) {
  console.warn('Warning: VITE_API_URL is not set. Image URLs may be invalid.');
}

const CAInterPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract paper ID from paperSlug (e.g., "paper-1" -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.ca.intermediate.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      
      console.log(`🔍 Fetching CA Inter courses for Paper ${paperId}`);
      console.log(`📍 Paper slug: ${paperSlug}`);
      console.log(`📋 Current paper:`, currentPaper);
      
      try {
        let foundCourses = [];
        
        // Strategy 1: Try exact paper ID match
        console.log(`📡 Strategy 1: Trying exact match for CA Inter Paper ${paperId}`);
        const primaryUrl = `${API_URL}/api/courses/CA/inter/${paperId}`;
        
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
            `${API_URL}/api/courses/ca/inter/${paperId}`,
            `${API_URL}/api/courses/CA/Inter/${paperId}`,
            `${API_URL}/api/courses/ca/Inter/${paperId}`,
            `${API_URL}/api/courses/CA/intermediate/${paperId}`,
            `${API_URL}/api/courses/ca/intermediate/${paperId}`
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
                const url = `${API_URL}/api/courses/CA/inter/${altId}`;
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
                console.log(`📊 Got ${data.courses.length} total courses, filtering for CA Inter Paper ${paperId}`);
                
                const filteredCourses = data.courses.filter(course => {
                  const isCA = course.category && course.category.toUpperCase().includes('CA');
                  const isInter = course.subcategory && (course.subcategory.toLowerCase().includes('inter') || course.subcategory.toLowerCase().includes('intermediate'));
                  
                  const paperMatches = (
                    course.paperId == paperId ||
                    course.paperId == parseInt(paperId) ||
                    String(course.paperId) === paperId ||
                    String(course.paperId) === String(paperId)
                  );
                  
                  const matches = isCA && isInter && paperMatches;
                  
                  if (matches) {
                    console.log(`🎯 Found matching course: ${course.subject} (Category: ${course.category}, Subcategory: ${course.subcategory}, PaperId: ${course.paperId})`);
                  }
                  
                  return matches;
                });
                
                if (filteredCourses.length > 0) {
                  console.log(`✅ Strategy 4 SUCCESS: Found ${filteredCourses.length} courses after client-side filtering`);
                  foundCourses = filteredCourses;
                } else {
                  console.log(`📋 No CA Inter Paper ${paperId} courses found in ${data.courses.length} total courses`);
                  
                  // Debug: show what CA Inter courses exist
                  const allCAInter = data.courses.filter(course => {
                    const isCA = course.category && course.category.toUpperCase().includes('CA');
                    const isInter = course.subcategory && (course.subcategory.toLowerCase().includes('inter') || course.subcategory.toLowerCase().includes('intermediate'));
                    return isCA && isInter;
                  });
                  
                  console.log(`🔍 Available CA Inter courses:`);
                  allCAInter.forEach(course => {
                    console.log(`   - ${course.subject} (Paper ${course.paperId})`);
                  });
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 4 failed:`, error.message);
          }
        }
        
        // Strategy 5: Show any CA Inter courses as fallback
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 5: Showing any available CA Inter courses as fallback`);
          
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
                const caInterCourses = data.courses.filter(course => {
                  const isCA = course.category && course.category.toUpperCase().includes('CA');
                  const isInter = course.subcategory && (course.subcategory.toLowerCase().includes('inter') || course.subcategory.toLowerCase().includes('intermediate'));
                  return isCA && isInter;
                });
                
                if (caInterCourses.length > 0) {
                  console.log(`✅ Strategy 5 SUCCESS: Showing ${caInterCourses.length} CA Inter courses as fallback`);
                  foundCourses = caInterCourses;
                  setError(`No courses found for Paper ${paperId} specifically, but showing all available CA Inter courses:`);
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
        setError('Server error');
        setCourses([]);
      }
      
      setLoading(false);
    }
    
    if (paperId) {
      fetchCourses();
    }
  }, [paperId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <BackButton />
        
        {currentPaper ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">
              CA Intermediate Paper - {currentPaper.id}
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight drop-shadow-lg">
              {currentPaper.title}
            </h3>
          </div>
        ) : (
          <div className="text-center text-red-600">Paper not found.</div>
        )}

        {loading && <div className="text-[#20b2aa] text-center">Loading courses...</div>}
        {error && <div className="text-red-600 text-center">{error}</div>}
        
        {!loading && !error && courses.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            No courses found for this paper.
          </div>
        )}

        {/* Course List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 mb-8">
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

export default CAInterPaperDetailPage;
