import React, { useState, useEffect } from 'react';
import { API_URL } from '../../api';
import DeleteAllCoursesButton from './DeleteAllCoursesButton';

// Component to display courses organized by CA/CMA papers
const CoursesByPaperSection = ({ onEditCourse, onDeleteCourse }) => {
  const [loading, setLoading] = useState(true);
  const [coursesByType, setCoursesByType] = useState({
    CA: {
      Foundation: {},
      Inter: {},
      Final: {}
    },
    CMA: {
      Foundation: {},
      Inter: {},
      Final: {}
    }
  });
  
  // Function to fetch all faculties with courses and reorganize by paper
  const loadCoursesByPaper = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/faculties?includeCourses=true`);
      const data = await res.json();
      
      if (res.ok && data.faculties) {
        // Create structure to organize courses by CA/CMA papers
        const organizedCourses = {
          CA: {
            Foundation: {},
            Inter: {},
            Final: {}
          },
          CMA: {
            Foundation: {},
            Inter: {}
          }
        };
        
        // Process all faculties and their courses
        data.faculties.forEach(faculty => {
          if (faculty.courses && faculty.courses.length > 0) {
            faculty.courses.forEach(course => {
              // Skip courses without proper category/type information
              if (!course.category || !course.courseType) return;
              
              const category = course.category; // 'CA' or 'CMA'
              let level = course.subcategory || 'Foundation'; // 'Foundation', 'Inter', 'Final'
              
              // Normalize level
              if (level.toLowerCase() === 'foundation') level = 'Foundation';
              if (level.toLowerCase() === 'inter' || level.toLowerCase() === 'intermediate') level = 'Inter';
              if (level.toLowerCase() === 'final') level = 'Final';
              
              // Extract paper ID from course
              const paperId = course.paperId || extractPaperId(course);
              
              if (!paperId) return; // Skip if we can't determine a paper
              
              // Initialize paper if needed
              if (!organizedCourses[category]?.[level]?.[paperId]) {
                organizedCourses[category][level][paperId] = {
                  name: getPaperName(category, level, paperId),
                  courses: []
                };
              }
              
              // Add the course with faculty info
              organizedCourses[category][level][paperId].courses.push({
                ...course,
                facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
                facultyId: faculty._id,
                facultySlug: faculty.slug
              });
            });
          }
        });
        
        setCoursesByType(organizedCourses);
      }
    } catch (error) {
      console.error('Error loading courses by paper:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoursesByPaper();
  }, []);
  
  // Helper function to extract paper ID from course
  const extractPaperId = (course) => {
    // Try to extract from subject or title
    const paperMatch = (course.subject || course.title || '').match(/paper\s*(\d+)/i);
    if (paperMatch) return paperMatch[1];
    
    // If no match, use a default
    return 'Unknown';
  };
  
  // Helper function to get paper name based on category, level and ID
  const getPaperName = (category, level, paperId) => {
    if (category === 'CA') {
      if (level === 'Foundation') {
        const papers = {
          '1': 'Principles and Practice of Accounting',
          '2': 'Business Laws and Business Correspondence and Reporting',
          '3': 'Business Mathematics, Logical Reasoning & Statistics',
          '4': 'Business Economics & Business and Commercial Knowledge'
        };
        return papers[paperId] || `Paper ${paperId}`;
      } 
      else if (level === 'Inter') {
        const papers = {
          '1': 'Accounting',
          '2': 'Corporate and Other Laws',
          '3': 'Cost and Management Accounting',
          '4': 'Taxation',
          '5': 'Advanced Accounting',
          '6': 'Auditing and Assurance',
          '7': 'Enterprise Information Systems & Strategic Management',
          '8': 'Financial Management & Economics for Finance'
        };
        return papers[paperId] || `Paper ${paperId}`;
      }
    }
    else if (category === 'CMA') {
      if (level === 'Foundation') {
        const papers = {
          '1': 'Fundamentals of Economics & Management',
          '2': 'Fundamentals of Accounting',
          '3': 'Fundamentals of Laws & Ethics',
          '4': 'Fundamentals of Business Mathematics & Statistics'
        };
        return papers[paperId] || `Paper ${paperId}`;
      }
    }
    
    return `Paper ${paperId}`;
  };
  
  const handleEditCourse = (facultySlug, courseIndex) => {
    // Call the parent component's edit function
    if (typeof onEditCourse === 'function') {
      onEditCourse(facultySlug, courseIndex);
    } else {
      alert('Edit function not available');
    }
  };
  
  const handleDeleteCourse = (facultySlug, courseIndex) => {
    // Call the parent component's delete function
    if (typeof onDeleteCourse === 'function') {
      onDeleteCourse(facultySlug, courseIndex);
    } else {
      alert('Delete function not available');
    }
  };
  
  // Render courses by category and paper
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-purple-700">All Courses by CA/CMA Papers</h3>
        <div className="flex space-x-2">
          <button 
            onClick={loadCoursesByPaper}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <DeleteAllCoursesButton />
      
      {loading && <div className="text-blue-500">Loading courses...</div>}
      
      {!loading && (
        <div className="space-y-8">
          {/* CA Courses */}
          <div className="border-b pb-6">
            <h4 className="text-lg font-bold text-blue-800 mb-4">CA Courses</h4>
            
            {/* CA Foundation */}
            <div className="mb-6">
              <h5 className="text-md font-semibold text-blue-700 border-b border-blue-200 pb-1 mb-3">Foundation</h5>
              {Object.keys(coursesByType.CA.Foundation).length === 0 ? (
                <div className="text-gray-500 italic">No CA Foundation courses found</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(coursesByType.CA.Foundation).map(([paperId, paper]) => (
                    <div key={`ca-foundation-${paperId}`} className="border-l-4 border-blue-500 pl-3 pb-2">
                      <h6 className="text-md font-medium text-gray-800 mb-2">Paper {paperId}: {paper.name}</h6>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paper.courses.map((course, idx) => (
                          <div key={`ca-f-${paperId}-${idx}`} className="bg-white rounded-xl shadow p-3 flex gap-3 items-start border border-blue-100">
                            {course.posterUrl && (
                              <img 
                                src={course.posterUrl.startsWith('http') ? course.posterUrl : `${API_URL}${course.posterUrl}`} 
                                alt="Poster" 
                                className="w-16 h-16 object-cover rounded-lg border border-blue-200" 
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-bold text-blue-700 text-sm">{course.subject}</div>
                              <div className="text-xs text-gray-600">By: {course.facultyName || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Price: ₹{course.sellingPrice || 0}</div>
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => handleEditCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs hover:bg-yellow-200"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* CA Inter */}
            <div className="mb-6">
              <h5 className="text-md font-semibold text-blue-700 border-b border-blue-200 pb-1 mb-3">Intermediate</h5>
              {Object.keys(coursesByType.CA.Inter).length === 0 ? (
                <div className="text-gray-500 italic">No CA Inter courses found</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(coursesByType.CA.Inter).map(([paperId, paper]) => (
                    <div key={`ca-inter-${paperId}`} className="border-l-4 border-blue-500 pl-3 pb-2">
                      <h6 className="text-md font-medium text-gray-800 mb-2">Paper {paperId}: {paper.name}</h6>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paper.courses.map((course, idx) => (
                          <div key={`ca-i-${paperId}-${idx}`} className="bg-white rounded-xl shadow p-3 flex gap-3 items-start border border-blue-100">
                            {course.posterUrl && (
                              <img 
                                src={course.posterUrl.startsWith('http') ? course.posterUrl : `${API_URL}${course.posterUrl}`} 
                                alt="Poster" 
                                className="w-16 h-16 object-cover rounded-lg border border-blue-200" 
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-bold text-blue-700 text-sm">{course.subject}</div>
                              <div className="text-xs text-gray-600">By: {course.facultyName || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Price: ₹{course.sellingPrice || 0}</div>
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => handleEditCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs hover:bg-yellow-200"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* CA Final */}
            <div className="mb-6">
              <h5 className="text-md font-semibold text-blue-700 border-b border-blue-200 pb-1 mb-3">Final</h5>
              {Object.keys(coursesByType.CA.Final).length === 0 ? (
                <div className="text-gray-500 italic">No CA Final courses found</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(coursesByType.CA.Final).map(([paperId, paper]) => (
                    <div key={`ca-final-${paperId}`} className="border-l-4 border-blue-500 pl-3 pb-2">
                      <h6 className="text-md font-medium text-gray-800 mb-2">Paper {paperId}: {paper.name}</h6>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paper.courses.map((course, idx) => (
                          <div key={`ca-f-${paperId}-${idx}`} className="bg-white rounded-xl shadow p-3 flex gap-3 items-start border border-blue-100">
                            {course.posterUrl && (
                              <img 
                                src={course.posterUrl.startsWith('http') ? course.posterUrl : `${API_URL}${course.posterUrl}`} 
                                alt="Poster" 
                                className="w-16 h-16 object-cover rounded-lg border border-blue-200" 
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-bold text-blue-700 text-sm">{course.subject}</div>
                              <div className="text-xs text-gray-600">By: {course.facultyName || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Price: ₹{course.sellingPrice || 0}</div>
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => handleEditCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs hover:bg-yellow-200"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* CMA Courses */}
          <div>
            <h4 className="text-lg font-bold text-green-800 mb-4">CMA Courses</h4>
            
            {/* CMA Foundation */}
            <div className="mb-6">
              <h5 className="text-md font-semibold text-green-700 border-b border-green-200 pb-1 mb-3">Foundation</h5>
              {Object.keys(coursesByType.CMA.Foundation).length === 0 ? (
                <div className="text-gray-500 italic">No CMA Foundation courses found</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(coursesByType.CMA.Foundation).map(([paperId, paper]) => (
                    <div key={`cma-foundation-${paperId}`} className="border-l-4 border-green-500 pl-3 pb-2">
                      <h6 className="text-md font-medium text-gray-800 mb-2">Paper {paperId}: {paper.name}</h6>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paper.courses.map((course, idx) => (
                          <div key={`cma-f-${paperId}-${idx}`} className="bg-white rounded-xl shadow p-3 flex gap-3 items-start border border-green-100">
                            {course.posterUrl && (
                              <img 
                                src={course.posterUrl.startsWith('http') ? course.posterUrl : `${API_URL}${course.posterUrl}`} 
                                alt="Poster" 
                                className="w-16 h-16 object-cover rounded-lg border border-green-200" 
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-bold text-green-700 text-sm">{course.subject}</div>
                              <div className="text-xs text-gray-600">By: {course.facultyName || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Price: ₹{course.sellingPrice || 0}</div>
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => handleEditCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs hover:bg-yellow-200"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* CMA Inter */}
            <div className="mb-6">
              <h5 className="text-md font-semibold text-green-700 border-b border-green-200 pb-1 mb-3">Intermediate</h5>
              {Object.keys(coursesByType.CMA.Inter).length === 0 ? (
                <div className="text-gray-500 italic">No CMA Inter courses found</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(coursesByType.CMA.Inter).map(([paperId, paper]) => (
                    <div key={`cma-inter-${paperId}`} className="border-l-4 border-green-500 pl-3 pb-2">
                      <h6 className="text-md font-medium text-gray-800 mb-2">Paper {paperId}: {paper.name}</h6>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paper.courses.map((course, idx) => (
                          <div key={`cma-i-${paperId}-${idx}`} className="bg-white rounded-xl shadow p-3 flex gap-3 items-start border border-green-100">
                            {course.posterUrl && (
                              <img 
                                src={course.posterUrl.startsWith('http') ? course.posterUrl : `${API_URL}${course.posterUrl}`} 
                                alt="Poster" 
                                className="w-16 h-16 object-cover rounded-lg border border-green-200" 
                              />
                            )}
                            <div className="flex-1">
                              <div className="font-bold text-green-700 text-sm">{course.subject}</div>
                              <div className="text-xs text-gray-600">By: {course.facultyName || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Price: ₹{course.sellingPrice || 0}</div>
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => handleEditCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs hover:bg-yellow-200"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(course.facultySlug, idx)} 
                                  className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Button moved to top of component */}
    </div>
  );
};

export default CoursesByPaperSection;
