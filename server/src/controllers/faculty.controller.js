const Faculty = require('../model/Faculty.model');
const path = require('path');
const Institute = require('../model/Institute.model');

// Helper to generate slug from full name
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Add a new course to a faculty (by slug) with file upload
exports.addCourse = async (req, res) => {
  try {
    const {
      facultySlug, // This comes from the form
      subject,
      noOfLecture,
      books,
      videoLanguage,
      validityStartFrom,
      videoRunOn,
      doubtSolving,
      supportMail,
      supportCall,
      mode,
      timing,
      description,
      costPrice,
      sellingPrice,
      modes,
      durations,
      courseType,
      courseLevel,
      institute // NEW: from form
    } = req.body;

    if ((!facultySlug || !facultySlug.trim()) && (!institute || !institute.trim())) {
      return res.status(400).json({ error: 'Either Faculty slug or Institute is required.' });
    }

    // Validate institute exists if provided
    let inst = null;
    if (institute && institute.trim()) {
      inst = await Institute.findOne({ name: institute });
      if (!inst) {
        return res.status(400).json({ error: 'Selected institute does not exist.' });
      }
    }

    let faculty = null;
    if (facultySlug && facultySlug.trim()) {
      faculty = await Faculty.findOne({ slug: facultySlug });
      if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found.' });
      }
      // Backend validation for facultyName
      if (!faculty.firstName || !faculty.firstName.trim()) {
        return res.status(400).json({ error: 'Faculty Name is required.' });
      }
      const firstName = faculty.firstName.split(' ')[0].toUpperCase();
      if (!firstName) {
        return res.status(400).json({ error: 'Faculty Name must include at least one word.' });
      }
    }

    // Validate costPrice and sellingPrice
    if (costPrice === undefined || costPrice === null || costPrice === '' || isNaN(Number(costPrice))) {
      return res.status(400).json({ error: 'Cost Price is required and must be a number.' });
    }
    if (sellingPrice === undefined || sellingPrice === null || sellingPrice === '' || isNaN(Number(sellingPrice))) {
      return res.status(400).json({ error: 'Selling Price is required and must be a number.' });
    }

    // Validate courseType
    const allowedCourseTypes = [
      'CA Foundation', 'CMA Foundation',
      'CA Inter', 'CMA Inter',
      'CA Final', 'CMA Final'
    ];
    if (!courseType || !allowedCourseTypes.includes(courseType)) {
      return res.status(400).json({ error: 'Course Type must be one of: ' + allowedCourseTypes.join(', ') });
    }

    let posterUrl = '';
    if (req.file) {
      // Save the relative path to the uploaded file
      posterUrl = `/uploads/${req.file.filename}`;
    }

    let parsedModes = [];
    let parsedDurations = [];
    if (modes) {
      parsedModes = modes.split(',').map(m => m.trim()).filter(m => m.length > 0);
    }
    if (durations) {
      parsedDurations = durations.split(',').map(d => d.trim()).filter(d => d.length > 0);
    }

    // Create course object with all required and optional fields
    const courseData = {
      facultyName: faculty ? (faculty.firstName + (faculty.lastName ? ' ' + faculty.lastName : '')) : '',
      subject: subject,
      noOfLecture: noOfLecture,
      duration: 'Not specified', // Default value since it's not in the form
      books: books || '',
      videoLanguage: videoLanguage || 'Hindi',
      validityStartFrom: validityStartFrom || 'Lifetime',
      videoRunOn: videoRunOn || 'All devices',
      doubtSolving: doubtSolving || 'Email support',
      supportMail: supportMail || 'support@academywale.com',
      supportCall: supportCall || '8910416751',
      posterUrl: posterUrl,
      mode: mode || 'Recorded Videos',
      timing: timing || 'Flexible',
      description: description || '',
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      modes: parsedModes,
      durations: parsedDurations,
      courseType: courseType,
      institute: institute || '' // Save the institute name or empty string
    };

    if (faculty) {
      faculty.courses.push(courseData);
      await faculty.save();
      res.status(201).json({ message: 'Course added to faculty', faculty });
    } else if (inst) {
      // If no faculty, add course to institute's courses array (assuming Institute model has courses array)
      if (!inst.courses) {
        inst.courses = [];
      }
      inst.courses.push(courseData);
      await inst.save();
      res.status(201).json({ message: 'Course added to institute', institute: inst });
    } else {
      res.status(400).json({ error: 'Invalid request: no faculty or institute found.' });
    }
  } catch (err) {
    console.error('Error adding course:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all courses for a faculty (by slug)
exports.getCourses = async (req, res) => {
  try {
    const { slug } = req.params;
    const { institute } = req.query;
    const faculty = await Faculty.findOne({ slug });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    let courses = faculty.courses;
    if (institute) {
      courses = courses.filter(c => c.institute === institute);
    }
    res.json({ courses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// (Optional) Create a new faculty
exports.createFaculty = async (req, res) => {
  try {
    const { firstName, lastName, bio, teaches } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      imageUrl = '/logo.svg'; // Default image if not uploaded
    }
    const fullName = (firstName + (lastName ? ' ' + lastName : '')).trim();
    const slug = generateSlug(fullName);
    const faculty = new Faculty({
      firstName: firstName,
      lastName,
      bio,
      teaches: teaches ? JSON.parse(teaches) : [],
      imageUrl,
      slug
    });
    await faculty.save();
    res.status(201).json({ message: 'Faculty created', faculty });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'A faculty with this name or slug already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
}; 

// Add or update faculty bio and teaches (by slug)
exports.updateFacultyInfo = async (req, res) => {
  try {
    const { slug, bio, teaches } = req.body;
    if (!slug) return res.status(400).json({ error: 'Faculty slug is required.' });
    const faculty = await Faculty.findOne({ slug });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found.' });
    if (bio !== undefined) faculty.bio = bio;
    if (teaches !== undefined) faculty.teaches = teaches;
    // Do NOT overwrite imageUrl here
    await faculty.save();
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get faculty bio and teaches (by slug)
exports.getFacultyInfo = async (req, res) => {
  try {
    const { slug } = req.params;
    const faculty = await Faculty.findOne({ slug });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found.' });
    res.json({
      bio: faculty.bio,
      teaches: faculty.teaches,
      firstName: faculty.firstName,
      lastName: faculty.lastName,
      imageUrl: faculty.imageUrl,
      slug: faculty.slug
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

exports.getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.json({ faculties });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

// Delete all faculties (admin only)
exports.deleteAllFaculties = async (req, res) => {
  try {
    await Faculty.deleteMany({});
    res.json({ success: true, message: 'All faculties deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

// Add a new institute (admin, with image upload)
exports.addInstitute = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: 'Institute image is required.' });
    }
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Institute name is required.' });
    }
    const institute = new Institute({ name: name.trim(), imageUrl });
    await institute.save();
    res.status(201).json({ message: 'Institute added', institute });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'An institute with this name already exists.' });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all institutes
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.json({ institutes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 

// Update a course for a faculty
exports.updateCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;
    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    const idx = parseInt(courseIndex, 10);
    if (!faculty.courses[idx]) return res.status(404).json({ error: 'Course not found' });
    // Update fields
    const fields = [
      'subject', 'noOfLecture', 'books', 'videoLanguage', 'validityStartFrom', 'videoRunOn', 'doubtSolving', 'supportMail', 'supportCall', 'mode', 'timing', 'description', 'costPrice', 'sellingPrice', 'courseType', 'modes', 'durations'
    ];
    fields.forEach(f => {
      if (req.body[f] !== undefined) faculty.courses[idx][f] = req.body[f];
    });
    if (req.file) faculty.courses[idx].posterUrl = `/uploads/${req.file.filename}`;
    await faculty.save();
    res.json({ success: true, course: faculty.courses[idx] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a course for a faculty
exports.deleteCourse = async (req, res) => {
  try {
    const { facultySlug, courseIndex } = req.params;
    const faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    const idx = parseInt(courseIndex, 10);
    if (!faculty.courses[idx]) return res.status(404).json({ error: 'Course not found' });
    faculty.courses.splice(idx, 1);
    await faculty.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { slug } = req.params;
    const faculty = await Faculty.findOne({ slug });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    const fields = ['firstName', 'lastName', 'bio', 'teaches'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) faculty[f] = req.body[f];
    });
    if (req.file) faculty.imageUrl = `/uploads/${req.file.filename}`;
    await faculty.save();
    res.json({ success: true, faculty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { slug } = req.params;
    const faculty = await Faculty.findOneAndDelete({ slug });
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an institute
exports.updateInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await Institute.findById(id);
    if (!institute) return res.status(404).json({ error: 'Institute not found' });
    if (req.body.name) institute.name = req.body.name;
    if (req.file) institute.imageUrl = `/uploads/${req.file.filename}`;
    await institute.save();
    res.json({ success: true, institute });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an institute
exports.deleteInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const institute = await Institute.findByIdAndDelete(id);
    if (!institute) return res.status(404).json({ error: 'Institute not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 