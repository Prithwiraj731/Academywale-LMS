// Simple test script to check what courses exist in the database
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/academywale', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Faculty = require('./src/model/Faculty.model');
const Course = require('./src/model/Course.model');

async function testCourses() {
  try {
    console.log('🔍 Checking courses in database...\n');
    
    // Check faculty courses
    const faculties = await Faculty.find({});
    console.log(`📚 Found ${faculties.length} faculties`);
    
    let totalFacultyCourses = 0;
    faculties.forEach(faculty => {
      if (faculty.courses && faculty.courses.length > 0) {
        console.log(`\n👨‍🏫 Faculty: ${faculty.firstName} ${faculty.lastName || ''} (${faculty.slug})`);
        console.log(`   Courses: ${faculty.courses.length}`);
        
        faculty.courses.forEach((course, index) => {
          console.log(`   ${index + 1}. Subject: "${course.subject}"`);
          console.log(`      Category: "${course.category}"`);
          console.log(`      Subcategory: "${course.subcategory}"`);
          console.log(`      PaperId: "${course.paperId}"`);
          console.log(`      ID: ${course._id}`);
          totalFacultyCourses++;
        });
      }
    });
    
    // Check standalone courses
    const standaloneCourses = await Course.find({ isActive: true });
    console.log(`\n📖 Found ${standaloneCourses.length} standalone courses`);
    
    standaloneCourses.forEach((course, index) => {
      console.log(`   ${index + 1}. Subject: "${course.subject}"`);
      console.log(`      Category: "${course.category}"`);
      console.log(`      Subcategory: "${course.subcategory}"`);
      console.log(`      PaperId: "${course.paperId}"`);
      console.log(`      ID: ${course._id}`);
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Faculty courses: ${totalFacultyCourses}`);
    console.log(`   Standalone courses: ${standaloneCourses.length}`);
    console.log(`   Total courses: ${totalFacultyCourses + standaloneCourses.length}`);
    
    // Test specific filtering
    console.log(`\n🧪 Testing filter for CMA/final/5:`);
    
    let allCourses = [];
    
    // Add faculty courses
    faculties.forEach(faculty => {
      (faculty.courses || []).forEach(course => {
        if (course) {
          allCourses.push({
            ...course.toObject(),
            facultyName: `${faculty.firstName}${faculty.lastName ? ' ' + faculty.lastName : ''}`,
            source: 'faculty'
          });
        }
      });
    });
    
    // Add standalone courses
    standaloneCourses.forEach(course => {
      allCourses.push({
        ...course.toObject(),
        source: 'standalone'
      });
    });
    
    const filteredCourses = allCourses.filter(course => {
      const courseCategory = String(course.category || '').toUpperCase().trim();
      const courseSubcategory = String(course.subcategory || '').toLowerCase().trim();
      const coursePaperId = String(course.paperId || '').replace(/\D/g, '');
      
      const requestedCategory = 'CMA';
      const requestedSubcategory = 'final';
      const requestedPaperId = '5';
      
      const categoryMatch = courseCategory === requestedCategory;
      const subcategoryMatch = courseSubcategory === requestedSubcategory;
      const paperIdMatch = coursePaperId === requestedPaperId;
      
      console.log(`   Course: ${course.subject}`);
      console.log(`     Category: "${courseCategory}" vs "${requestedCategory}" = ${categoryMatch}`);
      console.log(`     Subcategory: "${courseSubcategory}" vs "${requestedSubcategory}" = ${subcategoryMatch}`);
      console.log(`     PaperId: "${coursePaperId}" vs "${requestedPaperId}" = ${paperIdMatch}`);
      console.log(`     Match: ${categoryMatch && subcategoryMatch && paperIdMatch}`);
      
      return categoryMatch && subcategoryMatch && paperIdMatch;
    });
    
    console.log(`\n✅ Filtered results: ${filteredCourses.length} courses match CMA/final/5`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testCourses();