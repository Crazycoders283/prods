import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_URL = process.env.VITE_API_URL || 'https://prod-six-phi.vercel.app/api';

async function testApiEndpoints() {
  console.log('Testing API connection to:', API_URL);
  
  try {
    // Test health endpoint
    console.log('\n🔍 Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health endpoint response:', healthResponse.data);
  } catch (error) {
    console.error('❌ Health endpoint error:', error.response?.data || error.message);
  }

  try {
    // Test Amadeus connection
    console.log('\n🔍 Testing Amadeus connection...');
    const testResponse = await axios.get(`${API_URL}/test`);
    console.log('✅ Test endpoint response:', testResponse.data);
  } catch (error) {
    console.error('❌ Test endpoint error:', error.response?.data || error.message);
  }

  try {
    // Test Supabase connection
    console.log('\n🔍 Testing Supabase connection...');
    const response = await axios.get(`${API_URL}/users/test-db`);
    console.log('✅ Supabase connection response:', response.data);
  } catch (error) {
    console.error('❌ Supabase connection error:', error.response?.data || error.message);
    
    // Log detailed error information
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
      console.log('Data:', error.response.data);
    }
  }
}

testApiEndpoints();
