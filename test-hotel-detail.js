#!/usr/bin/env node

import axios from 'axios';

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

// Configuration - test both local and production
const API_URLS = [
  'http://localhost:5003/api', // Note: Local server is on port 5003 as seen in logs
  'https://jet-set-go-psi.vercel.app/api'
];

// Test hotel IDs from the major cities
const TEST_HOTELS = [
  { id: 'ALNYC647', city: 'NYC' }, // New York
  { id: 'ICSINICA', city: 'SIN' }, // Singapore
  { id: 'EDLONDER', city: 'LON' }  // London
];

// Test hotel offers endpoint
async function testHotelOffers(apiUrl, hotelId) {
  console.log(`\n🏨 Testing hotel offers for ${hotelId}...`);
  try {
    const response = await axios.get(`${apiUrl}/hotels/offers/${hotelId}`, {
      params: {
        checkInDate,
        checkOutDate,
        adults
      }
    });
    
    if (response.data.success) {
      console.log('✅ Hotel offers endpoint successful');
      const data = response.data.data;
      
      console.log('Hotel ID:', hotelId);
      if (data.offers && data.offers.length > 0) {
        console.log(`Found ${data.offers.length} offers`);
        console.log('First offer:', {
          price: data.offers[0].price?.total,
          currency: data.offers[0].price?.currency,
          rateCode: data.offers[0].rateCode
        });
        
        // Verify the expected data structure exists
        const hasExpectedProps = 
          data.offers[0].price && 
          data.offers[0].guests && 
          data.offers[0].policies;
          
        console.log('Has expected properties:', hasExpectedProps);
        return true;
      } else {
        console.log('⚠️ No offers found for this hotel');
        return false;
      }
    } else {
      console.log('⚠️ API returned success=false:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Hotel offers request failed:', error.response?.data?.message || error.message);
    return false;
  }
}

// Main function to run tests
async function runTests() {
  console.log('🏨 HOTEL DETAIL TEST');
  console.log('===================');
  
  let testResults = [];
  
  // Test each API URL
  for (const apiUrl of API_URLS) {
    console.log(`\nTesting API: ${apiUrl}`);
    console.log('===================');
    
    // Test each hotel
    for (const hotel of TEST_HOTELS) {
      const result = await testHotelOffers(apiUrl, hotel.id);
      testResults.push({
        apiUrl,
        hotelId: hotel.id,
        city: hotel.city,
        success: result
      });
    }
  }
  
  // Print summary
  console.log('\n===================');
  console.log('TEST SUMMARY:');
  
  for (const result of testResults) {
    console.log(`${result.success ? '✅' : '❌'} ${result.apiUrl} - ${result.city} (${result.hotelId}): ${result.success ? 'PASSED' : 'FAILED'}`);
  }
  
  const passCount = testResults.filter(r => r.success).length;
  const totalTests = testResults.length;
  console.log(`\n${passCount}/${totalTests} tests passed`);
  console.log('===================');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 