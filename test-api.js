// Using Node.js built-in fetch API

// Get API URL from environment or default to localhost
const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Test backend health endpoint
async function testBackendHealth() {
  try {
    console.log('Testing backend health endpoint...');
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log('✅ Backend health check successful:', data);
    return true;
  } catch (error) {
    console.error('❌ Backend health check failed:', error.message);
    return false;
  }
}

// Test misinformation analysis endpoint with a sample query
async function testMisinfoAnalysis() {
  try {
    console.log('\nTesting misinformation analysis endpoint...');
    const testQuery = {
      content: "The government is planning to ban all social media platforms starting next month.",
      type: "text"
    };
    
    const response = await fetch(`${API_URL}/api/misinfo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testQuery)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Misinformation analysis API call successful');
    console.log('Credibility Score:', data.score);
    console.log('Red Flags:', data.redFlags.join(', ') || 'None');
    console.log('Trusted Sources:', data.trustedSources.join(', '));
    console.log('\nProject Status Summary:');
    console.log('Backend API is working correctly');
    console.log(`Frontend is running on ${FRONTEND_URL}`);
    console.log(`Backend is running on ${API_URL}`);
    console.log('\nTo use the application:');
    console.log(`1. Open your browser and go to ${FRONTEND_URL}`);
    console.log('2. Use the text, URL, or image input to analyze content');
    console.log('3. View the credibility score and detailed analysis');
    console.log('\nNote: You may need to add your Google API key to the .env file in the backend directory for full functionality.');
    return true;
  } catch (error) {
    console.error('❌ Misinformation analysis failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Ensure the Google API key is set in backend/.env');
    console.log('2. Check if the backend server is running correctly');
    console.log('3. Verify network connectivity between frontend and backend');
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('=== Honest Eye Project Test ===\n');
  const healthOk = await testBackendHealth();
  if (healthOk) {
    await testMisinfoAnalysis();
  }
  console.log('\n=== Test Complete ===');
}

runTests();