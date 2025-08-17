// Test script to verify our standalone course display fix
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testStandaloneCourses() {
  try {
    console.log('Testing standalone course API endpoint...');
    
    // Try to fetch CA Final Paper 11 courses with standalone included
    const response = await fetch('http://localhost:5000/api/courses/CA/final/11?includeStandalone=true');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`Found ${data.courses?.length || 0} total courses`);
    
    // Count and display standalone courses
    const standaloneCourses = data.courses?.filter(course => course.isStandalone === true) || [];
    console.log(`Found ${standaloneCourses.length} standalone courses`);
    
    if (standaloneCourses.length > 0) {
      console.log('\nStandalone courses:');
      standaloneCourses.forEach((course, index) => {
        console.log(`[${index + 1}] ${course.subject || course.title || 'Untitled'}`);
        console.log(`  - ID: ${course._id}`);
        console.log(`  - Category: ${course.category}`);
        console.log(`  - Subcategory: ${course.subcategory}`);
        console.log(`  - PaperId: ${course.paperId}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testStandaloneCourses();
