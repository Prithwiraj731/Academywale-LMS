const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// Import Cloudinary configuration 
const { cloudinary, storage: cloudinaryFacultyStorage } = require('./src/config/cloudinary.config');

// Multer configuration for course uploads
const courseStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'academy-wale/courses',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 800, height: 600, crop: 'limit', quality: 'auto' }]
  }
});

const courseUpload = multer({ storage: courseStorage });

// Middleware
app.use(cors({
  origin: ['https://academywale.com', 'https://www.academywale.com', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/?retryWrites=true&w=majority&appName=courses';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
  }
};

// Define Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: String,
  category: String,
  subcategory: String,
  paperId: String,
  paperName: String,
  courseType: String,
  noOfLecture: String,
  books: String,
  videoLanguage: String,
  videoRunOn: String,
  timing: String,
  doubtSolving: String,
  supportMail: String,
  supportCall: String,
  validityStartFrom: String,
  facultySlug: String,
  facultyName: String,
  institute: String,
  posterUrl: String,
  posterPublicId: String,
  modeAttemptPricing: [{ type: mongoose.Schema.Types.Mixed }],
  costPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  isStandalone: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const facultySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: String,
  slug: { type: String, required: true, unique: true },
  email: String,
  phone: String,
  specialization: String,
  experience: String,
  qualification: String,
  about: String,
  profileImage: String,
  courses: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  logo: String
}, { timestamps: true });

// Create Models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Faculty = mongoose.model('Faculty', facultySchema);
const Institute = mongoose.model('Institute', instituteSchema);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Auth test
app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth endpoint working', timestamp: new Date().toISOString() });
});

// IMMEDIATE FIX: WORKING COURSE CREATION ENDPOINT
app.post('/api/admin/courses/standalone', courseUpload.single('poster'), async (req, res) => {
  try {
    console.log('🎯 Course creation request received');
    console.log('📋 Request body:', req.body);
    console.log('📎 File:', req.file);

    const {
      title, subject, description, category, subcategory, paperId, paperName,
      courseType, noOfLecture, books, videoLanguage, videoRunOn, timing,
      doubtSolving, supportMail, supportCall, validityStartFrom,
      facultySlug, facultyName, institute, modeAttemptPricing,
      costPrice, sellingPrice, isStandalone
    } = req.body;

    const posterUrl = req.file ? req.file.path : '';
    const posterPublicId = req.file ? req.file.filename : '';

    // Determine if it's standalone based on the isStandalone field
    const courseIsStandalone = isStandalone === 'true' || isStandalone === true;

    console.log('🔍 Course type determination:', { isStandalone, courseIsStandalone, facultySlug });

    if (!subject) {
      console.log('❌ Validation failed: Subject required');
      return res.status(400).json({ error: 'Subject is required' });
    }

    if (courseIsStandalone && !title) {
      console.log('❌ Validation failed: Title required for standalone');
      return res.status(400).json({ error: 'Title is required for standalone courses' });
    }

    // Parse mode and attempt pricing if provided
    let parsedModeAttemptPricing = [];
    if (modeAttemptPricing) {
      try {
        parsedModeAttemptPricing = JSON.parse(modeAttemptPricing);
        console.log('✅ Parsed pricing:', parsedModeAttemptPricing);
      } catch (e) {
        console.log('❌ Failed to parse pricing:', e.message);
        return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
      }
    }

    if (courseIsStandalone) {
      console.log('🎓 Creating standalone course');
      // Create standalone course
      const newCourse = new Course({
        title,
        subject,
        description: description || '',
        category: category || '',
        subcategory: subcategory || '',
        paperId: paperId || '',
        paperName: paperName || '',
        courseType: courseType || 'General Course',
        noOfLecture: noOfLecture || '',
        books: books || '',
        videoLanguage: videoLanguage || 'Hindi',
        videoRunOn: videoRunOn || '',
        timing: timing || '',
        doubtSolving: doubtSolving || '',
        supportMail: supportMail || '',
        supportCall: supportCall || '',
        validityStartFrom: validityStartFrom || '',
        facultySlug: facultySlug || '',
        facultyName: facultyName || '',
        institute: institute || '',
        posterUrl,
        posterPublicId,
        modeAttemptPricing: parsedModeAttemptPricing,
        costPrice: costPrice ? Number(costPrice) : 0,
        sellingPrice: sellingPrice ? Number(sellingPrice) : 0,
        isStandalone: true,
        isActive: true
      });

      const savedCourse = await newCourse.save();
      console.log('✅ Standalone course saved:', savedCourse._id);
      
      res.status(201).json({ 
        success: true, 
        message: 'Standalone course created successfully',
        course: savedCourse 
      });
    } else {
      console.log('👨‍🏫 Creating faculty-based course');
      // Create faculty-based course
      if (!facultySlug) {
        console.log('❌ Faculty slug required for faculty course');
        return res.status(400).json({ error: 'Faculty slug is required for faculty-based courses' });
      }

      let faculty = await Faculty.findOne({ slug: facultySlug });
      if (!faculty) {
        console.log('❌ Faculty not found:', facultySlug);
        return res.status(404).json({ error: 'Faculty not found' });
      }

      const courseData = {
        title: title || paperName || subject,
        subject,
        description: description || '',
        category: category || '',
        subcategory: subcategory || '',
        paperId: paperId || '',
        paperName: paperName || '',
        courseType: courseType || 'General Course',
        noOfLecture: noOfLecture || '',
        books: books || '',
        videoLanguage: videoLanguage || 'Hindi',
        videoRunOn: videoRunOn || '',
        timing: timing || '',
        doubtSolving: doubtSolving || '',
        supportMail: supportMail || '',
        supportCall: supportCall || '',
        validityStartFrom: validityStartFrom || '',
        facultySlug: facultySlug,
        facultyName: facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
        institute: institute || '',
        posterUrl,
        posterPublicId,
        modeAttemptPricing: parsedModeAttemptPricing,
        costPrice: costPrice ? Number(costPrice) : 0,
        sellingPrice: sellingPrice ? Number(sellingPrice) : 0
      };

      faculty.courses.push(courseData);
      await faculty.save();
      console.log('✅ Faculty course saved to faculty:', faculty.slug);
      
      res.status(201).json({ 
        success: true, 
        message: 'Faculty-based course created successfully',
        course: courseData,
        faculty: faculty.slug
      });
    }
  } catch (error) {
    console.error('❌ Course creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all courses (both standalone and faculty-based)
app.get('/api/courses/all', async (req, res) => {
  try {
    console.log('📊 Fetching all courses');
    
    // Get standalone courses
    const standaloneCourses = await Course.find({ 
      isStandalone: true,
      isActive: true 
    }).sort({ createdAt: -1 });

    // Get faculty-based courses
    const faculties = await Faculty.find({}).populate('courses');
    const facultyCourses = [];
    
    faculties.forEach(faculty => {
      if (faculty.courses && faculty.courses.length > 0) {
        faculty.courses.forEach(course => {
          facultyCourses.push({
            ...course.toObject(),
            facultySlug: faculty.slug,
            facultyName: course.facultyName || `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
            isStandalone: false
          });
        });
      }
    });

    const allCourses = [...standaloneCourses, ...facultyCourses];
    console.log(`✅ Found ${allCourses.length} total courses (${standaloneCourses.length} standalone, ${facultyCourses.length} faculty)`);
    
    res.status(200).json({ courses: allCourses });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get faculties
app.get('/api/admin/faculties', async (req, res) => {
  try {
    const faculties = await Faculty.find({}).sort({ firstName: 1 });
    res.status(200).json({ faculties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get institutes
app.get('/api/admin/institutes', async (req, res) => {
  try {
    const institutes = await Institute.find({}).sort({ name: 1 });
    res.status(200).json({ institutes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log(`🎓 Course creation: http://localhost:${PORT}/api/admin/courses/standalone`);
    console.log(`📊 All courses: http://localhost:${PORT}/api/courses/all`);
  });
}).catch((err) => {
  console.error('Failed to start:', err);
});

module.exports = app;
