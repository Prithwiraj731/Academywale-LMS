const Faculty = require('../model/Faculty.model');
const Course = require('../model/Course.model');
const mongoose = require('mongoose');

// Get course details by ID - supports standalone and faculty courses
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = null;
    let isStandaloneCourse = false;

    // First try to find it as a standalone course
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      course = await Course.findById(courseId);
      if (course) {
        isStandaloneCourse = true;
      }
    }

    // If not found as standalone, search in faculty courses
    if (!course) {
      // Try to find the course in all faculties
      const faculties = await Faculty.find({});
      
      // Loop through all faculties and their courses
      for (const faculty of faculties) {
        if (!faculty.courses) continue;
        
        // Find course by its _id in the faculty's courses array
        const foundCourse = faculty.courses.find(course => 
          course._id && course._id.toString() === courseId);
        
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
    } else {
      // Format standalone course
      course = {
        ...course.toObject(),
        facultyName: 'N/A',
        isStandalone: true
      };
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
