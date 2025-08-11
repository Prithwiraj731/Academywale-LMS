// Emergency Backend Route Checker and Auto-Fixer
// Add this to your AdminDashboard.jsx if needed

const checkAndUseCorrectEndpoint = async (API_URL) => {
  const possibleEndpoints = [
    '/api/admin/courses/standalone',
    '/api/admin/courses',
    '/api/admin/courses/new'
  ];
  
  for (const endpoint of possibleEndpoints) {
    try {
      const response = await fetch(API_URL + endpoint, { method: 'OPTIONS' });
      if (response.status !== 404) {
        console.log(`✅ Found working endpoint: ${endpoint}`);
        return endpoint;
      }
    } catch (error) {
      console.log(`❌ Endpoint ${endpoint} failed:`, error.message);
    }
  }
  
  throw new Error('No working course creation endpoint found');
};

// Usage in your course creation function:
// const workingEndpoint = await checkAndUseCorrectEndpoint(API_URL);
// const apiEndpoint = API_URL + workingEndpoint;
