// Direct course purge for emergencies
// This script directly connects to the database and purges all courses
// No need to run the server or API

require('dotenv').config();
const mongoose = require('mongoose');

// Define the Faculty schema
const CourseSchema = new mongoose.Schema({
  facultyName: String,
  subject: String,
  noOfLecture: String,
  // ...other fields...
});

const FacultySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  slug: String,
  courses: [CourseSchema]
});

async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI in environment variables');
    process.exit(1);
  }
  
  console.log('🔌 Connecting to database...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Connection error:', error);
    return false;
  }
}

async function purgeAllCourses() {
  console.log('🧨 EMERGENCY: Direct purge of all courses from the system');
  
  // Connect to the database
  const connected = await connectToDatabase();
  if (!connected) return;
  
  try {
    // Register the model with Mongoose
    const Faculty = mongoose.model('Faculty', FacultySchema);
    
    // Find all faculties
    const faculties = await Faculty.find({});
    const totalFaculties = faculties.length;
    console.log(`📊 Found ${totalFaculties} faculties in the database`);
    
    let totalCoursesRemoved = 0;
    
    // For each faculty, empty their courses array
    for (const faculty of faculties) {
      const coursesCount = faculty.courses ? faculty.courses.length : 0;
      totalCoursesRemoved += coursesCount;
      
      console.log(`👨‍🏫 Faculty: ${faculty.firstName} ${faculty.lastName || ''} (${faculty.slug}) - Removing ${coursesCount} courses`);
      
      faculty.courses = []; // Remove all courses
      await faculty.save();
    }
    
    console.log('\n✅ OPERATION SUCCESSFUL');
    console.log('=======================');
    console.log(`📊 Total faculties affected: ${totalFaculties}`);
    console.log(`📊 Total courses removed: ${totalCoursesRemoved}`);
    
  } catch (error) {
    console.error('❌ Error purging courses:', error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Execute the purge
purgeAllCourses();
