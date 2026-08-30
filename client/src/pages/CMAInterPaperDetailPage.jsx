import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';
import { API_URL } from '../api';

const CMAInterPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract paper ID from paperSlug (e.g., "paper-1" -> 1)
  const paperId = paperSlug?.replace('paper-', '');
  const currentPaper = papersData.cma.inter.find(p => `paper-${p.id}` === paperSlug);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      
      try {
        let foundCourses = [];
        
        // Strategy 1: Try exact paper ID match
        const primaryUrl = `${API_URL}/api/courses/CMA/inter/${paperId}`;
        
        try {
          const res = await fetch(primaryUrl, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            cache: 'no-cache',
            mode: 'cors',
          });
          
          if (res.ok) {
            const data = await res.json();
            if (data.courses && data.courses.length > 0) {
              foundCourses = data.courses;
            }
          }
        } catch (error) {
          console.log(`❌ Strategy 1 failed:`, error.message);
        }
        
        // Strategy 2: Try case variations
        if (foundCourses.length === 0) {
          const variations = [
            `${API_URL}/api/courses/cma/inter/${paperId}`,
            `${API_URL}/api/courses/CMA/Inter/${paperId}`,
            `${API_URL}/api/courses/cma/Inter/${paperId}`,
            `${API_URL}/api/courses/CMA/intermediate/${paperId}`,
            `${API_URL}/api/courses/cma/intermediate/${paperId}`
          ];
          
          for (const url of variations) {
            try {
              const res = await fetch(url, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                cache: 'no-cache',
                mode: 'cors',
              });
              
              if (res.ok) {
                const data = await res.json();
                if (data.courses && data.courses.length > 0) {
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
                const url = `${API_URL}/api/courses/CMA/inter/${altId}`;
                const res = await fetch(url, {
                  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                  cache: 'no-cache',
                  mode: 'cors',
                });
                
                if (res.ok) {
                  const data = await res.json();
                  if (data.courses && data.courses.length > 0) {
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
          try {
            const allCoursesUrl = `${API_URL}/api/courses/all`;
            const res = await fetch(allCoursesUrl, {
              headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
              cache: 'no-cache',
              mode: 'cors',
            });
            
            if (res.ok) {
              const data = await res.json();
              if (data.courses && data.courses.length > 0) {
                const filtered = data.courses.filter(course => {
                  const isCMA = course.category && course.category.toUpperCase().includes('CMA');
                  const isInter = course.subcategory && (course.subcategory.toLowerCase().includes('inter') || course.subcategory.toLowerCase().includes('intermediate'));
                  const paperMatch = course.paperId && course.paperId.toString().includes(paperId.toString());
                  return isCMA && isInter && paperMatch;
                });
                if (filtered.length > 0) {
                  foundCourses = filtered;
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 4 failed:`, error.message);
          }
        }
        
        // Strategy 5: Show any CMA Inter courses as fallback
        if (foundCourses.length === 0) {
          console.log(`📡 Strategy 5: Showing any available CMA Inter courses as fallback`);
          
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
                const cmaInterCourses = data.courses.filter(course => {
                  const isCMA = course.category && course.category.toUpperCase().includes('CMA');
                  const isInter = course.subcategory && (course.subcategory.toLowerCase().includes('inter') || course.subcategory.toLowerCase().includes('intermediate'));
                  return isCMA && isInter;
                });
                
                if (cmaInterCourses.length > 0) {
                  console.log(`✅ Strategy 5 SUCCESS: Showing ${cmaInterCourses.length} CMA Inter courses as fallback`);
                  foundCourses = cmaInterCourses;
                  setError(`No courses found for Paper ${paperId} specifically, but showing all available CMA Inter courses:`);
                }
              }
            }
          } catch (error) {
            console.log(`❌ Strategy 5 failed:`, error.message);
          }
        }
        
        // Set final results
        foundCourses = foundCourses.filter(course => {
          const coursePaperIds = String(course.paperId ?? course.paper_id ?? '').split(',').map(s => s.trim().replace(/\D/g, '')).filter(Boolean);
          return coursePaperIds.includes(String(paperId));
        });

        const sortBySequence = (a, b) => {
          const orderA = a.displayOrder !== undefined && a.displayOrder !== null ? Number(a.displayOrder) : (a.display_order !== undefined && a.display_order !== null ? Number(a.display_order) : 9999);
          const orderB = b.displayOrder !== undefined && b.displayOrder !== null ? Number(b.displayOrder) : (b.display_order !== undefined && b.display_order !== null ? Number(b.display_order) : 9999);
          if (orderA !== orderB) return orderA - orderB;
          return new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0);
        };

        if (foundCourses.length > 0) {
          console.log(`🎉 FINAL RESULT: Setting ${foundCourses.length} courses`);
          setCourses(foundCourses.sort(sortBySequence));

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
    
    if (currentPaper) {
      fetchCourses();
    } else {
      console.log(`❌ No current paper found for slug: ${paperSlug}`);
      setLoading(false);
      setError('Paper not found');
    }
  }, [paperSlug, currentPaper, paperId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-yellow-50 py-8 px-3 sm:px-6 flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1">
        <BackButton />
        {currentPaper ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-teal-200/80 p-4 sm:p-8 text-center mb-6 sm:mb-8 shadow-lg max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <span className="inline-block text-xs font-extrabold tracking-widest text-[#20b2aa] uppercase bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200 shadow-sm">
                CMA Intermediate
              </span>

              {/* Paper Selector Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
                <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Paper:
                </span>
                <select
                  id="paper-select-cma-inter"
                  value={paperSlug}
                  onChange={(e) => navigate(`/courses/cma/inter/${e.target.value}`)}
                  className="bg-white border-2 border-teal-500 text-teal-900 font-extrabold text-xs sm:text-sm rounded-xl px-3 py-1.5 sm:py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer transition-all max-w-[220px] sm:max-w-xs truncate"
                >
                  {papersData.cma.inter.map((p) => (
                    <option key={p.id} value={`paper-${p.id}`}>
                      Paper {p.id}: {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Paper - {currentPaper.id}
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-teal-500 to-[#20b2aa] mx-auto my-3 rounded-full" />
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight mb-4">
              {currentPaper.title}
            </h3>

            {/* Subject Overview & Exam Blueprint */}
            <div className="mt-4 pt-4 border-t border-teal-100 text-left grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100">
                <span className="font-bold text-teal-900 block mb-0.5">Passing Standard</span>
                <span className="text-teal-800">40% subject min, 50% group aggregate (200/400).</span>
              </div>
              <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900 block mb-0.5">Paper Scope</span>
                <span className="text-blue-800">100 Marks • ICMAI Syllabus 2022.</span>
              </div>
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-100 flex flex-col justify-between">
                <span className="font-bold text-purple-900 block mb-0.5">Free Study Notes</span>
                <button
                  type="button"
                  onClick={() => navigate('/resources/cma')}
                  className="text-purple-700 font-bold hover:underline text-left"
                >
                  View Free CMA Guides →
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600">Paper not found.</div>
        )}

        {/* Course Cards Grid */}
        <div className="w-full">
          {loading && <div className="text-[#20b2aa] text-center py-10 font-bold">Loading available faculty courses...</div>}
          {error && <div className="text-red-600 text-center py-10 font-bold">{error}</div>}
          
          {!loading && !error && courses.length === 0 && (
            <div className="bg-white/80 border border-gray-200 rounded-2xl p-8 text-center max-w-xl mx-auto my-8 shadow-sm">
              <h4 className="text-base font-bold text-gray-800 mb-1">New Batches Updating Shortly</h4>
              <p className="text-xs text-gray-500 mb-4">
                We are currently enrolling for the upcoming exam term. Meanwhile, you can explore our free syllabus study guides, notes, and MCQ practice sets.
              </p>
              <button
                onClick={() => navigate('/resources/cma')}
                className="bg-[#20b2aa] hover:bg-[#19958e] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
              >
                Explore Free CMA Resources
              </button>
            </div>
          )}

          {!loading && courses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Available Video Lectures & Batches</h3>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 max-w-7xl mx-auto">
                {courses.map((course, idx) => (
                  <CourseCard 
                    key={course._id || course.id || idx}
                    course={course}
                    onViewDetails={() => navigate(`/course-details/${encodeURIComponent(course.courseType || 'course')}/${course._id || course.id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Free Study Material Footer Card */}
        <div className="mt-8 mb-4 bg-white/90 border border-teal-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Need Free Study Materials, Past Papers & MCQs?</h4>
            <p className="text-xs text-gray-600">Access comprehensive chapter-wise study notes, formulas, and 3-hour exam time management strategies.</p>
          </div>
          <button
            onClick={() => navigate('/resources')}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shrink-0"
          >
            Visit Learning Hub
          </button>
        </div>
      </div>
    </div>
  );
};

export default CMAInterPaperDetailPage;
