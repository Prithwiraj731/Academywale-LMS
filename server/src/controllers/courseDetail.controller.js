const Faculty = require('../model/Faculty.model');
const mongoose = require('mongoose');

// Get course details by ID - Only for courses under actual faculties
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
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
        
        // Check if this might be a paper number reference
        const paperNumberMatch = /paper-(\d+)/.exec(courseId);
        const paperNumber = paperNumberMatch ? paperNumberMatch[1] : null;
        
        // Try to find a matching course using various attributes
        foundCourse = faculty.courses.find(course => {
          if (!course.subject && !course.title) return false;
          
          // Check for exact matches in slugified form first
          const subjectSlug = course.subject ? 
            course.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          
          const titleSlug = course.title ? 
            course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          
          // For paperNumber matches
          if (paperNumber && course.paperNumber && course.paperNumber.toString() === paperNumber) {
            console.log(`Found match by paper number: ${paperNumber}`);
            return true;
          }
          
          // For courseType-subject pattern
          if (course.courseType) {
            const courseTypeSlug = course.courseType.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (courseId === `${courseTypeSlug}-${subjectSlug}`) {
              console.log(`Found exact match with courseType-subject: ${courseId}`);
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
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error('Error getting course details:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
