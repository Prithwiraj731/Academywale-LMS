/**
 * Migration Script: Move Standalone Courses to N/A Faculty
 * 
 * This script migrates any remaining standalone courses from the Course collection
 * to the N/A faculty in the Faculty collection.
 * 
 * Usage: node migrate-standalone-courses.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    migrateStandaloneCourses();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

async function migrateStandaloneCourses() {
  try {
    // Import models
    const Course = require('./src/model/Course.model');
    const Faculty = require('./src/model/Faculty.model');

    // Find all standalone courses
    console.log('Finding standalone courses...');
    const standaloneCourses = await Course.find({});
    console.log(`Found ${standaloneCourses.length} standalone courses`);

    if (standaloneCourses.length === 0) {
      console.log('No standalone courses to migrate');
      process.exit(0);
    }

    // Find or create N/A faculty
    console.log('Finding or creating N/A faculty...');
    let naFaculty = await Faculty.findOne({ slug: 'n-a' });
    if (!naFaculty) {
      console.log('Creating new N/A faculty');
      naFaculty = new Faculty({
        firstName: 'N/A',
        lastName: '',
        slug: 'n-a',
        specialization: 'General Courses',
        bio: 'General courses without specific faculty',
        courses: []
      });
      await naFaculty.save();
    }

    // Add each standalone course to N/A faculty
    console.log('Migrating courses to N/A faculty...');
    let migratedCount = 0;

    for (const course of standaloneCourses) {
      // Check if course already exists in N/A faculty (by _id)
      const existingCourse = naFaculty.courses.find(c => 
        c._id && course._id && c._id.toString() === course._id.toString());
      
      if (existingCourse) {
        console.log(`Course ${course._id} already exists in N/A faculty, skipping`);
        continue;
      }

      // Format the course for N/A faculty
      const newCourse = {
        ...course.toObject(),
        facultyName: 'N/A',
        institute: course.institute || 'N/A'
      };
      
      // Remove any standalone-specific fields
      delete newCourse._id; // Let MongoDB generate a new ID
      
      // Add to N/A faculty courses
      naFaculty.courses.push(newCourse);
      migratedCount++;
    }

    if (migratedCount > 0) {
      // Save N/A faculty with new courses
      console.log(`Saving ${migratedCount} migrated courses to N/A faculty...`);
      await naFaculty.save();
      console.log('Courses successfully migrated');
      
      // Now delete the standalone courses
      console.log('Deleting standalone courses...');
      const deleteResult = await Course.deleteMany({});
      console.log(`Deleted ${deleteResult.deletedCount} standalone courses`);
    } else {
      console.log('No new courses to migrate');
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}
