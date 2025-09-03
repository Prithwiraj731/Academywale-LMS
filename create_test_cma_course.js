/**
 * Quick Test Script to Create CMA Final Paper 20 Course
 * Run this script to create a test course for CMA Final Paper 20
 */

async function createTestCMAFinalCourse() {
  console.log('🧪 Creating Test CMA Final Paper 20 Course...\n');
  
  const API_URL = 'http://localhost:3000'; // Change if your server runs on different port
  
  // Test course data for CMA Final Paper 20
  const testCourseData = new FormData();
  testCourseData.append('category', 'CMA');
  testCourseData.append('subcategory', 'final');
  testCourseData.append('paperId', '20');
  testCourseData.append('paperName', 'Strategic Performance Management and Business Valuation');
  testCourseData.append('subject', 'Strategic Performance Management and Business Valuation');
  testCourseData.append('title', 'CMA Final Paper 20 - Strategic Performance Management');
  testCourseData.append('facultySlug', 'cma-expert-faculty'); // You might need to use an existing faculty slug
  testCourseData.append('description', 'Complete course for CMA Final Paper 20 covering Strategic Performance Management and Business Valuation');
  testCourseData.append('institute', 'AcademyWale Institute');
  testCourseData.append('noOfLecture', '50');
  testCourseData.append('books', 'ICMAI Study Material + Reference Books');
  testCourseData.append('videoLanguage', 'Hindi + English');
  testCourseData.append('timing', 'Flexible');
  testCourseData.append('costPrice', '15000');
  testCourseData.append('sellingPrice', '12000');
  
  try {
    console.log('📡 Sending course creation request...');
    
    const response = await fetch(`${API_URL}/api/admin/courses`, {
      method: 'POST',
      body: testCourseData
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Test course created successfully!');
      console.log(`   Course: ${data.course.subject}`);
      console.log(`   Category/Subcategory/PaperId: ${data.course.category}/${data.course.subcategory}/${data.course.paperId}`);
      if (data.faculty) {
        console.log(`   Faculty: ${data.faculty.name}`);
      }
      
      // Now test if it can be retrieved
      console.log('\n🔍 Testing course retrieval...');
      
      setTimeout(async () => {
        try {
          const retrievalUrl = `${API_URL}/api/courses/CMA/final/20`;
          console.log(`📡 Testing retrieval from: ${retrievalUrl}`);
          
          const retrievalResponse = await fetch(retrievalUrl);
          const retrievalData = await retrievalResponse.json();
          
          if (retrievalResponse.ok && retrievalData.courses && retrievalData.courses.length > 0) {
            console.log('✅ Course retrieval successful!');
            console.log(`   Found ${retrievalData.courses.length} courses for CMA Final Paper 20`);
            retrievalData.courses.forEach((course, index) => {
              console.log(`   ${index + 1}. ${course.subject} (Faculty: ${course.facultyName || 'N/A'})`);
            });
          } else {
            console.log('❌ Course retrieval failed - course not found');
            console.log('   Response:', retrievalData);
            
            // Try the debug endpoint
            console.log('\n🛠️ Trying debug endpoint...');
            const debugUrl = `${API_URL}/api/courses/debug/cma/final`;
            const debugResponse = await fetch(debugUrl);
            const debugData = await debugResponse.json();
            
            if (debugResponse.ok && debugData.success) {
              console.log('📊 Debug info:', debugData.debug.summary);
              if (debugData.debug.coursesByPaperId['20']) {
                console.log('✅ Course found in debug endpoint!');
                console.log('   Courses for Paper 20:', debugData.debug.coursesByPaperId['20']);
              } else {
                console.log('❌ Course not found in debug endpoint either');
                console.log('   Available paper IDs:', debugData.debug.summary.paperIdsWithCourses);
              }
            }
          }
        } catch (error) {
          console.log('❌ Error during retrieval test:', error.message);
        }
      }, 2000);
      
    } else {
      console.log('❌ Failed to create test course');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
    }
  } catch (error) {
    console.log('❌ ERROR creating test course:', error.message);
  }
}

// For Node.js environment
if (typeof require !== 'undefined') {
  // Try to use fetch if available
  let fetch;
  try {
    fetch = require('node-fetch');
    
    // Also create FormData
    const FormData = require('form-data');
    global.FormData = FormData;
    
  } catch (e) {
    console.log('❌ node-fetch or form-data not available. Please run: npm install node-fetch form-data');
    console.log('   Or run this script in a browser console');
    process.exit(1);
  }
  
  // Run the test
  createTestCMAFinalCourse().catch(console.error);
}

// For browser environment  
if (typeof window !== 'undefined') {
  window.createTestCMAFinalCourse = createTestCMAFinalCourse;
  
  console.log('Test function available: createTestCMAFinalCourse()');
}