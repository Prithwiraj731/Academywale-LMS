/**
 * Database Index Creation Utility
 * Creates optimized indexes for course lookup performance
 */

const mongoose = require('mongoose');
const Faculty = require('../model/Faculty.model');
const Course = require('../model/Course.model');

/**
 * Create all necessary indexes for course lookup optimization
 */
async function createCourseIndexes() {
  console.log('🔧 Starting database index creation...');
  
  try {
    // Faculty collection indexes
    console.log('📊 Creating Faculty collection indexes...');
    
    // Text index for course subject and title within Faculty documents
    await Faculty.collection.createIndex(
      { 
        "courses.subject": "text", 
        "courses.title": "text",
        "courses.description": "text",
        "courses.paperName": "text"
      },
      { 
        name: "faculty_courses_text_index",
        background: true 
      }
    );
    console.log('✅ Created text index for Faculty.courses fields');

    // Compound index for paper number and course type
    await Faculty.collection.createIndex(
      { 
        "courses.paperNumber": 1, 
        "courses.courseType": 1 
      },
      { 
        name: "faculty_courses_paper_type_index",
        background: true 
      }
    );
    console.log('✅ Created compound index for paperNumber and courseType');

    // Index for course ObjectIds within Faculty documents
    await Faculty.collection.createIndex(
      { "courses._id": 1 },
      { 
        name: "faculty_courses_id_index",
        background: true 
      }
    );
    console.log('✅ Created index for Faculty.courses._id');

    // Index for faculty slug (for faculty-based lookups)
    await Faculty.collection.createIndex(
      { "slug": 1 },
      { 
        name: "faculty_slug_index",
        background: true,
        unique: true 
      }
    );
    console.log('✅ Created unique index for Faculty.slug');

    // Index for faculty firstName (excluding N/A faculty)
    await Faculty.collection.createIndex(
      { "firstName": 1 },
      { 
        name: "faculty_firstName_index",
        background: true 
      }
    );
    console.log('✅ Created index for Faculty.firstName');

    // Compound index for course category and subcategory
    await Faculty.collection.createIndex(
      { 
        "courses.category": 1, 
        "courses.subcategory": 1,
        "courses.paperId": 1
      },
      { 
        name: "faculty_courses_category_index",
        background: true 
      }
    );
    console.log('✅ Created compound index for course category fields');

    // Standalone Course collection indexes (for backward compatibility)
    console.log('📊 Creating standalone Course collection indexes...');
    
    // Text index for standalone courses
    await Course.collection.createIndex(
      { 
        "title": "text", 
        "subject": "text", 
        "description": "text",
        "paperName": "text"
      },
      { 
        name: "course_text_index",
        background: true 
      }
    );
    console.log('✅ Created text index for Course collection');

    // Compound index for paper number and course type in standalone courses
    await Course.collection.createIndex(
      { 
        "paperNumber": 1, 
        "courseType": 1 
      },
      { 
        name: "course_paper_type_index",
        background: true 
      }
    );
    console.log('✅ Created compound index for Course paperNumber and courseType');

    // Index for course category and subcategory in standalone courses
    await Course.collection.createIndex(
      { 
        "category": 1, 
        "subcategory": 1, 
        "paperId": 1 
      },
      { 
        name: "course_category_index",
        background: true 
      }
    );
    console.log('✅ Created compound index for Course category fields');

    // Index for faculty slug in standalone courses
    await Course.collection.createIndex(
      { "facultySlug": 1 },
      { 
        name: "course_faculty_slug_index",
        background: true 
      }
    );
    console.log('✅ Created index for Course.facultySlug');

    // Index for course status
    await Course.collection.createIndex(
      { "isActive": 1 },
      { 
        name: "course_active_index",
        background: true 
      }
    );
    console.log('✅ Created index for Course.isActive');

    console.log('🎉 All database indexes created successfully!');
    
    // Display index information
    await displayIndexInfo();
    
  } catch (error) {
    console.error('❌ Error creating database indexes:', error);
    throw error;
  }
}

/**
 * Display information about created indexes
 */
async function displayIndexInfo() {
  try {
    console.log('\n📋 Index Information:');
    
    // Faculty collection indexes
    const facultyIndexes = await Faculty.collection.indexes();
    console.log(`\n👥 Faculty Collection (${facultyIndexes.length} indexes):`);
    facultyIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Course collection indexes
    const courseIndexes = await Course.collection.indexes();
    console.log(`\n📚 Course Collection (${courseIndexes.length} indexes):`);
    courseIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

  } catch (error) {
    console.error('❌ Error displaying index information:', error);
  }
}

/**
 * Drop all custom indexes (for cleanup/reset)
 */
async function dropCourseIndexes() {
  console.log('🗑️ Dropping custom course indexes...');
  
  try {
    // Faculty collection custom indexes
    const facultyIndexNames = [
      'faculty_courses_text_index',
      'faculty_courses_paper_type_index',
      'faculty_courses_id_index',
      'faculty_slug_index',
      'faculty_firstName_index',
      'faculty_courses_category_index'
    ];

    for (const indexName of facultyIndexNames) {
      try {
        await Faculty.collection.dropIndex(indexName);
        console.log(`✅ Dropped Faculty index: ${indexName}`);
      } catch (error) {
        if (error.code !== 27) { // Index not found error
          console.warn(`⚠️ Could not drop Faculty index ${indexName}:`, error.message);
        }
      }
    }

    // Course collection custom indexes
    const courseIndexNames = [
      'course_text_index',
      'course_paper_type_index',
      'course_category_index',
      'course_faculty_slug_index',
      'course_active_index'
    ];

    for (const indexName of courseIndexNames) {
      try {
        await Course.collection.dropIndex(indexName);
        console.log(`✅ Dropped Course index: ${indexName}`);
      } catch (error) {
        if (error.code !== 27) { // Index not found error
          console.warn(`⚠️ Could not drop Course index ${indexName}:`, error.message);
        }
      }
    }

    console.log('🎉 Custom indexes dropped successfully!');
    
  } catch (error) {
    console.error('❌ Error dropping indexes:', error);
    throw error;
  }
}

/**
 * Check if indexes exist
 */
async function checkIndexes() {
  try {
    console.log('🔍 Checking existing indexes...');
    
    const facultyIndexes = await Faculty.collection.indexes();
    const courseIndexes = await Course.collection.indexes();
    
    console.log(`Faculty collection has ${facultyIndexes.length} indexes`);
    console.log(`Course collection has ${courseIndexes.length} indexes`);
    
    return {
      faculty: facultyIndexes,
      course: courseIndexes
    };
    
  } catch (error) {
    console.error('❌ Error checking indexes:', error);
    throw error;
  }
}

module.exports = {
  createCourseIndexes,
  dropCourseIndexes,
  displayIndexInfo,
  checkIndexes
};