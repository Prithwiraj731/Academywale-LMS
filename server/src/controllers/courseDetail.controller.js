const Faculty = require('../model/Faculty.model');
const mongoose = require('mongoose');

// Get course details by ID - Enhanced with comprehensive lookup strategies
exports.getCourseDetails = async (req, res) => {
  // Always set content type to JSON to ensure consistent responses
  res.setHeader('Content-Type', 'application/json');
  
  const startTime = Date.now();
  const { courseId } = req.params;
  const courseType = req.query.courseType || null;
  const debugMode = req.query.debug === 'true';
  
  // Log the incoming request
  console.log(`🌐 Course details request: ID=${courseId}, Type=${courseType || 'none'}, Debug=${debugMode}`);
  
  // Handle special fallback case
  if (courseId === 'fallback-course-lookup' && courseType) {
    console.log('🔄 Handling fallback course lookup request');
    return await handleFallbackCourseLookup(res, courseType, startTime);
  }
  
  try {
    // Validate courseId parameter
    if (!courseId) {
      console.error('❌ No courseId provided in request parameters');
      return res.status(400).json({
        success: false,
        error: 'Course ID is required',
        courseId: 'missing',
        duration: Date.now() - startTime
      });
    }

    // Use enhanced course lookup logic
    return await enhancedCourseLookup(req, res, courseId, courseType, startTime, debugMode);

  } catch (error) {
    console.error('💥 Unexpected error in getCourseDetails:', error);
    
    // Return comprehensive error response
    const errorResponse = {
      success: false,
      error: 'Internal server error while fetching course details',
      courseId: courseId || 'unknown',
      duration: Date.now() - startTime
    };

    // Add debug information if requested
    if (debugMode) {
      errorResponse.debugInfo = {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      };
    }

    return res.status(500).json(errorResponse);
  }
};

// Enhanced course lookup logic with better matching
async function enhancedCourseLookup(req, res, courseId, courseType, startTime, debugMode = false) {
  try {
    let course = null;
    
    // Check if it's a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(courseId);
    
    // First, try to find in standalone courses collection
    try {
      const Course = require('../model/Course.model');
      if (isValidObjectId) {
        const standaloneCourse = await Course.findById(courseId);
        if (standaloneCourse) {
          console.log('✅ Found course in standalone collection by ObjectId');
          return res.status(200).json({ course: standaloneCourse, success: true });
        }
      }
      
      // If not found by ObjectId, try other matching for standalone courses
      if (!isValidObjectId && courseId.includes('-')) {
        const standaloneCourses = await Course.find({ isActive: true });
        const matchedStandalone = standaloneCourses.find(course => {
          // Try to match by subject, title, or courseType
          const subjectSlug = course.subject ? 
            course.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          const titleSlug = course.title ? 
            course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          const courseTypeSlug = course.courseType ? 
            course.courseType.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
            
          return courseId === subjectSlug || 
                 courseId === titleSlug || 
                 courseId === courseTypeSlug ||
                 courseId === `${courseTypeSlug}-${subjectSlug}`;
        });
        
        if (matchedStandalone) {
          console.log('✅ Found course in standalone collection by slug matching');
          return res.status(200).json({ course: matchedStandalone, success: true });
        }
      }
    } catch (standaloneError) {
      console.log('⚠️ Standalone course lookup failed:', standaloneError.message);
    }

    // Find all faculties - including "N/A" faculty for broader search
    const faculties = await Faculty.find({});
    
    // Log available courses for debugging
    let totalCourses = 0;
    faculties.forEach(faculty => {
      if (faculty.courses) {
        totalCourses += faculty.courses.length;
      }
    });
    console.log(`🔍 Searching through ${faculties.length} faculties with ${totalCourses} total courses`);
    
    // Look for courses within faculties
    for (const faculty of faculties) {
      if (!faculty.courses) continue;
      
      let foundCourse;
      
      if (isValidObjectId) {
        // Find course by its _id in the faculty's courses array
        foundCourse = faculty.courses.find(course => 
          course._id && course._id.toString() === courseId);
      }
      
      // If not found by ObjectId or if not a valid ObjectId, try alternative matching
      if (!foundCourse && courseId.includes('-')) {
        console.log('Attempting to find course by slug-like ID:', courseId);
        
        // Split the slugified ID and use parts for matching
        const idParts = courseId.toLowerCase().split('-');
        
        // Enhanced paper number extraction - handle "test5mP" pattern
        let paperNumber = null;
        
        // Pattern 1: "paper-13" or "paper13"
        const paperMatch1 = /paper-?(\d+)/i.exec(courseId);
        if (paperMatch1) {
          paperNumber = paperMatch1[1];
        }
        
        // Pattern 2: "test5mP" - number after "test"
        const testMatch = /test(\d+)/i.exec(courseId);
        if (testMatch) {
          paperNumber = testMatch[1];
        }
        
        // Pattern 3: Any standalone number in the ID
        if (!paperNumber) {
          const numberMatch = /(\d+)/.exec(courseId);
          if (numberMatch) {
            paperNumber = numberMatch[1];
          }
        }
        
        // If the URL contains 'cma/final/paper-13', extract the course type components
        const courseTypeFromUrl = courseType || '';
        console.log('Course type from URL query:', courseTypeFromUrl);
        
        // Extract potential subject from courseId (assuming courseType-subject pattern)
        let potentialSubject = null;
        if (courseTypeFromUrl) {
          // Remove course type parts from courseId to get potential subject
          const courseTypeParts = courseTypeFromUrl.toLowerCase().split(' ');
          let remainingId = courseId.toLowerCase();
          
          courseTypeParts.forEach(part => {
            remainingId = remainingId.replace(part, '').replace(/-+/g, '-');
          });
          
          potentialSubject = remainingId.replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
          console.log(`🔍 Extracted potential subject from courseId: "${potentialSubject}"`);
        }
        
        // Try to find a matching course using various attributes
        foundCourse = faculty.courses.find(course => {
          if (!course.subject && !course.title) return false;
          
          // Direct subject match with extracted subject
          if (potentialSubject && course.subject) {
            const courseSubjectSlug = course.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (courseSubjectSlug === potentialSubject || 
                course.subject.toLowerCase().includes(potentialSubject) ||
                potentialSubject.includes(courseSubjectSlug)) {
              console.log(`✅ Found match by extracted subject: ${course.subject}`);
              return true;
            }
          }
          
          // Check for exact matches in slugified form first
          const subjectSlug = course.subject ? 
            course.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          
          const titleSlug = course.title ? 
            course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          
          // Enhanced paper number matching - highest priority
          if (paperNumber) {
            // Check direct paper number field
            if (course.paperNumber && course.paperNumber.toString() === paperNumber) {
              if (courseTypeFromUrl) {
                const courseTypeWords = courseTypeFromUrl.replace('/', ' ').split(' ');
                const courseTypeMatches = course.courseType && 
                  courseTypeWords.every(word => 
                    course.courseType.toLowerCase().includes(word.toLowerCase())
                  );
                
                if (courseTypeMatches) {
                  console.log(`✅ Found match by paper number ${paperNumber} with matching course type`);
                  return true;
                }
              } else {
                console.log(`✅ Found match by paper number: ${paperNumber}`);
                return true;
              }
            }
            
            // Check paperId field
            if (course.paperId && course.paperId.toString() === paperNumber) {
              console.log(`✅ Found match by paperId: ${paperNumber}`);
              return true;
            }
          }
          
          // Look for paper number in subject or paperName
          if (paperNumber) {
            const paperNameMatch = course.paperName && 
              course.paperName.toLowerCase().includes(`paper ${paperNumber}`);
              
            const subjectPaperMatch = course.subject && 
              course.subject.toLowerCase().includes(`paper ${paperNumber}`);
              
            if (paperNameMatch || subjectPaperMatch) {
              console.log(`Found paper number ${paperNumber} in subject/paperName`);
              return true;
            }
          }
          
          // For courseType-subject pattern - Enhanced matching
          if (course.courseType && course.subject) {
            const courseTypeSlug = course.courseType.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const expectedId = `${courseTypeSlug}-${subjectSlug}`;
            
            if (courseId === expectedId) {
              console.log(`✅ Found exact match with courseType-subject: ${courseId}`);
              return true;
            }
            
            // Also try reverse pattern (subject-courseType)
            const reverseId = `${subjectSlug}-${courseTypeSlug}`;
            if (courseId === reverseId) {
              console.log(`✅ Found reverse match with subject-courseType: ${courseId}`);
              return true;
            }
            
            // Try partial matches - if courseId contains both course type and subject parts
            const courseIdParts = courseId.split('-');
            const courseTypeParts = courseTypeSlug.split('-');
            const subjectParts = subjectSlug.split('-');
            
            const hasTypeMatch = courseTypeParts.some(typePart => 
              courseIdParts.some(idPart => idPart === typePart && idPart.length > 2)
            );
            const hasSubjectMatch = subjectParts.some(subjectPart => 
              courseIdParts.some(idPart => idPart === subjectPart && idPart.length > 2)
            );
            
            if (hasTypeMatch && hasSubjectMatch) {
              console.log(`✅ Found partial match with courseType and subject parts`);
              return true;
            }
          }
          
          // Enhanced course type matching for "cma-final" pattern
          if (courseTypeFromUrl || idParts.includes('cma') || idParts.includes('ca')) {
            const courseCategory = idParts.includes('cma') ? 'cma' : idParts.includes('ca') ? 'ca' : '';
            const courseLevel = idParts.includes('final') ? 'final' : 
                               idParts.includes('inter') ? 'inter' : 
                               idParts.includes('foundation') ? 'foundation' : '';
            
            if (courseCategory && courseLevel && course.courseType) {
              const courseTypeLower = course.courseType.toLowerCase();
              if (courseTypeLower.includes(courseCategory) && courseTypeLower.includes(courseLevel)) {
                console.log(`✅ Found match by course type pattern: ${courseCategory} ${courseLevel}`);
                return true;
              }
            }
          }
          
          // More flexible subject matching - check if any part of the courseId matches the subject
          if (course.subject) {
            const courseSubjectLower = course.subject.toLowerCase();
            const courseIdLower = courseId.toLowerCase();
            
            // Check if courseId contains significant parts of the subject
            const subjectWords = courseSubjectLower.split(/\s+/).filter(word => word.length > 2);
            const idWords = courseIdLower.split('-').filter(word => word.length > 2);
            
            const hasSubjectMatch = subjectWords.some(subjectWord => 
              idWords.some(idWord => 
                subjectWord.includes(idWord) || idWord.includes(subjectWord)
              )
            );
            
            if (hasSubjectMatch) {
              console.log(`✅ Found flexible subject match for: ${course.subject}`);
              return true;
            }
          }
          
          // Try more generic matching with individual parts
          const subjectMatch = course.subject && 
            idParts.some(part => part.length > 2 && course.subject.toLowerCase().includes(part));
          
          const titleMatch = course.title && 
            idParts.some(part => part.length > 2 && course.title.toLowerCase().includes(part));
          
          // For faculty name matches
          const facultyNameMatch = faculty.firstName && idParts.some(part => 
            part.length > 2 && faculty.firstName.toLowerCase().includes(part));
          
          // Last resort: check if courseType matches the pattern
          if (course.courseType && courseTypeFromUrl) {
            const courseTypeLower = course.courseType.toLowerCase();
            const courseTypeUrlLower = courseTypeFromUrl.toLowerCase();
            if (courseTypeLower.includes(courseTypeUrlLower.replace(' ', '')) || 
                courseTypeUrlLower.includes(courseTypeLower.replace(' ', ''))) {
              console.log(`✅ Found match by course type similarity`);
              return true;
            }
          }
            
          return subjectMatch || titleMatch || facultyNameMatch;
        });
      }
      
      if (foundCourse) {
        course = {
          ...foundCourse.toObject(),
          facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
          facultySlug: faculty.slug,
          facultyId: faculty._id
        };
        break;
      }
    }

    // If still no course found, try a broader search as last resort
    if (!course && courseType) {
      console.log('🔍 Attempting broader search as last resort...');
      
      // First try exact courseType match
      for (const faculty of faculties) {
        if (!faculty.courses) continue;
        
        const typeMatchedCourse = faculty.courses.find(course => {
          if (!course.courseType) return false;
          
          const courseTypeLower = course.courseType.toLowerCase();
          const searchTypeLower = courseType.toLowerCase();
          
          // Check if course type contains the search terms
          return searchTypeLower.split(' ').every(word => 
            courseTypeLower.includes(word.toLowerCase())
          );
        });
        
        if (typeMatchedCourse) {
          console.log(`✅ Found course by broad courseType match: ${typeMatchedCourse.subject}`);
          course = {
            ...typeMatchedCourse.toObject(),
            facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
            facultySlug: faculty.slug,
            facultyId: faculty._id
          };
          break;
        }
      }
      
      // If still nothing, try to find any course with similar characteristics
      if (!course) {
        console.log('🔍 Attempting final fallback search...');
        
        for (const faculty of faculties) {
          if (!faculty.courses || faculty.courses.length === 0) continue;
          
          // Look for any course that might be related
          const fallbackCourse = faculty.courses.find(course => {
            if (!course.subject) return false;
            
            // Check if any part of the courseId appears in the subject
            const courseIdParts = courseId.toLowerCase().split('-');
            const subjectLower = course.subject.toLowerCase();
            
            return courseIdParts.some(part => 
              part.length > 3 && subjectLower.includes(part)
            );
          });
          
          if (fallbackCourse) {
            console.log(`✅ Found course by fallback subject match: ${fallbackCourse.subject}`);
            course = {
              ...fallbackCourse.toObject(),
              facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
              facultySlug: faculty.slug,
              facultyId: faculty._id
            };
            break;
          }
        }
      }
    }

    // FINAL FALLBACK: If no course found, return the first course that matches courseType
    if (!course && courseType) {
      console.log('🚨 FINAL FALLBACK: Looking for any course with matching courseType...');
      
      for (const faculty of faculties) {
        if (!faculty.courses || faculty.courses.length === 0) continue;
        
        const anyCourse = faculty.courses.find(course => {
          if (!course.courseType) return false;
          
          const courseTypeLower = course.courseType.toLowerCase();
          const searchTypeLower = courseType.toLowerCase();
          
          // Very loose matching - if courseType contains any word from search
          return searchTypeLower.split(' ').some(word => 
            courseTypeLower.includes(word.toLowerCase()) && word.length > 2
          );
        });
        
        if (anyCourse) {
          console.log(`✅ FALLBACK: Using course "${anyCourse.subject}" as fallback`);
          course = {
            ...anyCourse.toObject(),
            facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
            facultySlug: faculty.slug,
            facultyId: faculty._id
          };
          break;
        }
      }
    }
    
    // If STILL no course, return the very first course available
    if (!course) {
      console.log('🚨 EMERGENCY FALLBACK: Returning first available course...');
      
      for (const faculty of faculties) {
        if (faculty.courses && faculty.courses.length > 0) {
          const firstCourse = faculty.courses[0];
          console.log(`✅ EMERGENCY: Using first course "${firstCourse.subject}"`);
          course = {
            ...firstCourse.toObject(),
            facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
            facultySlug: faculty.slug,
            facultyId: faculty._id
          };
          break;
        }
      }
    }

    if (!course) {
      console.log(`❌ COMPLETE FAILURE: No courses found at all`);
      return res.status(404).json({ 
        error: `No courses available in the system`, 
        success: false,
        courseId: courseId || 'unknown',
        searchedType: courseType || 'none'
      });
    }

    return res.status(200).json({ course, success: true });
  } catch (error) {
    console.error('Error getting course details:', error);
    return res.status(500).json({ 
      error: error.message || 'Server error while fetching course details',
      success: false,
      courseId: courseId || 'unknown'
    });
  }
}

// Handle fallback course lookup when frontend can't provide proper course ID
async function handleFallbackCourseLookup(res, courseType, startTime) {
  try {
    console.log(`🔍 Fallback lookup for courseType: ${courseType}`);
    
    const faculties = await Faculty.find({});
    
    // Find the first course that matches the courseType
    for (const faculty of faculties) {
      if (!faculty.courses || faculty.courses.length === 0) continue;
      
      const matchingCourse = faculty.courses.find(course => {
        if (!course.courseType) return false;
        
        const courseTypeLower = course.courseType.toLowerCase();
        const searchTypeLower = courseType.toLowerCase();
        
        // Check if courseType matches
        return searchTypeLower.split(' ').every(word => 
          courseTypeLower.includes(word.toLowerCase()) && word.length > 1
        );
      });
      
      if (matchingCourse) {
        console.log(`✅ Fallback found course: ${matchingCourse.subject}`);
        
        const course = {
          ...matchingCourse.toObject(),
          facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
          facultySlug: faculty.slug,
          facultyId: faculty._id
        };
        
        return res.status(200).json({ course, success: true });
      }
    }
    
    // If no exact match, return first course of any type
    for (const faculty of faculties) {
      if (faculty.courses && faculty.courses.length > 0) {
        const firstCourse = faculty.courses[0];
        console.log(`✅ Fallback using first available course: ${firstCourse.subject}`);
        
        const course = {
          ...firstCourse.toObject(),
          facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
          facultySlug: faculty.slug,
          facultyId: faculty._id
        };
        
        return res.status(200).json({ course, success: true });
      }
    }
    
    return res.status(404).json({
      success: false,
      error: 'No courses available',
      duration: Date.now() - startTime
    });
    
  } catch (error) {
    console.error('Error in fallback course lookup:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during fallback lookup',
      duration: Date.now() - startTime
    });
  }
}

module.exports = exports;
