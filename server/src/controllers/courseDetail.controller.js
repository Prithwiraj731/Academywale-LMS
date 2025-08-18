const Faculty = require('../model/Faculty.model');
const Course = require('../model/Course.model');
const mongoose = require('mongoose');

// Get course details by ID - Unified logic for all courses, using "N/A" faculty for standalone courses
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = null;

    // First look in faculty courses since we're moving towards unified approach
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      // Find all faculties, including the special "N/A" faculty
      const faculties = await Faculty.find({});
      
      // Loop through all faculties and their courses
      for (const faculty of faculties) {
        if (!faculty.courses) continue;
        
        // Find course by its _id in the faculty's courses array
        const foundCourse = faculty.courses.find(course => 
          course._id && course._id.toString() === courseId);
        
        if (foundCourse) {
          // Check if this is the "N/A" faculty
          const isNAFaculty = faculty.firstName === 'N/A' || faculty.lastName === 'N/A';
          
          course = {
            ...foundCourse.toObject(),
            facultyName: isNAFaculty ? 'N/A' : `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
            facultySlug: faculty.slug,
            facultyId: faculty._id
          };
          break;
        }
      }
    }
    
    // As a fallback, look for standalone course (legacy support)
    if (!course && mongoose.Types.ObjectId.isValid(courseId)) {
      const standaloneCourse = await Course.findById(courseId);
      if (standaloneCourse) {
        course = {
          ...standaloneCourse.toObject(),
          facultyName: 'N/A',
          // Keep legacy flag for backward compatibility
          isStandalone: true
        };
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
