const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const app = express();

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dms3kqzb1',
  api_key: '959547171781827',
  api_secret: 'fMdWN8ZEh4vwMCj5wIx8pnz9Rdo'
});

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

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String }, // mobile is now optional
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

// Import and setup Course model for standalone courses
const Course = require('./src/model/Course.model');
const Faculty = require('./src/model/Faculty.model');
const Institute = require('./src/model/Institute.model');

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AcademyWale Backend Running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/auth/test', (req, res) => {
  res.json({ message: 'Auth routes working' });
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    
    if (!name || !email || !password) { // mobile is no longer required
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists'
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      mobile // will be undefined if not provided
    });

    const token = jwt.sign({ id: newUser._id }, 'your-secret-key', { expiresIn: '90d' });
    
    res.status(201).json({
      status: 'success',
      token,
      data: { user: { name: newUser.name, email: newUser.email, role: newUser.role } }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password required'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign({ id: user._id }, 'your-secret-key', { expiresIn: '90d' });
    
    res.status(200).json({
      status: 'success',
      token,
      data: { user: { name: user.name, email: user.email, role: user.role } }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Logged out' });
});

app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, 'your-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { user: { name: user.name, email: user.email, role: user.role } }
    });
    
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token'
    });
  }
});

// ==================== COURSE CREATION - IMMEDIATE FIX ====================

// WORKING COURSE CREATION ENDPOINT
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
    const faculties = await Faculty.find({});
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

// ==================== INSTITUTES ROUTES ====================

// Get all institutes
app.get('/api/institutes', async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json({ institutes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk insert institutes with images (for initial setup)
app.post('/api/admin/institutes/bulk-insert', async (req, res) => {
  try {
    const institutesData = [
      {
        name: "Aaditya Jain Classes",
        imageUrl: "/institutes/aaditya_jain_classes.png",
        image: "aaditya_jain_classes",
        public_id: "aaditya_jain_classes"
      },
      {
        name: "Arjun Chhabra Tutorial", 
        imageUrl: "/institutes/arjun_chhabra_tutorial.png",
        image: "arjun_chhabra_tutorial",
        public_id: "arjun_chhabra_tutorial"
      },
      {
        name: "Avinash Lala Classes",
        imageUrl: "/institutes/avinash_lala_classes.jpg", 
        image: "avinash_lala_classes",
        public_id: "avinash_lala_classes"
      },
      {
        name: "BB Virtuals",
        imageUrl: "/institutes/bb_virtuals.png",
        image: "bb_virtuals", 
        public_id: "bb_virtuals"
      },
      {
        name: "Bishnu Kedia Classes",
        imageUrl: "/institutes/bishnu_kedia_classes.png",
        image: "bishnu_kedia_classes",
        public_id: "bishnu_kedia_classes"
      },
      {
        name: "CA Buddy",
        imageUrl: "/institutes/ca_buddy.png",
        image: "ca_buddy",
        public_id: "ca_buddy"
      },
      {
        name: "CA Praveen Jindal",
        imageUrl: "/institutes/ca_praveen_jindal.png", 
        image: "ca_praveen_jindal",
        public_id: "ca_praveen_jindal"
      },
      {
        name: "COC Education",
        imageUrl: "/institutes/coc_education.png",
        image: "coc_education",
        public_id: "coc_education"
      },
      {
        name: "Ekatvam",
        imageUrl: "/institutes/ekatvam.png",
        image: "ekatvam",
        public_id: "ekatvam"
      },
      {
        name: "Gopal Bhoot Classes",
        imageUrl: "/institutes/gopal_bhoot_classes.gif",
        image: "gopal_bhoot_classes",
        public_id: "gopal_bhoot_classes"
      },
      {
        name: "Harshad Jaju Classes",
        imageUrl: "/institutes/harshad_jaju_classes.png",
        image: "harshad_jaju_classes", 
        public_id: "harshad_jaju_classes"
      },
      {
        name: "Navin Classes",
        imageUrl: "/institutes/navin_classes.jpg",
        image: "navin_classes",
        public_id: "navin_classes"
      },
      {
        name: "Nitin Guru Classes", 
        imageUrl: "/institutes/nitin_guru_classes.png",
        image: "nitin_guru_classes",
        public_id: "nitin_guru_classes"
      },
      {
        name: "Ranjan Periwal Classes",
        imageUrl: "/institutes/ranjan_periwal_classes.jpg",
        image: "ranjan_periwal_classes",
        public_id: "ranjan_periwal_classes"
      },
      {
        name: "Shivangi Agarwal",
        imageUrl: "/institutes/shivangi_agarwal.png",
        image: "shivangi_agarwal",
        public_id: "shivangi_agarwal"
      },
      {
        name: "Siddharth Agarrwal Classes", 
        imageUrl: "/institutes/siddharth_agarrwal_classes.jpg",
        image: "siddharth_agarrwal_classes",
        public_id: "siddharth_agarrwal_classes"
      },
      {
        name: "SJC Institute",
        imageUrl: "/institutes/sjc_institute.jpg",
        image: "sjc_institute",
        public_id: "sjc_institute"
      },
      {
        name: "Yashwant Mangal Classes",
        imageUrl: "/institutes/yashwant_mangal_classes.avif",
        image: "yashwant_mangal_classes",
        public_id: "yashwant_mangal_classes"
      }
    ];

    // Clear existing institutes and insert new ones
    await Institute.deleteMany({});
    const insertedInstitutes = await Institute.insertMany(institutesData);
    
    res.status(201).json({ 
      success: true, 
      message: `${insertedInstitutes.length} institutes inserted successfully`,
      institutes: insertedInstitutes 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STANDALONE COURSES ROUTES ====================

// Get all standalone courses
app.get('/api/courses/standalone', async (req, res) => {
  try {
    const courses = await Course.find({ 
      isStandalone: true,
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all courses (both standalone and faculty-based)
app.get('/api/courses/all', async (req, res) => {
  try {
    const courses = await Course.find({ 
      isActive: true 
    }).sort({ createdAt: -1 });
    
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a standalone course
app.put('/api/admin/courses/standalone/:id', courseUpload.single('poster'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.posterUrl = req.file.path;
      updateData.posterPublicId = req.file.filename;
    }

    // Parse mode and attempt pricing if provided
    if (updateData.modeAttemptPricing) {
      try {
        updateData.modeAttemptPricing = JSON.parse(updateData.modeAttemptPricing);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid mode attempt pricing format' });
      }
    }

    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Course updated successfully',
      course 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a standalone course
app.delete('/api/admin/courses/standalone/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findByIdAndDelete(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Course deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== END STANDALONE COURSES ROUTES ====================

// ==================== FACULTY ROUTES ====================

// Get all faculties
app.get('/api/faculties', async (req, res) => {
  try {
    const Faculty = require('./src/model/Faculty.model');
    const faculties = await Faculty.find();
    res.status(200).json({ faculties });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new faculty
app.post('/api/admin/faculty', facultyUpload.single('image'), async (req, res) => {
  try {
    console.log('📝 Faculty creation request received');
    console.log('📤 Request body:', req.body);
    console.log('📸 File received:', req.file ? 'Yes' : 'No');
    
    const Faculty = require('./src/model/Faculty.model');
    const { firstName, lastName, bio, teaches } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }
    
    // Get the Cloudinary URL from the uploaded file
    const imageUrl = req.file.path;
    const public_id = req.file.filename;

    // Handle teaches array
    let parsedTeaches = [];
    if (teaches) {
      try {
        parsedTeaches = JSON.parse(teaches);
      } catch (e) {
        if (typeof teaches === 'string') {
          parsedTeaches = teaches.split(',').map(t => t.trim());
        } else if (Array.isArray(teaches)) {
          parsedTeaches = teaches;
        } else {
          parsedTeaches = [teaches];
        }
      }
    }

    // Generate slug
    const slug = `${firstName.toLowerCase().replace(/ /g, '-')}-${lastName ? lastName.toLowerCase().replace(/ /g, '-') : ''}`.replace(/--/g, '-').replace(/^-|-$/g, '');

    const newFaculty = new Faculty({
      firstName,
      lastName: lastName || '',
      bio,
      teaches: parsedTeaches,
      imageUrl,
      image: public_id,
      public_id,
      slug,
    });

    await newFaculty.save();
    console.log('✅ Faculty saved successfully:', newFaculty._id);
    
    res.status(201).json({ success: true, faculty: newFaculty });
  } catch (error) {
    console.error('❌ Faculty creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get faculty info by firstName
app.get('/api/faculty-info/:firstName', async (req, res) => {
  try {
    const Faculty = require('./src/model/Faculty.model');
    const { firstName } = req.params;
    
    const faculty = await Faculty.findOne({ 
      firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } 
    });
    
    if (faculty) {
      res.json({
        bio: faculty.bio,
        teaches: faculty.teaches,
        lastName: faculty.lastName
      });
    } else {
      res.json({
        bio: '',
        teaches: [],
        lastName: ''
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update faculty info
app.post('/api/admin/faculty-info', async (req, res) => {
  try {
    const Faculty = require('./src/model/Faculty.model');
    const { firstName, bio, teaches } = req.body;
    
    if (!firstName) {
      return res.status(400).json({ error: 'Faculty firstName is required' });
    }

    const updateData = {
      bio: bio || '',
      teaches: teaches || []
    };

    const faculty = await Faculty.findOneAndUpdate(
      { firstName: { $regex: new RegExp('^' + firstName + '$', 'i') } },
      updateData,
      { new: true, upsert: false }
    );

    if (faculty) {
      res.json({ success: true, faculty });
    } else {
      res.status(404).json({ error: 'Faculty not found' });
    }
  } catch (error) {
    console.error('Faculty update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete all faculty (emergency endpoint)
app.delete('/emergency-delete-faculty', async (req, res) => {
  try {
    const Faculty = require('./src/model/Faculty.model');
    const result = await Faculty.deleteMany({});
    res.json({ 
      success: true, 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== END FACULTY ROUTES ====================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth test: http://localhost:${PORT}/api/auth/test`);
  });
}).catch((err) => {
  console.error('Failed to start:', err);
});