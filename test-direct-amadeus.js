#!/usr/bin/env node

import axios from 'axios';

// Amadeus API credentials
const API_KEY = 'ZsgV43XBz0GbNk85zQuzvWnhARwXX4IE';
const API_SECRET = '2uFgpTVo5GA4ytwq';

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

// Get Amadeus API access token
async function getAccessToken() {
  try {
    console.log('Getting Amadeus access token...');
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: API_KEY,
          password: API_SECRET,
        }
      }
    );
    console.log('✅ Successfully obtained access token');
    return response.data.access_token;
  } catch (error) {
    console.error('❌ Failed to get access token:', error.response?.data || error.message);
    throw new Error('Could not generate access token');
  }
}

// Get hotels in a city
async function getHotelsInCity(token, cityCode) {
  try {
    console.log(`\n🏨 Getting hotels in ${cityCode}...`);
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        cityCode: cityCode,
        radius: 20,
        radiusUnit: 'KM',
        hotelSource: 'ALL'
      }
    });
    
    const hotels = response.data.data || [];
    console.log(`✅ Found ${hotels.length} hotels in ${cityCode}`);
    
    if (hotels.length > 0) {
      console.log('First 3 hotels:');
      hotels.slice(0, 3).forEach((hotel, i) => {
        console.log(`  ${i+1}. ${hotel.name} (${hotel.hotelId}), ${hotel.address?.cityName || 'Unknown city'}`);
      });
    }
    
    return hotels;
  } catch (error) {
    console.error(`❌ Error getting hotels in ${cityCode}:`, error.response?.data || error.message);
    return [];
  }
}

// Check hotel availability
async function checkHotelAvailability(token, hotelIds, checkInDate, checkOutDate, adults) {
  try {
    console.log(`\n🏨 Checking availability for ${hotelIds.length} hotels...`);
    const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.amadeus+json'
      },
      params: {
        hotelIds: hotelIds.join(','),
        checkInDate,
        checkOutDate,
        adults,
        roomQuantity: 1,
        currency: 'USD',
        bestRateOnly: true
      }
    });
    
    const availableHotels = response.data.data || [];
    console.log(`✅ Found ${availableHotels.length} hotels with availability`);
    
    if (availableHotels.length > 0) {
      console.log('First 3 available hotels:');
      availableHotels.slice(0, 3).forEach((hotel, i) => {
        const price = hotel.offers?.[0]?.price?.total || 'N/A';
        console.log(`  ${i+1}. ${hotel.hotel.name} - $${price} per night`);
      });
    }
    
    return availableHotels;
  } catch (error) {
    console.error(`❌ Error checking availability:`, error.response?.data || error.message);
    return [];
  }
}

// Main function
async function testDirectAmadeusApi() {
  console.log('🏨 DIRECT AMADEUS API TEST');
  console.log('=========================');
  console.log(`Testing with credentials: ${API_KEY.substring(0, 5)}...`);
  console.log(`Parameters: City=${cityCode}, Dates=${checkInDate} to ${checkOutDate}, Adults=${adults}`);
  console.log('=========================\n');
  
  try {
    // Get access token
    const token = await getAccessToken();
    
    // Test cities
    const cities = ['LON', 'PAR', 'NYC'];
    let allHotels = [];
    
    // Get hotels in multiple cities
    for (const city of cities) {
      const hotels = await getHotelsInCity(token, city);
      allHotels = allHotels.concat(hotels);
    }
    
    if (allHotels.length === 0) {
      console.log('\n❌ No hotels found in any cities. Cannot test availability.');
      return;
    }
    
    // Take first 5 hotels for availability check
    const selectedHotels = allHotels.slice(0, 5).map(h => h.hotelId);
    
    // Check availability
    const availableHotels = await checkHotelAvailability(
      token,
      selectedHotels,
      checkInDate,
      checkOutDate,
      adults
    );
    
    console.log('\n=========================');
    console.log('TEST SUMMARY:');
    console.log(`✅ Access Token: Success`);
    console.log(`✅ Hotel Search: Found ${allHotels.length} hotels in ${cities.join(', ')}`);
    console.log(`${availableHotels.length > 0 ? '✅' : '⚠️'} Availability: Found ${availableHotels.length} hotels with availability`);
    console.log('=========================');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testDirectAmadeusApi().catch(error => {
  console.error('Error running direct Amadeus test:', error);
}); 