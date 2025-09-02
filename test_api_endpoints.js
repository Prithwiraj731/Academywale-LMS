/**
 * Test script to verify course visibility fix
 * This simulates the API calls that frontend paper detail pages make
 */

// Test the API endpoints that paper detail pages use
const testEndpoints = [
  'http://localhost:3000/api/courses/CA/foundation/1',
  'http://localhost:3000/api/courses/CA/inter/1', 
  'http://localhost:3000/api/courses/CA/final/1',
  'http://localhost:3000/api/courses/CMA/foundation/1'
];

async function testCourseVisibility() {
  console.log('🧪 Testing Course Visibility Fix...\n');
  
  for (const endpoint of testEndpoints) {
    console.log(`📡 Testing: ${endpoint}`);
    
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok && data.courses) {
        console.log(`✅ SUCCESS: Found ${data.courses.length} courses`);
        
        if (data.courses.length > 0) {
          data.courses.forEach((course, index) => {
            console.log(`   ${index + 1}. ${course.subject || course.title} (Category: ${course.category}, Subcategory: ${course.subcategory}, Paper: ${course.paperId})`);
          });
        }
      } else {
        console.log(`❌ FAILED: ${response.status} - ${data.error || 'No courses found'}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
}

// For Node.js environment
if (typeof require !== 'undefined') {
  const fetch = require('node-fetch');
  testCourseVisibility();
}

// For browser environment  
if (typeof window !== 'undefined') {
  window.testCourseVisibility = testCourseVisibility;
}