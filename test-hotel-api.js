import axios from 'axios';

// Format date as YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get dates for testing
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const dayAfterTomorrow = new Date(tomorrow);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

// Cities to test in order of priority
const testCities = [
  { code: 'BOM', name: 'Mumbai, India' },
  { code: 'DEL', name: 'Delhi, India' },
  { code: 'JFK', name: 'New York (JFK), USA' },
  { code: 'LHR', name: 'London Heathrow, UK' }
];

// Define test parameters with dynamically generated dates
const baseParams = {
  checkInDate: formatDate(tomorrow),
  checkOutDate: formatDate(dayAfterTomorrow),
  travelers: 2
};

// API URL
const API_URL = 'https://jet-set-go-psi.vercel.app/api/hotels/search';

// Test function
const testHotelAPI = async (cityCode, cityName) => {
  const params = { ...baseParams, destination: cityCode };
  
  console.log(`\n----- Testing ${cityName} (${cityCode}) -----`);
  console.log('Request parameters:', params);
  
  try {
    const response = await axios.get(API_URL, { params });
    
    console.log('Response status:', response.status);
    console.log('Success:', response.data.success);
    
    // Check for raw response structure for debugging
    const responseData = response.data;
    console.log('Response data structure:', Object.keys(responseData));
    
    if (responseData.data) {
      console.log('Data structure:', Object.keys(responseData.data));
      
      const hotels = responseData.data.data || [];
      console.log(`\nFound ${hotels.length || 0} hotels`);
      
      if (hotels && hotels.length > 0) {
        console.log('\nFirst 3 hotels:');
        hotels.slice(0, 3).forEach((hotel, index) => {
          console.log(`\n--- Hotel ${index + 1} ---`);
          console.log('Hotel data keys:', Object.keys(hotel));
          console.log('Name:', hotel.name || hotel.hotel?.name || 'N/A');
          console.log('ID:', hotel.hotelId || hotel.id || 'N/A');
          console.log('Rating:', hotel.rating || 'N/A');
          
          // Try to extract price from different possible locations
          let price = 'N/A';
          if (hotel.price) {
            price = typeof hotel.price === 'object' ? hotel.price.total : hotel.price;
          } else if (hotel.offers && hotel.offers.length > 0) {
            price = hotel.offers[0].price?.total || hotel.offers[0].price;
          }
          console.log('Price:', price);
          
          // Try to extract location from different possible fields
          let location = 'N/A';
          if (hotel.address) {
            location = hotel.address.cityName || hotel.address.countryCode;
          } else if (hotel.location) {
            location = hotel.location;
          } else if (hotel.city) {
            location = hotel.city;
          }
          console.log('Location:', location);
        });
        return { success: true, hasData: true };
      } else {
        console.log('No hotel data available in the response');
        return { success: true, hasData: false };
      }
    } else {
      console.log('No data field in the response or it is empty');
      return { success: true, hasData: false };
    }
  } catch (error) {
    console.error('Error testing hotel API:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error message:', error.message);
    }
    return { success: false, hasData: false };
  }
};

// Run tests sequentially
const runTests = async () => {
  console.log('Starting hotel API tests...');
  console.log(`Date Range: ${baseParams.checkInDate} to ${baseParams.checkOutDate} (1-night stay)`);
  
  const results = [];
  
  for (const city of testCities) {
    const result = await testHotelAPI(city.code, city.name);
    results.push({
      city: city.name,
      code: city.code,
      ...result
    });
  }
  
  console.log('\n----- Summary of Results -----');
  results.forEach(result => {
    console.log(`${result.city} (${result.code}): API Success: ${result.success}, Has Hotel Data: ${result.hasData}`);
  });
  
  console.log('\nTests completed.');
};

// Execute tests
runTests(); 