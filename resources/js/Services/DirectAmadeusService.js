// Direct Amadeus Service
// This service connects to our Amadeus proxy server to get real hotel data
// when our production API returns empty results

import axios from 'axios';
import * as amadeusUtils from '../Pages/Common/rentals/amadeusUtils';

// Production API URL from environment variables
const PRODUCTION_API_URL = import.meta.env.VITE_APP_URL || 'https://jet-set-go-psi.vercel.app/api';

// Amadeus proxy server URL (local for development, deployed path for production)
const IS_PROD = import.meta.env.PROD;
const BASE_URL = IS_PROD ? '' : 'http://localhost:3030';
// In development: use the root path of local proxy, in production: use the /amadeus-proxy path
const PROXY_API_URL = IS_PROD ? '/amadeus-proxy' : BASE_URL;

// For debugging
console.log('Environment:', IS_PROD ? 'Production' : 'Development');
console.log('Using proxy URL:', PROXY_API_URL);

// API endpoints
const ENDPOINTS = {
  // Production API endpoints
  DESTINATIONS: '/hotels/destinations',
  MOCK_SEARCH: '/hotels/mock-search',
  
  // Proxy server endpoints for real Amadeus data (match the routes in amadeus-proxy.js)
  HOTELS_SEARCH: '/hotels/search',
  HOTEL_OFFERS: '/hotels/offers'
};

// Get city info for a given city code
async function getCityInfo(cityCode) {
  try {
    // Get city info from the destinations endpoint
    const response = await axios.get(`${PRODUCTION_API_URL}${ENDPOINTS.DESTINATIONS}`);
    if (response.data.success) {
      const cities = response.data.data;
      const cityInfo = cities.find(city => city.code === cityCode);
      if (cityInfo) {
        return cityInfo;
      }
    }
    
    // Fallback city data if API doesn't have it
    const fallbackCities = {
      'NYC': { name: 'New York', country: 'United States' },
      'LON': { name: 'London', country: 'United Kingdom' },
      'PAR': { name: 'Paris', country: 'France' },
      'ROM': { name: 'Rome', country: 'Italy' },
      'TYO': { name: 'Tokyo', country: 'Japan' }
    };
    
    return fallbackCities[cityCode] || { name: cityCode, country: 'Unknown' };
  } catch (error) {
    console.error('Failed to get city info:', error.message);
    return { name: cityCode, country: 'Unknown' };
  }
}

// Get real hotel data via the proxy server
async function searchHotels(cityCode, checkInDate, checkOutDate, adults = 2) {
  try {
    console.log(`Searching real hotels for ${cityCode} via proxy server...`);
    
    // Step 1: Get hotels via our proxy (which calls Amadeus)
    const response = await axios.get(`${PROXY_API_URL}${ENDPOINTS.HOTELS_SEARCH}`, {
      params: {
        destination: cityCode,
        checkInDate,
        checkOutDate,
        travelers: adults,
        radius: 20,
        radiusUnit: 'KM'
      }
    });
    
    if (!response.data.success || !response.data.data?.data) {
      console.error('Proxy server returned unsuccessful response');
      throw new Error('Proxy server error');
    }
    
    const hotels = response.data.data.data || [];
    console.log(`Proxy returned ${hotels.length} hotels from Amadeus API`);
    
    if (hotels.length === 0) {
      console.log('No hotels found via proxy, falling back to production API');
      throw new Error('No hotels found');
    }
    
    // Filter out test properties and prioritize real hotels
    const cityInfo = await getCityInfo(cityCode);
    const prioritizedHotels = amadeusUtils.prioritizeHotels(hotels);
    
    // Format hotel data to match our application structure
    const formattedHotels = prioritizedHotels.slice(0, 15).map(hotel => {
      // Add placeholder image if none provided
      const hotelImages = [`https://source.unsplash.com/random/300x200/?hotel,${hotel.hotelId || Math.random()}`];
      
      // Add amenities since they're not provided by Amadeus hotel search
      const defaultAmenities = ['WiFi', 'Room Service', 'Restaurant'];
      
      return amadeusUtils.formatHotelData({
        ...hotel,
        // Add necessary details
        cityCode,
        cityName: cityInfo.name,
        images: hotelImages,
        amenities: defaultAmenities,
        // Use hotel ID for room offers later
        hotelId: hotel.hotelId
      }, cityCode);
    });
    
    return formattedHotels;
  } catch (error) {
    console.error('Error getting hotels via proxy:', error.message);
    
    // Directly generate hotel placeholders instead of trying more API calls that might fail
    console.log('Generating local placeholder hotels for', cityCode);
    const cityInfo = await getCityInfo(cityCode);
    
    // Hotel name templates based on city
    const hotelNames = [
      `${cityInfo.name} Grand Hotel`,
      `${cityInfo.name} Plaza Resort`,
      `Royal ${cityInfo.name} Hotel`,
      `${cityInfo.name} Luxury Suites`,
      `${cityInfo.name} Executive Inn`,
      `${cityInfo.name} Palace Hotel`,
      `${cityInfo.name} Continental`,
      `${cityInfo.name} International`
    ];
    
    // Hotel images (high quality hotel images)
    const images = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1470&q=80'
    ];
    
    // Create realistic amenities combinations
    const amenities = [
      ['WiFi', 'Room Service', 'Restaurant'],
      ['WiFi', 'Pool', 'Fitness Center'],
      ['WiFi', 'Breakfast', 'Parking'],
      ['WiFi', 'Spa', 'Bar'],
      ['WiFi', 'Airport Shuttle', 'Conference Room']
    ];
    
    // Generate 5-8 hotels with realistic placeholder data
    const count = Math.floor(Math.random() * 4) + 5;
    const mockHotels = Array.from({length: Math.min(count, hotelNames.length)}, (_, i) => ({
      id: `${cityCode.toLowerCase()}-${i}`,
      name: hotelNames[i],
      location: `${cityInfo.name}, ${cityInfo.country}`,
      price: (Math.random() * 300 + 100).toFixed(2),
      currency: 'USD',
      rating: (Math.random() * 1 + 4).toFixed(1),
      image: images[i % images.length],
      images: [images[i % images.length]],
      amenities: amenities[i % amenities.length],
      address: {
        cityName: cityInfo.name,
        countryCode: cityInfo.country
      }
    }));
    
    console.log(`Generated ${mockHotels.length} placeholder hotels`);
    return mockHotels;
  }
}

// Get real hotel offers via the proxy server
async function getHotelOffers(hotelId, checkInDate, checkOutDate, adults = 2) {
  try {
    console.log(`Getting real offers for hotel ${hotelId} via proxy server...`);
    
    // Call our proxy server to get real hotel offers from Amadeus
    const response = await axios.get(`${PROXY_API_URL}${ENDPOINTS.HOTEL_OFFERS}/${hotelId}`, {
      params: {
        checkInDate,
        checkOutDate,
        adults,
        roomQuantity: 1,
        currency: 'USD',
        bestRateOnly: true
      }
    });
    
    if (!response.data.success) {
      console.error('Proxy server returned unsuccessful response for offers');
      throw new Error('Proxy server error');
    }
    
    const offers = response.data.data.offers || [];
    console.log(`Proxy returned ${offers.length} offers for hotel ${hotelId}`);
    
    return offers;
  } catch (error) {
    console.error('Error getting hotel offers via proxy:', error.message);
    
    // Generate fallback offers if real offers can't be fetched
    console.log('Generating fallback offers...');
    
    // Calculate number of nights
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const nights = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Base price per night (random between $100 and $400)
    const basePrice = Math.floor(Math.random() * 300) + 100;
    
    // Generate room types
    const roomTypes = ['STANDARD_ROOM', 'DELUXE_ROOM', 'EXECUTIVE_ROOM', 'SUITE'];
    const boardTypes = ['ROOM_ONLY', 'BREAKFAST_INCLUDED', 'HALF_BOARD', 'FULL_BOARD'];
    
    // Generate 3-5 offers with different room types
    const offerCount = Math.floor(Math.random() * 3) + 3;
    const fallbackOffers = Array.from({length: offerCount}, (_, i) => ({
      id: `offer-${hotelId}-${i}`,
      roomType: roomTypes[i % roomTypes.length],
      boardType: boardTypes[Math.floor(Math.random() * boardTypes.length)],
      price: {
        total: (basePrice * (1 + (i * 0.2)) * nights).toFixed(2),
        currency: 'USD',
        base: (basePrice * (1 + (i * 0.2))).toFixed(2),
        taxes: ((basePrice * (1 + (i * 0.2)) * nights) * 0.1).toFixed(2)
      },
      cancellable: Math.random() > 0.3,
      room: {
        type: roomTypes[i % roomTypes.length],
        typeEstimated: {
          category: roomTypes[i % roomTypes.length],
          beds: i < 2 ? 1 : 2,
          bedType: i < 2 ? 'KING' : 'TWIN'
        },
        description: {
          text: `Spacious ${roomTypes[i % roomTypes.length].replace('_', ' ').toLowerCase()} with all amenities.`
        }
      }
    }));
    
    return fallbackOffers;
  }
}

export default {
  searchHotels,
  getHotelOffers
};
