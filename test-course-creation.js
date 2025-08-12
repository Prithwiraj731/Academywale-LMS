const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');

async function testCourseCreation() {
  try {
    console.log('🧪 Testing course creation endpoint...');
    
    const formData = new FormData();
    formData.append('isStandalone', 'true');
    formData.append('title', 'Test Course');
    formData.append('subject', 'Test Subject');
    formData.append('category', 'CA');
    formData.append('subcategory', 'Foundation');
    formData.append('paperId', '1');
    formData.append('paperName', 'Paper 1');
    formData.append('institute', 'Test Institute');
    formData.append('description', 'Test description');
    formData.append('noOfLecture', '10');
    formData.append('books', 'Test books');
    formData.append('videoLanguage', 'Hindi');
    formData.append('videoRunOn', 'App');
    formData.append('doubtSolving', 'Yes');
    formData.append('supportMail', 'test@test.com');
    formData.append('supportCall', '1234567890');
    formData.append('timing', 'Morning');
    formData.append('validityStartFrom', '2024-01-01');
    formData.append('courseType', 'CA Foundation');
    formData.append('modeAttemptPricing', JSON.stringify([
      {
        mode: 'Live at Home With Hard Copy',
        attempts: [
          { attempt: '1.5 Views & 12 Months Validity', costPrice: 15999, sellingPrice: 13999 }
        ]
      }
    ]));

    const response = await fetch('http://localhost:5000/api/admin/courses/standalone', {
      method: 'POST',
      body: formData,
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📋 Raw response:', responseText);

    try {
      const data = JSON.parse(responseText);
      console.log('✅ Parsed JSON:', data);
    } catch (e) {
      console.error('❌ Failed to parse JSON:', e);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCourseCreation();
