const Faculty = require('../model/Faculty.model');
const Institute = require('../model/Institute.model');

// Get all courses by faculty slug
exports.getCoursesByFaculty = async (req, res) => {
  try {
    const { facultySlug } = req.params;
    const faculty = await Faculty.findOne({ slug: facultySlug });
    
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.status(200).json({ courses: faculty.courses || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add course to faculty
exports.addCourseToFaculty = async (req, res) => {
  try {
    const {
      facultySlug, subject, noOfLecture, books, videoLanguage,
      validityStartFrom, videoRunOn, doubtSolving, supportMail,
      supportCall, mode, timing, description, title, costPrice,
      sellingPrice, courseType, institute, modes, durations
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';

    if (!facultySlug) {
      return res.status(400).json({ error: 'Faculty is required' });
    }

    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Parse modes and durations from comma-separated strings
    const modesArray = modes ? modes.split(',').map(m => m.trim()) : [];
    const durationsArray = durations ? durations.split(',').map(d => d.trim()) : [];

    const newCourse = {
      facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
      subject: subject || title,
      noOfLecture,
      books,
      videoLanguage,
      validityStartFrom,
      videoRunOn,
      doubtSolving,
      supportMail,
      supportCall,
      posterUrl,
      mode,
      modes: modesArray,
      timing,
      description,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      courseType,
      institute,
      durations: durationsArray
    };

    faculty.courses.push(newCourse);
    await faculty.save();

    res.status(201).json({ success: true, message: 'Course added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;
    const updateData = req.body;

    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const idx = parseInt(courseIndex);
    if (idx < 0 || idx >= faculty.courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update course with new data
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'posterUrl') {
        faculty.courses[idx][key] = updateData[key];
      }
    });

    // Update poster if provided
    if (req.file) {
      faculty.courses[idx].posterUrl = req.file.path;
    }

    await faculty.save();
    res.status(200).json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;

    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const idx = parseInt(courseIndex);
    if (idx < 0 || idx >= faculty.courses.length) {
      return res.status(404).json({ error: 'Course not found' });
    }

    faculty.courses.splice(idx, 1);
    await faculty.save();

    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get courses by institute
exports.getCoursesByInstitute = async (req, res) => {
  try {
    const { instituteName } = req.params;
    const institute = await Institute.findOne({ name: instituteName });
    
    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }
    
    res.status(200).json({ courses: institute.courses || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
