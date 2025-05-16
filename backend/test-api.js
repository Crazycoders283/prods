import axios from 'axios';

const API_URL = 'http://localhost:9999/api';

// Function to test API endpoints
async function testAPI() {
  try {
    console.log('Testing API endpoints...');
    
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('Health check response:', healthResponse.data);
    
    // Test user registration
    console.log('\n2. Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
      password: 'password123'
    };
    
    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('Registration successful:', registerResponse.data);
      
      const token = registerResponse.data.token;
      const userId = registerResponse.data.user.id;
      
      // Test login
      console.log('\n3. Testing login...');
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('Login successful:', loginResponse.data);
      
      // Test get current user
      console.log('\n4. Testing get current user...');
      const userResponse = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Current user data:', userResponse.data);
      
      // Test update user
      console.log('\n5. Testing update user...');
      const updateResponse = await axios.put(`${API_URL}/users/${userId}`, 
        { name: 'Updated Test User' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('User update response:', updateResponse.data);
      
    } catch (error) {
      console.error('API test error:', error.response ? error.response.data : error.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run tests
testAPI(); 