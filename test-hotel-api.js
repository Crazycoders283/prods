import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Testing Hotels API...');

// Test the production endpoint directly
async function testProductionHotelAPI() {
  const searchEndpoint = 'https://jet-set-go-psi.vercel.app/api/hotels/search';
  const searchData = {
    destination: 'PAR',
    checkInDate: '2025-05-29',
    checkOutDate: '2025-06-05',
    travelers: 2
  };
  
  console.log(`\n🔄 Testing search endpoint: ${searchEndpoint}`);
  
  try {
    // Test with GET method and query parameters
    const queryParams = new URLSearchParams();
    Object.entries(searchData).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const url = `${searchEndpoint}?${queryParams.toString()}`;
    console.log(`🔗 URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    const status = response.status;
    console.log(`📊 Status code: ${status}`);
    
    // Try to parse the response
    const data = await response.json();
    console.log('✅ API request successful');
    
    if (data.data && data.data.data && Array.isArray(data.data.data)) {
      console.log(`🏨 Found ${data.data.data.length} hotels`);
      
      // Get the first hotel ID for details testing
      let hotelId = null;
      if (data.data.data.length > 0) {
        console.log('\n🏨 Sample hotel data:');
        console.log(JSON.stringify(data.data.data[0], null, 2).substring(0, 300) + '...');
        
        hotelId = data.data.data[0].hotelId;
        if (hotelId) {
          // Now test the hotel details/booking endpoint
          await testHotelDetails(hotelId);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error testing search endpoint: ${error.message}`);
  }
}

// Test hotel details for a specific hotel ID
async function testHotelDetails(hotelId) {
  if (!hotelId) {
    console.log('⚠️ No hotel ID available for testing details');
    return;
  }
  
  console.log(`\n🔍 Testing Hotel Details API for hotel ID: ${hotelId}`);
  
  // Use the booking endpoint as per the updated components
  const detailsEndpoint = `https://jet-set-go-psi.vercel.app/api/hotels/booking/${hotelId}`;
  
  const params = {
    checkInDate: '2025-05-29',
    checkOutDate: '2025-06-05',
    adults: 2,
    children: 0
  };
  
  try {
    // Convert params to query parameters
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });
    
    const url = `${detailsEndpoint}?${queryParams.toString()}`;
    console.log(`🔗 URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    const status = response.status;
    console.log(`📊 Status code: ${status}`);
    
    if (status === 200) {
      const data = await response.json();
      console.log('✅ Hotel details API request successful');
      
      if (data.data) {
        if (data.data.offers && data.data.offers.length > 0) {
          console.log(`💰 Found ${data.data.offers.length} offers for this hotel`);
          console.log('\nSample offer data:');
          console.log(JSON.stringify(data.data.offers[0], null, 2).substring(0, 300) + '...');
        } else {
          console.log('⚠️ No offers found for this hotel');
        }
      }
    } else {
      let errorText = '';
      try {
        const errorData = await response.text();
        errorText = errorData;
      } catch (e) {
        errorText = 'Could not read error response';
      }
      console.log(`❌ Hotel details API request failed with status ${status}`);
      console.log(`Error details: ${errorText.substring(0, 200)}...`);
    }
  } catch (error) {
    console.error(`❌ Error testing hotel details endpoint: ${error.message}`);
  }
}

// Run the test
testProductionHotelAPI()
  .then(() => console.log('\n✅ All hotel API testing completed'))
  .catch(error => console.error('\n❌ Unhandled error during testing:', error)); 