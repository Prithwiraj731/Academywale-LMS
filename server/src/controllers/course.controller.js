// Unified course creation: supports both general and faculty courses, including hardcoded faculties/institutes
exports.addCourseToFaculty = async (req, res) => {
  try {
    const {
      category, subcategory, paperId, paperName, subject, facultySlug,
      institute, description, noOfLecture, books, videoLanguage,
      videoRunOn, doubtSolving, supportMail, supportCall, timing,
      courseType, modeAttemptPricing, title
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';

    // If facultySlug is missing or empty, save as general course
    if (!facultySlug || facultySlug.trim() === '') {
      const Course = require('../model/Course.model');
      let parsedModeAttemptPricing = [];
      try {
        parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
      } catch (e) {
        parsedModeAttemptPricing = [];
      }
      const courseData = {
        category,
        subcategory,
        paperId,
        paperName,
        subject,
        title: title || 'New Course',
        facultySlug: '',
        facultyName: '',
        institute,
        description,
        noOfLecture,
        books,
        videoLanguage,
        videoRunOn,
        doubtSolving,
        supportMail,
        supportCall,
        timing,
        courseType,
        modeAttemptPricing: parsedModeAttemptPricing,
        posterUrl,
        isActive: true
      };
      const newCourse = new Course(courseData);
      const savedCourse = await newCourse.save();
      return res.status(201).json({ success: true, message: 'Course added successfully', course: savedCourse });
    }

    // Otherwise, add to faculty (supports hardcoded)
    if (!category || !subcategory || !paperId || !subject) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    let faculty = await Faculty.findOne({ slug: facultySlug });
    if (!faculty) {
      const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === facultySlug);
      if (hardcodedFaculty) {
        faculty = new Faculty({
          firstName: hardcodedFaculty.name.replace(/^(CA|CMA|CS)\s+/, ''),
          lastName: '',
          slug: hardcodedFaculty.slug,
          specialization: hardcodedFaculty.specialization,
          bio: `Expert ${hardcodedFaculty.specialization} faculty with years of professional experience.`,
          courses: []
        });
        await faculty.save();
      } else {
        return res.status(404).json({ error: 'Faculty not found' });
      }
    }

    let parsedModeAttemptPricing = [];
    try {
      parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
    }

    const facultyName = faculty.firstName + (faculty.lastName ? ' ' + faculty.lastName : '');
    const newCourse = {
      facultyName,
      subject,
      noOfLecture,
      books,
      videoLanguage,
      videoRunOn,
      doubtSolving,
      supportMail,
      supportCall,
      posterUrl,
      timing,
      description,
      courseType: courseType || `${category} ${subcategory}`,
      institute,
      category,
      subcategory,
      paperId: parseInt(paperId),
      paperName,
      modeAttemptPricing: parsedModeAttemptPricing,
      costPrice: parsedModeAttemptPricing[0]?.attempts[0]?.costPrice || 0,
      sellingPrice: parsedModeAttemptPricing[0]?.attempts[0]?.sellingPrice || 0,
      mode: parsedModeAttemptPricing[0]?.mode || 'Live Watching',
      modes: parsedModeAttemptPricing.map(m => m.mode),
      durations: parsedModeAttemptPricing.flatMap(m => m.attempts.map(a => a.attempt))
    };
    faculty.courses.push(newCourse);
    await faculty.save();
    res.status(201).json({ success: true, message: 'Course added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const Faculty = require('../model/Faculty.model');
const Institute = require('../model/Institute.model');

// Import hardcoded faculties
const hardcodedFaculties = [
  { id: 1, name: "CA Ranjan Periwal", specialization: "Corporate & Allied Laws", slug: "ca-ranjan-periwal" },
  { id: 2, name: "CA Satish Jalan", specialization: "Advanced Accounting & Audit", slug: "ca-satish-jalan" },
  { id: 3, name: "CA Aaditya Jain", specialization: "Direct Tax & Corporate Law", slug: "ca-aaditya-jain" },
  { id: 4, name: "CA Avinash Lala", specialization: "Audit & Assurance", slug: "ca-avinash-lala" },
  { id: 5, name: "CA Bishnu Kedia", specialization: "Indirect Tax & GST", slug: "ca-bishnu-kedia" },
  { id: 6, name: "CA Nitin Guru", specialization: "Information Technology & Strategic Management", slug: "ca-nitin-guru" },
  { id: 7, name: "CA Shivangi Agarwal", specialization: "Financial Reporting & Analysis", slug: "ca-shivangi-agarwal" },
  { id: 8, name: "CA Siddharth Agarwal", specialization: "Business Valuation & Risk Management", slug: "ca-siddharth-agarwal" },
  { id: 9, name: "CA Yashvant Mangal", specialization: "International Taxation", slug: "ca-yashvant-mangal" },
  { id: 10, name: "CA Amit Mahajan", specialization: "Cost Accounting & Management", slug: "ca-amit-mahajan" },
  { id: 11, name: "CA Avinash Sancheti", specialization: "Strategic Financial Management", slug: "ca-avinash-sancheti" },
  { id: 12, name: "CA Darshan Khare", specialization: "Costing & Operations Management", slug: "ca-darshan-khare" },
  { id: 13, name: "CA Divya Agarwal", specialization: "Business Economics & Commercial Laws", slug: "ca-divya-agarwal" },
  { id: 14, name: "CA Mayank Saraf", specialization: "Advanced Financial Management", slug: "ca-mayank-saraf" },
  { id: 15, name: "CA Parveen Sharma", specialization: "Tax Planning & Corporate Restructuring", slug: "ca-parveen-sharma" },
  { id: 16, name: "CA Raghav Goel", specialization: "Banking & Insurance", slug: "ca-raghav-goel" },
  { id: 17, name: "CA Rishabh Jain", specialization: "Forensic Accounting & Investigation", slug: "ca-rishabh-jain" },
  { id: 18, name: "CA Santosh Kumar", specialization: "Corporate Finance & Treasury", slug: "ca-santosh-kumar" },
  { id: 19, name: "CA Shiris Vyas", specialization: "Financial Services & Capital Markets", slug: "ca-shiris-vyas" },
  { id: 20, name: "CA Shubham Singhal", specialization: "Governance, Risk & Ethics", slug: "ca-shubham-singhal" },
  { id: 21, name: "CA Vijay Sarda", specialization: "Enterprise Performance Management", slug: "ca-vijay-sarda" },
  { id: 22, name: "CA Vishal Bhattad", specialization: "Strategic Cost Management", slug: "ca-vishal-bhattad" },
  { id: 23, name: "CMA Sumit Rastogi", specialization: "Cost & Management Accounting", slug: "cma-sumit-rastogi" },
  { id: 24, name: "CS Arjun Chhabra", specialization: "Company Secretarial Practice", slug: "cs-arjun-chhabra" },
];

// Get all courses by faculty slug (supports both database and hardcoded faculties)
exports.getCoursesByFaculty = async (req, res) => {
  try {
    const { facultySlug } = req.params;
    
    // First, try to find in database
    let faculty = await Faculty.findOne({ slug: facultySlug });
    
    // If not found in database, check hardcoded faculties
    if (!faculty) {
      const hardcodedFaculty = hardcodedFaculties.find(f => f.slug === facultySlug);
      if (hardcodedFaculty) {
        // For hardcoded faculties, we need to create a database entry if courses are added
        // For now, return empty courses array
        return res.status(200).json({ courses: [] });
      }
      return res.status(404).json({ error: 'Faculty not found' });
    }
    
    res.status(200).json({ courses: faculty.courses || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new structured course to faculty (supports both database and hardcoded faculties)

// Get courses by category, subcategory, and paper
exports.getCoursesByPaper = async (req, res) => {
  try {
    const { category, subcategory, paperId } = req.params;
    
    const faculties = await Faculty.find({});
    const institutes = await Institute.find({});
    
    let allCourses = [];
    
    // Get courses from faculties
    faculties.forEach(faculty => {
      (faculty.courses || []).forEach(course => {
        allCourses.push({
          ...course.toObject(),
          facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`
        });
      });
    });
    
    // Get courses from institutes
    institutes.forEach(institute => {
      (institute.courses || []).forEach(course => {
        allCourses.push({
          ...course.toObject(),
          facultyName: ''
        });
      });
    });
    
    // Filter by category, subcategory, and paper
    const filteredCourses = allCourses.filter(course => {
      return course.category === category.toUpperCase() &&
             course.subcategory === subcategory.charAt(0).toUpperCase() + subcategory.slice(1).toLowerCase() &&
             course.paperId === parseInt(paperId);
    });
    
    res.status(200).json({ courses: filteredCourses });
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

exports.addNewCourseToFaculty = exports.addCourseToFaculty;

module.exports = exports;
