/**
 * Debug script for course visibility issues
 * Run this when the server is running to test course creation and retrieval
 */

// Test endpoints to verify course saving and visibility
const testEndpoints = [
  'http://localhost:3000/api/courses/CA/foundation/1',
  'http://localhost:3000/api/courses/CA/inter/1', 
  'http://localhost:3000/api/courses/CA/final/1',
  'http://localhost:3000/api/courses/CMA/foundation/1'
];

const debugEndpoints = [
  'http://localhost:3000/api/courses/debug',
  'http://localhost:3000/api/courses/simple-test',
  'http://localhost:3000/api/courses/all'
];

// Function to test course retrieval
async function testCourseRetrieval() {
  console.log('🔍 Testing Course Retrieval...\n');
  
  for (const endpoint of testEndpoints) {
    console.log(`📡 Testing: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ SUCCESS: Found ${data.courses ? data.courses.length : 0} courses`);
        
        if (data.courses && data.courses.length > 0) {
          data.courses.forEach((course, index) => {
            console.log(`   ${index + 1}. ${course.subject || course.title} (Category: ${course.category}, Subcategory: ${course.subcategory}, Paper: ${course.paperId})`);
          });
        } else {
          console.log('   ❌ No courses found - this is the issue!');
        }
      } else {
        console.log(`❌ FAILED: ${response.status} - ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Function to test debug endpoints
async function testDebugEndpoints() {
  console.log('🛠️ Testing Debug Endpoints...\n');
  
  for (const endpoint of debugEndpoints) {
    console.log(`📡 Testing debug: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok) {
        if (endpoint.includes('debug')) {
          console.log(`📊 Debug Info:`);
          console.log(`   Faculty courses: ${data.facultyCourses ? data.facultyCourses.length : 0}`);
          console.log(`   Standalone courses: ${data.standaloneCourses ? data.standaloneCourses.length : 0}`);
          console.log(`   Total courses: ${data.totalCourses || 0}`);
          
          // Show sample courses
          if (data.facultyCourses && data.facultyCourses.length > 0) {
            console.log(`   Sample faculty course: ${data.facultyCourses[0].subject} (${data.facultyCourses[0].category}/${data.facultyCourses[0].subcategory}/${data.facultyCourses[0].paperId})`);
          }
          if (data.standaloneCourses && data.standaloneCourses.length > 0) {
            console.log(`   Sample standalone course: ${data.standaloneCourses[0].subject} (${data.standaloneCourses[0].category}/${data.standaloneCourses[0].subcategory}/${data.standaloneCourses[0].paperId})`);
          }
        } else if (endpoint.includes('simple-test')) {
          console.log(`📊 Simple Test Info:`);
          console.log(`   Faculties: ${data.summary.facultyCount}`);
          console.log(`   Faculty courses: ${data.summary.facultyCourseCount}`);
          console.log(`   Standalone courses: ${data.summary.standaloneCourseCount}`);
          
          // Show sample courses
          if (data.summary.sampleCourses && data.summary.sampleCourses.length > 0) {
            console.log(`   Sample courses:`);
            data.summary.sampleCourses.forEach((course, index) => {
              console.log(`     ${index + 1}. ${course.subject} (${course.type}) - ${course.category}/${course.subcategory}/${course.paperId}`);
            });
          }
        } else if (endpoint.includes('all')) {
          console.log(`📊 All Courses:`);
          console.log(`   Total courses: ${data.courses ? data.courses.length : 0}`);
          
          if (data.courses && data.courses.length > 0) {
            // Group by category/subcategory/paperId
            const grouped = {};
            data.courses.forEach(course => {
              const key = `${course.category}/${course.subcategory}/${course.paperId}`;
              if (!grouped[key]) grouped[key] = [];
              grouped[key].push(course);
            });
            
            console.log(`   Grouped courses:`);
            Object.keys(grouped).forEach(key => {
              console.log(`     ${key}: ${grouped[key].length} courses`);
            });
          }
        }
      } else {
        console.log(`❌ FAILED: ${response.status} - ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// Function to create a test course
async function createTestCourse() {
  console.log('🏗️ Creating Test Course...\n');
  
  const testCourseData = new FormData();
  testCourseData.append('category', 'CA');
  testCourseData.append('subcategory', 'foundation');
  testCourseData.append('paperId', '1');
  testCourseData.append('paperName', 'Principles and Practice of Accounting');
  testCourseData.append('subject', 'Test Accounting Course');
  testCourseData.append('title', 'Test Course for Debug');
  testCourseData.append('facultySlug', 'ca-rajesh-sharma');
  testCourseData.append('description', 'This is a test course created for debugging');
  testCourseData.append('institute', 'Test Institute');
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/courses', {
      method: 'POST',
      body: testCourseData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Test course created successfully!');
      console.log(`   Course: ${data.course.subject}`);
      console.log(`   Category/Subcategory/PaperId: ${data.course.category}/${data.course.subcategory}/${data.course.paperId}`);
      console.log(`   Faculty: ${data.faculty.name}`);
    } else {
      console.log(`❌ Failed to create test course: ${data.message || data.error}`);
    }
  } catch (error) {
    console.log(`❌ ERROR creating test course: ${error.message}`);
  }
  
  console.log('');
}

// Main function to run all tests
async function runDebugTests() {
  console.log('🚀 Starting Course Visibility Debug Tests...\n');
  console.log('='.repeat(60));
  
  // First check what courses exist
  await testDebugEndpoints();
  
  console.log('='.repeat(60));
  
  // Test actual retrieval endpoints
  await testCourseRetrieval();
  
  console.log('='.repeat(60));
  
  // Create a test course and then test again
  console.log('🧪 Creating test course and retesting...\n');
  await createTestCourse();
  
  // Wait a moment and test retrieval again
  setTimeout(async () => {
    console.log('🔄 Retesting after course creation...\n');
    await testCourseRetrieval();
  }, 1000);
}

// For Node.js environment
if (typeof require !== 'undefined') {
  // Try to use fetch if available
  let fetch;
  try {
    fetch = require('node-fetch');
  } catch (e) {
    console.log('❌ node-fetch not available. Please run: npm install node-fetch');
    console.log('   Or run this script in a browser console');
    process.exit(1);
  }
  
  // Run the tests
  runDebugTests().catch(console.error);
}

// For browser environment  
if (typeof window !== 'undefined') {
  window.runDebugTests = runDebugTests;
  window.testCourseRetrieval = testCourseRetrieval;
  window.testDebugEndpoints = testDebugEndpoints;
  window.createTestCourse = createTestCourse;
  
  console.log('Debug functions available:');
  console.log('- runDebugTests()');
  console.log('- testCourseRetrieval()');
  console.log('- testDebugEndpoints()');
  console.log('- createTestCourse()');
}