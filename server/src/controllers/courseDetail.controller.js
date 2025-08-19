const Faculty = require('../model/Faculty.model');
const mongoose = require('mongoose');

// Get course details by ID - Only for courses under actual faculties
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = null;

    // Look for courses within faculties
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      // Find all faculties - we no longer use "N/A" faculty
      const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
      
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
