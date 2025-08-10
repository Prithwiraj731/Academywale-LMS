// Test script for institute bulk insert
// This can be run in the browser console or in a Node.js environment

const API_URL = 'http://localhost:5000';

async function testBulkInsert() {
    try {
        console.log('🚀 Starting bulk insert of institutes...');
        
        const response = await fetch(`${API_URL}/api/admin/institutes/bulk-insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Bulk insert successful!');
            console.log('📊 Response:', data);
            console.log(`📚 ${data.institutes.length} institutes inserted`);
            
            // Now test the get institutes endpoint
            console.log('\n🔍 Testing get institutes endpoint...');
            const getResponse = await fetch(`${API_URL}/api/institutes`);
            const getResult = await getResponse.json();
            
            console.log('📋 Current institutes:', getResult);
            
            return data;
        } else {
            console.error('❌ Bulk insert failed:', data);
            return null;
        }
    } catch (error) {
        console.error('🚨 Error during bulk insert:', error);
        return null;
    }
}

async function testGetInstitutes() {
    try {
        console.log('🔍 Fetching institutes from API...');
        
        const response = await fetch(`${API_URL}/api/institutes`);
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Get institutes successful!');
            console.log('📊 Response:', data);
            console.log(`📚 Found ${data.institutes.length} institutes`);
            
            if (data.institutes.length > 0) {
                console.log('🏫 Sample institute:', data.institutes[0]);
            }
            
            return data.institutes;
        } else {
            console.error('❌ Get institutes failed:', data);
            return null;
        }
    } catch (error) {
        console.error('🚨 Error fetching institutes:', error);
        return null;
    }
}

// Export functions for use in Node.js or browser
if (typeof window !== 'undefined') {
    // Browser environment
    window.testBulkInsert = testBulkInsert;
    window.testGetInstitutes = testGetInstitutes;
} else if (typeof module !== 'undefined') {
    // Node.js environment
    module.exports = { testBulkInsert, testGetInstitutes };
}

console.log('🛠️ Test functions loaded. Use testBulkInsert() or testGetInstitutes() to test the API.');
