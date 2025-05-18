#!/usr/bin/env node

import axios from 'axios';

// Test configuration
const LOCAL_API_URL = 'http://localhost:5002/api';
const PROD_API_URL = 'https://jet-set-go-psi.vercel.app/api';

// Choose which API to test
const API_URL = LOCAL_API_URL;

// Helper to format dates as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Test parameters with dynamic dates 30 days in the future
const today = new Date();
const futureDate = new Date(today);
futureDate.setDate(today.getDate() + 30);

const futureCheckOutDate = new Date(futureDate);
futureCheckOutDate.setDate(futureDate.getDate() + 3);

const checkInDate = formatDate(futureDate);
const checkOutDate = formatDate(futureCheckOutDate);
const adults = 2;

// Test cities
const cityCodes = ['LON', 'PAR', 'NYC', 'SIN', 'DXB'];

// Test function for hotel search
async function testHotelSearch(cityCode) {
  try {
    console.log(`\n🔍 Testing hotel search for ${cityCode}...`);
    console.log(`Check-in: ${checkInDate}, Check-out: ${checkOutDate}, Adults: ${adults}`);
    
    const response = await axios.get(`${API_URL}/hotels/search`, {
      params: {
        destination: cityCode,
        checkInDate,
        checkOutDate,
        travelers: adults
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.data.success) {
      const hotels = response.data.data?.hotels || [];
      console.log(`✅ Success! Found ${hotels.length} hotels in ${cityCode}`);
      
      if (hotels.length > 0) {
        console.log('\nSample hotel data:');
        console.log(JSON.stringify(hotels[0], null, 2));
      } else {
        console.warn('⚠️ No hotels returned in the response');
      }
      
      // Verify the response format
      console.log('\nResponse structure:');
      console.log(`- success: ${response.data.success}`);
      console.log(`- data.hotels exists: ${!!response.data.data?.hotels}`);
      console.log(`- data.hotels is array: ${Array.isArray(response.data.data?.hotels)}`);
      
      return hotels.length;
    } else {
      console.error(`❌ API returned error: ${response.data.message}`);
      return 0;
    }
  } catch (error) {
    console.error(`❌ Request failed for ${cityCode}:`, error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data);
    }
    return 0;
  }
}

// Main test function
async function runTests() {
  console.log(`🏨 HOTEL API TEST`);
  console.log(`=================`);
  console.log(`API URL: ${API_URL}`);
  console.log(`=================\n`);
  
  let totalHotels = 0;
  let successfulCities = 0;
  
  for (const cityCode of cityCodes) {
    const hotelCount = await testHotelSearch(cityCode);
    totalHotels += hotelCount;
    if (hotelCount > 0) successfulCities++;
  }
  
  console.log(`\n=================`);
  console.log(`TEST SUMMARY:`);
  console.log(`✅ Cities with hotels: ${successfulCities}/${cityCodes.length}`);
  console.log(`✅ Total hotels found: ${totalHotels}`);
  console.log(`=================`);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 