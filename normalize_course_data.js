/**
 * Emergency Course Data Normalizer
 * Run this script to normalize all existing course data in the database
 */

const mongoose = require('mongoose');

async function normalizeAllCourseData() {
  try {
    console.log('🔧 Starting Emergency Course Data Normalization...');
    
    // Connect to MongoDB
    const mongoURI = 'mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/?retryWrites=true&w=majority&appName=courses';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    
    const Faculty = require('./server/src/model/Faculty.model');
    const Course = require('./server/src/model/Course.model');
    
    let totalUpdated = 0;
    let totalCourses = 0;
    
    // Function to normalize course data
    function normalizeCourseData(course) {
      let updated = false;
      
      // Normalize category to uppercase
      if (course.category && course.category !== course.category.toUpperCase()) {
        course.category = course.category.toUpperCase();
        updated = true;
      }
      
      // Normalize subcategory to lowercase
      if (course.subcategory && course.subcategory !== course.subcategory.toLowerCase()) {
        course.subcategory = course.subcategory.toLowerCase();
        updated = true;
      }
      
      // Normalize paperId to string
      if (course.paperId && typeof course.paperId !== 'string') {
        course.paperId = String(course.paperId);
        updated = true;
      }
      
      return updated;
    }
    
    // Update faculty courses
    console.log('🔍 Processing faculty courses...');
    const faculties = await Faculty.find({});
    
    for (const faculty of faculties) {
      let facultyUpdated = false;
      
      if (faculty.courses && faculty.courses.length > 0) {
        for (const course of faculty.courses) {
          totalCourses++;
          
          if (normalizeCourseData(course)) {
            facultyUpdated = true;
            totalUpdated++;
            console.log(`📝 Updated: ${course.subject} (${course.category}/${course.subcategory}/${course.paperId})`);
          }
        }
        
        if (facultyUpdated) {
          await faculty.save();
          console.log(`✅ Updated faculty: ${faculty.firstName} ${faculty.lastName || ''}`);
        }
      }
    }
    
    // Update standalone courses
    console.log('🔍 Processing standalone courses...');
    const standaloneCourses = await Course.find({});
    
    for (const course of standaloneCourses) {
      totalCourses++;
      
      if (normalizeCourseData(course)) {
        await course.save();
        totalUpdated++;
        console.log(`📝 Updated standalone: ${course.subject} (${course.category}/${course.subcategory}/${course.paperId})`);
      }
    }
    
    console.log('\n🎉 Normalization Complete!');
    console.log(`   Total courses processed: ${totalCourses}`);
    console.log(`   Total courses updated: ${totalUpdated}`);
    console.log(`   Courses already normalized: ${totalCourses - totalUpdated}`);
    
    // Verify CMA Final courses specifically
    console.log('\n🔍 Verifying CMA Final courses...');
    let cmaFinalCount = 0;
    let paper20Count = 0;
    
    for (const faculty of faculties) {
      if (faculty.courses) {
        for (const course of faculty.courses) {
          if (course.category === 'CMA' && course.subcategory === 'final') {
            cmaFinalCount++;
            console.log(`   CMA Final: ${course.subject} (Paper ${course.paperId})`);
            
            if (String(course.paperId) === '20') {
              paper20Count++;
              console.log(`   🎯 FOUND PAPER 20: ${course.subject}`);
            }
          }
        }
      }
    }
    
    const standaloneCoursesRefresh = await Course.find({});
    for (const course of standaloneCoursesRefresh) {
      if (course.category === 'CMA' && course.subcategory === 'final') {
        cmaFinalCount++;
        console.log(`   CMA Final (standalone): ${course.subject} (Paper ${course.paperId})`);
        
        if (String(course.paperId) === '20') {
          paper20Count++;
          console.log(`   🎯 FOUND PAPER 20 (standalone): ${course.subject}`);
        }
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total CMA Final courses: ${cmaFinalCount}`);
    console.log(`   Paper 20 courses: ${paper20Count}`);
    
    if (paper20Count === 0) {
      console.log('\n⚠️ No Paper 20 courses found! You need to create one.');
      console.log('   Run: node create_test_cma_course.js');
    } else {
      console.log('\n✅ Paper 20 courses exist and should now be retrievable!');
    }
    
  } catch (error) {
    console.error('❌ Error during normalization:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the normalization
if (require.main === module) {
  normalizeAllCourseData().catch(console.error);
}

module.exports = { normalizeAllCourseData };