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

    // Find all faculties - we no longer use "N/A" faculty
    const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
    
    // Check if it's a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(courseId);
    
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
        
        // Try to find a matching course using various attributes
        foundCourse = faculty.courses.find(course => {
          if (!course.subject && !course.title) return false;
          
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
          
          // For courseType-subject pattern
          if (course.courseType) {
            const courseTypeSlug = course.courseType.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (courseId === `${courseTypeSlug}-${subjectSlug}`) {
              console.log(`Found exact match with courseType-subject: ${courseId}`);
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
          
          // Try more generic matching with individual parts
          const subjectMatch = course.subject && 
            idParts.some(part => part.length > 2 && course.subject.toLowerCase().includes(part));
          
          const titleMatch = course.title && 
            idParts.some(part => part.length > 2 && course.title.toLowerCase().includes(part));
          
          // For faculty name matches
          const facultyNameMatch = faculty.firstName && idParts.some(part => 
            part.length > 2 && faculty.firstName.toLowerCase().includes(part));
            
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

    if (!course) {
      return res.status(404).json({ 
        error: 'Course not found', 
        success: false,
        courseId: courseId || 'unknown'
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

module.exports = exports;
