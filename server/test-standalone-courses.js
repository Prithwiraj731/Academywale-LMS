// Test script to check standalone course creation and retrieval
const mongoose = require('mongoose');
const Course = require('./src/model/Course.model');
const Faculty = require('./src/model/Faculty.model');

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    // Use the same connection string as in your app
    const MONGO_URI = 'mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/?retryWrites=true&w=majority&appName=courses';
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Check existing standalone courses
async function checkStandaloneCourses() {
  try {
    // Get all standalone courses
    const standaloneCourses = await Course.find({ 
      $or: [
        { isStandalone: true },
        { facultySlug: { $in: [null, '', undefined] } }
      ]
    });
    
    console.log(`\n============== STANDALONE COURSES (${standaloneCourses.length}) ==============`);
    if (standaloneCourses.length === 0) {
      console.log('No standalone courses found');
    } else {
      standaloneCourses.forEach((course, index) => {
        console.log(`\n[${index + 1}] ${course.subject || 'Untitled'}`);
        console.log(`- ID: ${course._id}`);
        console.log(`- Category: ${course.category}`);
        console.log(`- Subcategory: ${course.subcategory}`);
        console.log(`- PaperId: ${course.paperId}`);
        console.log(`- isStandalone flag: ${course.isStandalone}`);
        console.log(`- facultySlug: ${course.facultySlug || 'empty'}`);
      });
    }
  } catch (error) {
    console.error('Error checking standalone courses:', error);
  }
}

// Check CA Final Paper 11 courses
async function checkCAFinalPaper11Courses() {
  try {
    // Standalone courses matching CA/Final/11
    const standaloneCourses = await Course.find({
      $and: [
        { $or: [{ isStandalone: true }, { facultySlug: { $in: [null, '', undefined] } }] },
        { $or: [{ category: 'CA' }, { category: 'ca' }] },
        { $or: [{ subcategory: 'FINAL' }, { subcategory: 'final' }, { subcategory: 'Final' }] },
        { $or: [{ paperId: 11 }, { paperId: '11' }] }
      ]
    });
    
    // Faculty courses matching CA/Final/11
    const faculty = await Faculty.find({});
    const facultyCourses = [];
    
    faculty.forEach(fac => {
      (fac.courses || []).forEach(course => {
        const cat = String(course.category || '').toUpperCase();
        const subcat = String(course.subcategory || '').toLowerCase();
        const pid = String(course.paperId || '');
        
        if (cat === 'CA' && subcat === 'final' && pid === '11') {
          facultyCourses.push({
            _id: course._id,
            subject: course.subject,
            facultyName: `${fac.firstName} ${fac.lastName || ''}`,
            category: course.category,
            subcategory: course.subcategory,
            paperId: course.paperId
          });
        }
      });
    });
    
    console.log(`\n============== CA FINAL PAPER 11 COURSES ==============`);
    console.log(`Standalone courses: ${standaloneCourses.length}`);
    console.log(`Faculty courses: ${facultyCourses.length}`);
    
    // Print standalone courses
    if (standaloneCourses.length > 0) {
      console.log('\n----- Standalone Courses -----');
      standaloneCourses.forEach((course, index) => {
        console.log(`[${index + 1}] ${course.subject || 'Untitled'}`);
      });
    }
    
    // Print faculty courses
    if (facultyCourses.length > 0) {
      console.log('\n----- Faculty Courses -----');
      facultyCourses.forEach((course, index) => {
        console.log(`[${index + 1}] ${course.subject || 'Untitled'} (${course.facultyName})`);
      });
    }
    
    if (standaloneCourses.length === 0 && facultyCourses.length === 0) {
      console.log('No courses found for CA Final Paper 11');
    }
  } catch (error) {
    console.error('Error checking CA Final Paper 11 courses:', error);
  }
}

// Create a test standalone course
async function createTestStandaloneCourse() {
  try {
    // Check if test course already exists
    const existingCourse = await Course.findOne({
      subject: 'TEST CA Final Paper 11 Standalone Course',
      category: 'CA',
      subcategory: 'final',
      paperId: '11'
    });
    
    if (existingCourse) {
      console.log('\nTest course already exists:', existingCourse._id);
      return;
    }
    
    // Create new test course
    const newCourse = new Course({
      subject: 'TEST CA Final Paper 11 Standalone Course',
      title: 'TEST Course for Debugging',
      category: 'CA',
      subcategory: 'final',
      paperId: '11',
      paperName: 'Financial Reporting',
      posterUrl: '/logo.svg',
      facultyName: 'Test Faculty',
      description: 'This is a test course created for debugging purposes.',
      noOfLecture: '10 Lectures',
      books: 'PDF Materials',
      videoLanguage: 'Hindi + English',
      videoRunOn: 'All Devices',
      doubtSolving: 'WhatsApp',
      timing: 'Flexible',
      courseType: 'CA Final Paper 11',
      isStandalone: true,
      isActive: true,
      modeAttemptPricing: [
        {
          mode: 'Online',
          attempts: [
            { attempt: '1 Attempt', costPrice: 9999, sellingPrice: 7999 }
          ]
        }
      ]
    });
    
    const savedCourse = await newCourse.save();
    console.log('\nTest standalone course created:', savedCourse._id);
    
  } catch (error) {
    console.error('Error creating test standalone course:', error);
  }
}

// Main function
async function main() {
  const connected = await connectToMongoDB();
  if (!connected) return;
  
  console.log('\n======= CHECKING EXISTING COURSES =======');
  await checkStandaloneCourses();
  await checkCAFinalPaper11Courses();
  
  console.log('\n======= CREATING TEST COURSE =======');
  await createTestStandaloneCourse();
  
  console.log('\n======= CHECKING AFTER CREATION =======');
  await checkCAFinalPaper11Courses();
  
  // Disconnect from MongoDB
  await mongoose.disconnect();
  console.log('\nDisconnected from MongoDB');
}

// Run the script
main().catch(console.error);
