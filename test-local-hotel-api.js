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

const cityCode = 'NYC';  // New York
const checkInDate = formatDate(futureDate);
const checkOutDate = formatDate(futureCheckOutDate);
const adults = 2;

// Configuration
const LOCAL_API = 'http://localhost:3000/api';

// Test 1: Health check endpoint
async function testHealth() {
  console.log('🏙️ Testing API health...');
  try {
    const response = await axios.get(`${LOCAL_API}/health`);
    console.log('✅ Health endpoint successful');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health endpoint failed:', error.message);
    return false;
  }
}

// Test 2: Destinations endpoint
async function testDestinations() {
  console.log('\n🏙️ Testing destinations endpoint...');
  try {
    const response = await axios.get(`${LOCAL_API}/hotels/destinations`);
    console.log('✅ Destinations endpoint successful');
    console.log('Number of destinations:', response.data.data.length);
    console.log('First 3 destinations:', response.data.data.slice(0, 3));
    return true;
  } catch (error) {
    console.error('❌ Destinations endpoint failed:', error.message);
    return false;
  }
}

// Test 3: Hotel search
async function testHotelSearch() {
  console.log('\n🏨 Testing hotel search endpoint...');
  try {
    console.log(`Search parameters: ${cityCode}, ${checkInDate} to ${checkOutDate}, ${adults} adults`);
    const response = await axios.get(`${LOCAL_API}/hotels/search`, {
      params: {
        destination: cityCode,
        checkInDate,
        checkOutDate,
        travelers: adults
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success) {
      const hotels = response.data.data.data || [];
      console.log(`✅ Hotel search successful. Found ${hotels.length} hotels`);
      
      if (hotels.length > 0) {
        console.log('First hotel:', {
          name: hotels[0].name,
          id: hotels[0].hotelId,
          city: hotels[0].address?.cityName || 'Unknown'
        });
      }
      return {
        success: true,
        hotelId: hotels.length > 0 ? hotels[0].hotelId : null
      };
    } else {
      console.log('⚠️ Search returned success=false:', response.data.message);
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Hotel search failed:', error.response?.data || error.message);
    return { success: false };
  }
}

// Test 4: Hotel availability
async function testAvailability(hotelId) {
  if (!hotelId) {
    console.log('\n🏨 Skipping availability test - no hotel ID available');
    return false;
  }
  
  console.log('\n🏨 Testing availability endpoint...');
  try {
    const response = await axios.get(`${LOCAL_API}/hotels/availability/${hotelId}`, {
      params: {
        checkInDate,
        checkOutDate,
        adults
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    
    if (response.data.success) {
      console.log('✅ Availability check successful');
      const availData = response.data.data;
      
      if (availData && availData.data && availData.data.length > 0) {
        const firstHotel = availData.data[0];
        console.log('Hotel:', firstHotel.hotel.name);
        
        if (firstHotel.offers && firstHotel.offers.length > 0) {
          const offer = firstHotel.offers[0];
          console.log('Price:', offer.price?.total, offer.price?.currency);
          console.log('Room type:', offer.room?.typeEstimated?.category || 'N/A');
        } else {
          console.log('No specific offers available');
        }
      } else {
        console.log('No availability data returned');
      }
      return true;
    } else {
      console.log('⚠️ Availability returned success=false:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Availability check failed:', error.response?.data || error.message);
    return false;
  }
}

// Main function
async function runTests() {
  console.log('🌍 LOCAL API TEST SUITE');
  console.log('===========================');
  console.log(`Testing against: ${LOCAL_API}`);
  console.log(`Date parameters: ${checkInDate} to ${checkOutDate}`);
  console.log('===========================\n');
  
  try {
    // Test health
    const healthResult = await testHealth();
    
    // Test destinations
    const destinationsResult = await testDestinations();
    
    // Test hotel search
    const searchResult = await testHotelSearch();
    
    // Test availability if we have a hotel ID
    const availabilityResult = await testAvailability(searchResult.hotelId);
    
    // Print summary
    console.log('\n===========================');
    console.log('TEST SUMMARY:');
    console.log(`${healthResult ? '✅' : '❌'} Health check: ${healthResult ? 'PASSED' : 'FAILED'}`);
    console.log(`${destinationsResult ? '✅' : '❌'} Destinations: ${destinationsResult ? 'PASSED' : 'FAILED'}`);
    console.log(`${searchResult.success ? '✅' : '❌'} Hotel search: ${searchResult.success ? 'PASSED' : 'FAILED'}`);
    console.log(`${availabilityResult ? '✅' : '❌'} Availability: ${availabilityResult ? 'PASSED' : 'FAILED'}`);
    
    const passCount = [healthResult, destinationsResult, searchResult.success, availabilityResult].filter(Boolean).length;
    console.log(`\n${passCount} of 4 tests passed`);
    console.log('===========================');
  } catch (error) {
    console.error('❌ Test suite failed:', error.message);
    console.error('Is your local server running at ' + LOCAL_API + '?');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 