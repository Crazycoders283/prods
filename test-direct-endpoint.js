import axios from 'axios';

// Base API URL
const BASE_URL = 'http://localhost:5000/api';

// City codes to test
const testCities = [
  { code: 'BOM', name: 'Mumbai, India' },
  { code: 'DEL', name: 'Delhi, India' }
];

// Test the direct-search endpoint
const testDirectSearch = async (cityCode, cityName) => {
  try {
    console.log(`\n----- Testing direct-search for ${cityName} (${cityCode}) -----`);
    
    const response = await axios.get(`${BASE_URL}/hotels/direct-search`, {
      params: { cityCode }
    });
    
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.data && response.data.data.data) {
      const hotels = response.data.data.data;
      console.log(`Found ${hotels.length} hotels`);
      
      if (hotels.length > 0) {
        console.log('First 3 hotels:');
        hotels.slice(0, 3).forEach((hotel, i) => {
          console.log(`  ${i+1}. ${hotel.name || 'N/A'} (ID: ${hotel.hotelId})`);
        });
      }
    } else {
      console.log('No hotels found in response');
    }
  } catch (error) {
    console.error(`Error testing direct-search for ${cityName}:`);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Test the hotel /test endpoint
const testHotelTest = async () => {
  try {
    console.log('\n----- Testing /api/hotels/test endpoint -----');
    
    const response = await axios.get(`${BASE_URL}/hotels/test`);
    
    console.log('Response status:', response.status);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error testing hotel test endpoint:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

// Run the tests
const runTests = async () => {
  console.log('Starting direct endpoint tests for the local server');
  
  // First test the basic test endpoint
  await testHotelTest();
  
  // Then test direct search for each city
  for (const city of testCities) {
    await testDirectSearch(city.code, city.name);
  }
  
  console.log('\nAll tests completed');
};

// Execute the tests
runTests(); 