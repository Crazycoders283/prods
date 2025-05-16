import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Test flight search API
async function testFlightSearchAPI() {
  console.log('🔍 Testing Flight Search API');
  
  const searchData = {
    from: 'DEL',
    to: 'BLR',
    departDate: '2025-05-23',
    travelers: 1,
    tripType: 'oneWay'
  };
  
  console.log(`📤 Sending request to ${API_URL}/flights/search with data:`, searchData);
  
  try {
    const response = await fetch(`${API_URL}/flights/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(searchData)
    });
    
    const contentType = response.headers.get('content-type');
    console.log(`📥 Response status: ${response.status}, Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ API returned non-JSON response:', text);
      return false;
    }
    
    const data = await response.json();
    
    if (!data.success) {
      console.error('❌ API returned error:', data.error);
      return false;
    }
    
    console.log('✅ API returned successful response');
    console.log(`✅ Found ${data.data.length} flights`);
    
    if (data.data.length > 0) {
      const firstFlight = data.data[0];
      console.log('📊 Sample flight data:');
      console.log(`- Flight ID: ${firstFlight.id}`);
      console.log(`- Price: ${firstFlight.price?.total} ${firstFlight.price?.currency}`);
      console.log(`- Departure: ${firstFlight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} at ${firstFlight.itineraries?.[0]?.segments?.[0]?.departure?.at}`);
      console.log(`- Arrival: ${firstFlight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode} at ${firstFlight.itineraries?.[0]?.segments?.[0]?.arrival?.at}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing flight search API:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API tests...');
  
  // Test the flight search API
  const flightSearchResult = await testFlightSearchAPI();
  
  console.log('\n🏁 Test Results:');
  console.log(`Flight Search API: ${flightSearchResult ? '✅ PASS' : '❌ FAIL'}`);
  
  process.exit(flightSearchResult ? 0 : 1);
}

runTests(); 