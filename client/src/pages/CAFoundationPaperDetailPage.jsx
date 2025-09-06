﻿import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';

const API_URL = import.meta.env.VITE_API_URL || '';
if (!API_URL) {
  console.warn('Warning: VITE_API_URL is not set. Image URLs may be invalid.');
}

const CAFoundationPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract paper ID from paperSlug (e.g., "paper-1" -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.ca.foundation.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      
      console.log(`🔍 Fetching CA Foundation courses for Paper ${paperId}`);
      console.log(`📍 Paper slug: ${paperSlug}`);
      console.log(`📋 Current paper:`, currentPaper);
      
      try {
        let foundCourses = [];
        
        // Strategy 0: Try direct endpoint for CA Foundation Paper 1 (bypass complex filtering)
        if (paperId === '1') {
          console.log(`📡 Strategy 0: Trying direct CA Foundation Paper 1 endpoint`);
          const directUrl = `${API_URL}/api/courses/CA/foundation/1/direct`;
          
          try {
            console.log(`🔗 Trying direct URL: ${directUrl}`);
            const res = await fetch(directUrl, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            console.log(`📊 Direct response status: ${res.status}`);
            
            if (res.ok) {
              const data = await res.json();
              console.log(`📋 Direct response data:`, data);
              if (data.courses && data.courses.length > 0) {
                console.log(`✅ Strategy 0 SUCCESS: Found ${data.courses.length} courses via direct endpoint`);
                foundCourses = data.courses;
              } else {
                console.log(`⚠️ Strategy 0: Got response but no courses found`);
              }
            } else {
              console.log(`❌ Strategy 0: HTTP error ${res.status}`);
            }
          } catch (error) {
            console.log(`❌ Strategy 0 failed:`, error.message);
          }
        }
        
        // Strategy 1: Try exact paper ID match with includeStandalone parameter
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 1: Trying exact match for CA Foundation Paper ${paperId}`);
          const primaryUrl = `${API_URL}/api/courses/CA/foundation/${paperId}?includeStandalone=true`;
          
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
            
            console.log(`📊 Response status: ${res.status}`);
            
            if (res.ok) {
              const data = await res.json();
              console.log(`📋 Response data:`, data);
              if (data.courses && data.courses.length > 0) {
                console.log(`✅ Strategy 1 SUCCESS: Found ${data.courses.length} courses`);
                foundCourses = data.courses;
              } else {
                console.log(`⚠️ Strategy 1: Got response but no courses found`);
              }
            } else {
              console.log(`❌ Strategy 1: HTTP error ${res.status}`);
            }
          } catch (error) {
            console.log(`❌ Strategy 1 failed:`, error.message);
          }
        }
        
        // Strategy 2: Try case variations with includeStandalone parameter
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 2: Trying case variations`);
          
          const variations = [
            `${API_URL}/api/courses/ca/foundation/${paperId}?includeStandalone=true`,
            `${API_URL}/api/courses/CA/Foundation/${paperId}?includeStandalone=true`,
            `${API_URL}/api/courses/ca/Foundation/${paperId}?includeStandalone=true`
          ];
          
          for (const url of variations) {
            try {
              console.log(`🔗 Trying variation: ${url}`);
              const res = await fetch(url, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                cache: 'no-cache',
                mode: 'cors',
              });
              
              console.log(`📊 Variation response status: ${res.status}`);
              
              if (res.ok) {
                const data = await res.json();
                console.log(`📋 Variation response data:`, data);
                if (data.courses && data.courses.length > 0) {
                  console.log(`✅ Strategy 2 SUCCESS: Found ${data.courses.length} courses with ${url}`);
                  foundCourses = data.courses;
                  break;
                } else {
                  console.log(`⚠️ Strategy 2: Got response but no courses found for ${url}`);
                }
              } else {
                console.log(`❌ Strategy 2: HTTP error ${res.status} for ${url}`);
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
                const url = `${API_URL}/api/courses/CA/foundation/${altId}`;
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
        
        // Strategy 4: Debug - Check what courses exist in database
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 4: Checking database contents with debug endpoint`);
          
          // Debug all CA Foundation courses
          try {
            const caFoundationDebugUrl = `${API_URL}/api/courses/debug/ca-foundation`;
            console.log(`🔗 Debugging all CA Foundation courses: ${caFoundationDebugUrl}`);
            const res = await fetch(caFoundationDebugUrl, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (res.ok) {
              const data = await res.json();
              console.log(`🔍 CA Foundation debug results:`, data);
              
              if (data.caFoundationDetails && data.caFoundationDetails.length > 0) {
                console.log(`✅ Found ${data.caFoundationDetails.length} CA Foundation courses in database!`);
                data.caFoundationDetails.forEach((course, index) => {
                  console.log(`   ${index + 1}. "${course.subject}" - Category: "${course.category}", Subcategory: "${course.subcategory}", PaperId: "${course.paperId}" (${course.paperIdType}), Faculty: "${course.facultyName}"`);
                });
              } else {
                console.log(`❌ No CA Foundation courses found in database`);
              }
            }
          } catch (error) {
            console.log(`❌ CA Foundation debug failed:`, error.message);
          }
          
          try {
            const debugUrl = `${API_URL}/api/courses/simple-test`;
            console.log(`🔗 Fetching debug info: ${debugUrl}`);
            const res = await fetch(debugUrl, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (res.ok) {
              const data = await res.json();
              console.log(`🔍 Database debug info:`, data);
            }
          } catch (error) {
            console.log(`❌ Debug endpoint failed:`, error.message);
          }
          
          // Now try the test filter endpoint
          try {
            const testFilterUrl = `${API_URL}/api/courses/test-filter/CA/foundation/${paperId}`;
            console.log(`🔗 Testing filter: ${testFilterUrl}`);
            const res = await fetch(testFilterUrl, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (res.ok) {
              const data = await res.json();
              console.log(`🧪 Filter test results:`, data);
              
              if (data.test && data.test.filteredCourses && data.test.filteredCourses.length > 0) {
                console.log(`✅ Strategy 4 SUCCESS: Found ${data.test.filteredCourses.length} courses via test filter`);
                // We can't use these directly since they might not have all fields, but this tells us courses exist
              }
            }
          } catch (error) {
            console.log(`❌ Test filter failed:`, error.message);
          }
          
          // Get all courses and filter client-side
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
                console.log(`📊 Got ${data.courses.length} total courses, filtering for CA Foundation Paper ${paperId}`);
                
                // Show all courses for debugging
                console.log(`🔍 All courses in database:`);
                data.courses.forEach((course, index) => {
                  console.log(`   ${index + 1}. "${course.subject || course.title}" - Category: "${course.category}", Subcategory: "${course.subcategory}", PaperId: "${course.paperId}" (${typeof course.paperId})`);
                });
                
                const filteredCourses = data.courses.filter(course => {
                  const isCA = course.category && course.category.toUpperCase().includes('CA');
                  const isFoundation = course.subcategory && course.subcategory.toLowerCase().includes('foundation');
                  
                  const paperMatches = (
                    course.paperId == paperId ||
                    course.paperId == parseInt(paperId) ||
                    String(course.paperId) === paperId ||
                    String(course.paperId) === String(paperId)
                  );
                  
                  const matches = isCA && isFoundation && paperMatches;
                  
                  console.log(`🔍 Course "${course.subject}": CA=${isCA}, Foundation=${isFoundation}, PaperMatch=${paperMatches} -> Overall=${matches}`);
                  
                  return matches;
                });
                
                if (filteredCourses.length > 0) {
                  console.log(`✅ Strategy 4 SUCCESS: Found ${filteredCourses.length} courses after client-side filtering`);
                  foundCourses = filteredCourses;
                } else {
                  console.log(`📋 No CA Foundation Paper ${paperId} courses found in ${data.courses.length} total courses`);
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 4 failed:`, error.message);
          }
        }
        
        // Strategy 5: Show any CA Foundation courses as fallback
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 5: Showing any available CA Foundation courses as fallback`);
          
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
                const caFoundationCourses = data.courses.filter(course => {
                  const isCA = course.category && course.category.toUpperCase().includes('CA');
                  const isFoundation = course.subcategory && course.subcategory.toLowerCase().includes('foundation');
                  return isCA && isFoundation;
                });
                
                if (caFoundationCourses.length > 0) {
                  console.log(`✅ Strategy 5 SUCCESS: Showing ${caFoundationCourses.length} CA Foundation courses as fallback`);
                  foundCourses = caFoundationCourses;
                  setError(`No courses found for Paper ${paperId} specifically, but showing all available CA Foundation courses:`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-2 sm:px-4 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <BackButton />
        
        {currentPaper ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight drop-shadow-lg">
              CA Foundation Paper - {currentPaper.id}
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

export default CAFoundationPaperDetailPage;