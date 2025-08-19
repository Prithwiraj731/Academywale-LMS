// API utility to delete all courses from the system
require('dotenv').config();
const fetch = require('node-fetch');

async function purgeAllCourses() {
  const API_URL = process.env.BACKEND_URL || 'http://localhost:3000';
  const endpoint = `${API_URL}/api/admin/courses/deleteAll/confirm`;
  
  console.log('🧨 EMERGENCY: Purging all courses from the system');
  console.log(`📡 Making request to: ${endpoint}`);
  
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ API returned status code: ${response.status}`);
      const text = await response.text();
      console.error('Response text:', text);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Success response from API:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log(`🔍 Total faculties affected: ${data.details?.facultiesAffected || 'unknown'}`);
    console.log(`🔍 Total courses removed: ${data.details?.coursesRemoved || 'unknown'}`);
    
  } catch (error) {
    console.error('❌ Error executing purge request:', error);
  }
}

// Execute the purge
purgeAllCourses();
