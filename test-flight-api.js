import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test different API URLs
async function testFlightAPI() {
  console.log('🔍 Testing Flight API with multiple endpoints...');
  
  // Define the endpoints to test
  const endpoints = [
    'http://localhost:5001/api/flights/search',                   // Local development
    'http://localhost:5002/api/flights/search',                   // Alternate local port
    'https://jet-set-go-psi.vercel.app/api/flights/search'        // Vercel deployment
  ];
  
  const searchData = {
    from: 'DEL', // Delhi
    to: 'DXB',   // Dubai
    departDate: '2025-05-29',
    returnDate: '', 
    tripType: 'one-way',
    travelers: 1
  };
  
  const results = {};
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    console.log(`\n🚀 Testing endpoint: ${endpoint}`);
    
    try {
      console.log('Request payload:', JSON.stringify(searchData, null, 2));
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(searchData),
        timeout: 10000
      }).catch(err => {
        console.log(`❌ Connection error: ${err.message}`);
        return null;
      });
      
      if (!response) {
        results[endpoint] = { success: false, error: 'Failed to connect' };
        continue;
      }
      
      console.log(`📥 Response status: ${response.status}`);
      
      const contentType = response.headers.get('content-type');
      console.log(`📄 Content-Type: ${contentType}`);
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('❌ Non-JSON response:', text.substring(0, 200) + (text.length > 200 ? '...' : ''));
        results[endpoint] = { success: false, error: 'Non-JSON response' };
        continue;
      }
      
      const data = await response.json();
      
      if (data.success === false) {
        console.log('❌ API returned error:', data.error);
        results[endpoint] = { success: false, error: data.error };
        continue;
      }
      
      console.log('✅ API returned successful response');
      
      if (data.data && data.data.length > 0) {
        console.log(`✅ Found ${data.data.length} flights`);
        const firstFlight = data.data[0];
        console.log('📊 Sample flight data:');
        console.log(`- Flight ID: ${firstFlight.id}`);
        console.log(`- Price: ${firstFlight.price?.total} ${firstFlight.price?.currency}`);
        console.log(`- Departure: ${firstFlight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode} at ${firstFlight.itineraries?.[0]?.segments?.[0]?.departure?.at}`);
        console.log(`- Arrival: ${firstFlight.itineraries?.[0]?.segments?.[0]?.arrival?.iataCode} at ${firstFlight.itineraries?.[0]?.segments?.[0]?.arrival?.at}`);
        
        results[endpoint] = { 
          success: true, 
          flightCount: data.data.length 
        };
      } else {
        console.log('⚠️ No flights found in the response');
        results[endpoint] = { 
          success: true, 
          flightCount: 0 
        };
      }
    } catch (error) {
      console.error('❌ Error during test:', error.message);
      results[endpoint] = { success: false, error: error.message };
    }
  }
  
  // Summary of results
  console.log('\n🏁 Test Results Summary:');
  for (const [endpoint, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`✅ ${endpoint}: SUCCESS (${result.flightCount} flights found)`);
    } else {
      console.log(`❌ ${endpoint}: FAILED (${result.error})`);
    }
  }
}

// Run the test
testFlightAPI(); 