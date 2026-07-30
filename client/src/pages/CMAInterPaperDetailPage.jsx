import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import BackButton from '../components/common/BackButton';
import CourseCard from '../components/common/CourseCard';
import papersData from '../data/papersData';
import { API_URL } from '../api';
import SubjectFilterSidebar from '../components/common/SubjectFilterSidebar';

const CMAInterPaperDetailPage = () => {
  const { paperSlug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Subject Filter state
  const paramSubject = searchParams.get('Subject') || searchParams.get('subject');
  const [selectedSubjects, setSelectedSubjects] = useState(paramSubject ? [paramSubject] : []);

  const handleSubjectChange = (subs) => {
    setSelectedSubjects(subs);
    if (subs.length === 1) {
      setSearchParams({ Subject: subs[0] });
    } else {
      setSearchParams({});
    }
  };

  // Filter courses by selected subjects
  const filteredCourses = React.useMemo(() => {
    if (!selectedSubjects || selectedSubjects.length === 0) return courses;
    return courses.filter(course => {
      const cSub = String(course.subject || course.title || '').toLowerCase();
      return selectedSubjects.some(s => {
        const target = s.toLowerCase();
        return cSub.includes(target) || (target.includes('taxation') && cSub.includes('tax'));
      });
    });
  }, [courses, selectedSubjects]);

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
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-teal-200/80 p-6 sm:p-8 text-center mb-8 shadow-lg max-w-3xl mx-auto">
            <span className="inline-block text-xs font-bold tracking-widest text-[#20b2aa] uppercase bg-teal-50 px-3 py-1 rounded-full border border-teal-200 mb-3">
              CMA Intermediate
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Paper - {currentPaper.id}
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-teal-500 to-[#20b2aa] mx-auto my-3 rounded-full" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
              {currentPaper.title}
            </h3>
          </div>
        ) : (
          <div className="text-center text-red-600">Paper not found.</div>
        )}

        {/* Sidebar + Course Cards Grid */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <SubjectFilterSidebar
            categoryTitle="CMA Inter"
            selectedSubjects={selectedSubjects}
            onSubjectChange={handleSubjectChange}
            availableSubjects={courses.map(c => c.subject || c.title).filter(Boolean)}
            onClearFilters={() => handleSubjectChange([])}
          />

          <div className="flex-1 w-full">
            {loading && <div className="text-[#20b2aa] text-center py-10 font-bold">Loading courses...</div>}
            {error && <div className="text-red-600 text-center py-10 font-bold">{error}</div>}
            
            {!loading && !error && filteredCourses.length === 0 && (
              <div className="text-center text-gray-500 bg-white/70 backdrop-blur-sm p-10 rounded-3xl border border-gray-200 shadow-sm font-semibold">
                No courses found matching selected filter.
              </div>
            )}

            {!loading && filteredCourses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mb-8">
                {filteredCourses.map((course, idx) => (
                  <CourseCard 
                    key={course._id || course.id || idx}
                    course={course}
                    onViewDetails={() => navigate(`/course-details/${encodeURIComponent(course.courseType || 'course')}/${course._id || course.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CMAInterPaperDetailPage;
