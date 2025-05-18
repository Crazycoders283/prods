import fetch from 'node-fetch';

const API_URL = 'http://localhost:5001/api';
let authToken;

async function testAPI() {
  try {
    // Test registration
    console.log('\n1. Testing registration...');
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);

    // Test login
    console.log('\n2. Testing login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginData.token) {
      authToken = loginData.token;

      // Test get profile
      console.log('\n3. Testing get profile...');
      const profileResponse = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const profileData = await profileResponse.json();
      console.log('Profile response:', profileData);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the tests
testAPI(); 