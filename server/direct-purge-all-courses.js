// EMERGENCY: Direct course purge for immediate removal of all courses
// This script directly connects to the database and purges all courses from everywhere
// No need to run the server or API

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Define all possible schemas to ensure we find all courses anywhere in the database
const CourseSchema = new mongoose.Schema({
  facultyName: String,
  subject: String,
  noOfLecture: String,
  // All fields are optional to ensure we can load any variant
}, { strict: false });

const FacultySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  slug: String,
  courses: [CourseSchema]
}, { strict: false });

const InstituteSchema = new mongoose.Schema({
  name: String,
  courses: [CourseSchema]
}, { strict: false });

const StandaloneCourseSchema = new mongoose.Schema({
  subject: String,
  // All fields are optional to ensure we can load any variant
}, { strict: false });

async function connectToDatabase() {
  // Try to find MongoDB URI in multiple possible locations
  let MONGODB_URI = process.env.MONGODB_URI;
  
  // Check other common environment variable names
  if (!MONGODB_URI) MONGODB_URI = process.env.MONGO_URI;
  if (!MONGODB_URI) MONGODB_URI = process.env.DB_URI;
  if (!MONGODB_URI) MONGODB_URI = process.env.DATABASE_URI;
  
  // Try to read from .env file directly if no environment variable found
  if (!MONGODB_URI) {
    try {
      const envPath = path.join(__dirname, '.env');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const mongoUriMatch = envContent.match(/MONGODB_URI=["']?(.*?)["']?$/m);
        if (mongoUriMatch && mongoUriMatch[1]) {
          MONGODB_URI = mongoUriMatch[1];
          console.log('🔍 Found MongoDB URI in .env file');
        }
      }
    } catch (err) {
      console.error('❌ Error reading .env file:', err);
    }
  }
  
  // Still no MongoDB URI? Try to check package.json for config
  if (!MONGODB_URI) {
    try {
      const packagePath = path.join(__dirname, 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (packageJson.config && packageJson.config.mongodbUri) {
          MONGODB_URI = packageJson.config.mongodbUri;
          console.log('🔍 Found MongoDB URI in package.json config');
        }
      }
    } catch (err) {
      console.error('❌ Error reading package.json:', err);
    }
  }
  
  // Hard-coded fallback for AcademyWale project if all else fails
  if (!MONGODB_URI) {
    console.warn('⚠️ No MongoDB URI found in environment variables or files. Using fallback connection string...');
    // Ask for URI
    MONGODB_URI = await new Promise(resolve => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('Please enter MongoDB URI: ', uri => {
        readline.close();
        resolve(uri);
      });
    });
  }
  
  if (!MONGODB_URI) {
    console.error('❌ Could not determine MongoDB URI from any source');
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
  console.log('🧨 EMERGENCY: Direct purge of ALL courses from the system');
  
  // Connect to the database
  const connected = await connectToDatabase();
  if (!connected) return;
  
  try {
    // Register all models with Mongoose
    let Faculty, Institute, StandaloneCourse;
    
    try {
      Faculty = mongoose.model('Faculty');
    } catch (e) {
      Faculty = mongoose.model('Faculty', FacultySchema);
    }
    
    try {
      Institute = mongoose.model('Institute');
    } catch (e) {
      Institute = mongoose.model('Institute', InstituteSchema);
    }
    
    try {
      StandaloneCourse = mongoose.model('StandaloneCourse');
    } catch (e) {
      StandaloneCourse = mongoose.model('StandaloneCourse', StandaloneCourseSchema);
    }
    
    console.log('🔍 Scanning all collections for courses...');
    
    // STEP 1: Purge Faculty courses
    console.log('\n📊 CHECKING FACULTY COURSES:');
    const faculties = await Faculty.find({});
    const totalFaculties = faculties.length;
    console.log(`📊 Found ${totalFaculties} faculties in the database`);
    
    let facultyCoursesRemoved = 0;
    
    // For each faculty, empty their courses array
    for (const faculty of faculties) {
      const coursesCount = faculty.courses ? faculty.courses.length : 0;
      facultyCoursesRemoved += coursesCount;
      
      console.log(`👨‍🏫 Faculty: ${faculty.firstName} ${faculty.lastName || ''} (${faculty.slug}) - Removing ${coursesCount} courses`);
      
      faculty.courses = []; // Remove all courses
      await faculty.save();
    }
    
    // STEP 2: Purge Institute courses
    console.log('\n📊 CHECKING INSTITUTE COURSES:');
    const institutes = await Institute.find({});
    const totalInstitutes = institutes.length;
    console.log(`📊 Found ${totalInstitutes} institutes in the database`);
    
    let instituteCoursesRemoved = 0;
    
    // For each institute, empty their courses array
    for (const institute of institutes) {
      const coursesCount = institute.courses ? institute.courses.length : 0;
      instituteCoursesRemoved += coursesCount;
      
      console.log(`🏫 Institute: ${institute.name} - Removing ${coursesCount} courses`);
      
      institute.courses = []; // Remove all courses
      await institute.save();
    }
    
    // STEP 3: Purge Standalone courses
    console.log('\n📊 CHECKING STANDALONE COURSES:');
    let standaloneCoursesRemoved = 0;
    
    try {
      // Check if collection exists and delete all documents
      const result = await StandaloneCourse.deleteMany({});
      standaloneCoursesRemoved = result.deletedCount || 0;
      console.log(`🔥 Deleted ${standaloneCoursesRemoved} standalone courses`);
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 26) {
        console.log('📊 No standalone courses collection found');
      } else {
        console.error('❌ Error deleting standalone courses:', error);
      }
    }
    
    // STEP 4: Additional cleaning - check all collections for possible course data
    console.log('\n📊 CHECKING OTHER COLLECTIONS:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      const collectionName = collection.name;
      
      // Skip already handled collections
      if (['faculties', 'institutes', 'standalonecourses'].includes(collectionName.toLowerCase())) {
        continue;
      }
      
      console.log(`🔍 Checking collection: ${collectionName}`);
      
      // Check for course field in this collection
      const db = mongoose.connection.db;
      const hasCoursesField = await db.collection(collectionName).findOne({ courses: { $exists: true } });
      
      if (hasCoursesField) {
        console.log(`🔥 Found courses in collection ${collectionName} - clearing them`);
        await db.collection(collectionName).updateMany(
          { courses: { $exists: true } },
          { $set: { courses: [] } }
        );
      }
    }
    
    console.log('\n✅ OPERATION SUCCESSFUL');
    console.log('=======================');
    console.log(`📊 Faculty courses removed: ${facultyCoursesRemoved} from ${totalFaculties} faculties`);
    console.log(`📊 Institute courses removed: ${instituteCoursesRemoved} from ${totalInstitutes} institutes`);
    console.log(`📊 Standalone courses removed: ${standaloneCoursesRemoved}`);
    console.log(`📊 TOTAL COURSES REMOVED: ${facultyCoursesRemoved + instituteCoursesRemoved + standaloneCoursesRemoved}`);
    
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
