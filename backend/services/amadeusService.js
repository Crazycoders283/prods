import axios from 'axios';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

class AmadeusService {
  constructor() {
    // Use test API endpoints since your credentials are for the test environment
    this.baseUrls = {
      v1: 'https://test.api.amadeus.com/v1',
      v2: 'https://test.api.amadeus.com/v2',
      v3: 'https://test.api.amadeus.com/v3'
    };
    this.token = null;
    this.tokenExpiration = null;
  }

  async getAccessToken() {
    // Check if we have a valid token
    if (this.token && this.tokenExpiration && new Date() < this.tokenExpiration) {
      return this.token;
    }

    try {
      // Use updated API keys for Amadeus
      // Try three different sources to find valid credentials
      let apiKey = process.env.AMADEUS_API_KEY || process.env.REACT_APP_AMADEUS_API_KEY;
      let apiSecret = process.env.AMADEUS_API_SECRET || process.env.REACT_APP_AMADEUS_API_SECRET;
      
      // Log which keys we're going to use
      console.log('Amadeus API credentials being used:', {
        keySource: process.env.AMADEUS_API_KEY ? 'AMADEUS_API_KEY' : 
                 (process.env.REACT_APP_AMADEUS_API_KEY ? 'REACT_APP_AMADEUS_API_KEY' : 'none'),
        secretSource: process.env.AMADEUS_API_SECRET ? 'AMADEUS_API_SECRET' : 
                    (process.env.REACT_APP_AMADEUS_API_SECRET ? 'REACT_APP_AMADEUS_API_SECRET' : 'none'),
        keyFirstChars: apiKey ? apiKey.substring(0, 5) + '...' : 'undefined',
        secretLength: apiSecret ? apiSecret.length : 0
      });
      
      // Check if credentials are available
      if (!apiKey || !apiSecret) {
        console.error('ERROR: Missing Amadeus API credentials in environment variables');
        throw new Error('Missing Amadeus API credentials');
      }
      
      // Use URLSearchParams for proper encoding
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', apiKey);
      params.append('client_secret', apiSecret);
      
      console.log('Attempting Amadeus authentication with credentials...');
      
      const response = await axios.post(
        `${this.baseUrls.v1}/security/oauth2/token`, 
        params.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.token = response.data.access_token;
      // Set token expiration to 29 minutes from now (tokens typically expire in 30 minutes)
      this.tokenExpiration = new Date(Date.now() + 29 * 60 * 1000);
      
      console.log('✅ Successfully obtained Amadeus token');
      return this.token;
    } catch (error) {
      console.error('❌ Error getting Amadeus access token:', error.response?.data || error.message);
      if (error.response?.data) {
        console.error('Detailed error information:', JSON.stringify(error.response.data, null, 2));
      }
      throw error;
    }
  }

  // Filter out test properties and prioritize real hotels
  prioritizeHotels(hotels, limit = 20) {
    if (!hotels || hotels.length === 0) return [];
    
    // Define priority scoring function
    const getPriority = (hotel) => {
      const name = hotel.name?.toUpperCase() || '';
      
      // Skip likely test properties
      if (name.includes('TEST PROPERTY') || name.includes('TEST HOTEL') || name.includes('SYNSIX')) {
        return -1;
      }
      
      let score = 0;
      
      // Prioritize actual hotels
      if (name.includes('HOTEL')) score += 3;
      if (name.includes('HILTON') || name.includes('MARRIOTT') || name.includes('HYATT')) score += 5;
      
      return score;
    };
    
    // Score, filter and sort hotels
    return hotels
      .map(hotel => ({ ...hotel, priority: getPriority(hotel) }))
      .filter(hotel => hotel.priority >= 0)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit);
  }

  async searchHotels(params) {
    try {
      const token = await this.getAccessToken();
      
      // First, get hotels in the city using v1 endpoint
      const hotelListResponse = await axios.get(`${this.baseUrls.v1}/reference-data/locations/hotels/by-city`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          cityCode: params.cityCode,
          radius: params.radius || 20,
          radiusUnit: 'KM',
          hotelSource: 'ALL'
        }
      });
      
      console.log(`Found ${hotelListResponse.data.data?.length || 0} hotels in ${params.cityCode}`);
      
      // If we don't need to check availability, return hotel list
      if (!params.checkInDate || !params.checkOutDate) {
        return hotelListResponse.data;
      }
      
      // If no hotels found, return empty results
      if (!hotelListResponse.data.data || hotelListResponse.data.data.length === 0) {
        return { data: [] };
      }
      
      // Filter and prioritize hotels
      const prioritizedHotels = this.prioritizeHotels(hotelListResponse.data.data);
      console.log(`Prioritized ${prioritizedHotels.length} best hotels (excluding test properties)`);
      
      // If no suitable hotels found after filtering, use the full list
      const hotelsToCheck = prioritizedHotels.length > 0 ? prioritizedHotels : hotelListResponse.data.data;
      
      // Get the first 5 hotel IDs to check availability
      const hotelIds = hotelsToCheck.slice(0, 5).map(hotel => hotel.hotelId);
      
      try {
        // Try to check availability using v3 endpoint
        const availabilityResponse = await axios.get(`${this.baseUrls.v3}/shopping/hotel-offers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.amadeus+json'
          },
          params: {
            hotelIds: hotelIds.join(','),
            checkInDate: params.checkInDate,
            checkOutDate: params.checkOutDate,
            adults: params.adults || 2,
            roomQuantity: 1,
            currency: 'USD',
            bestRateOnly: true
          }
        });
        
        console.log(`Found ${availabilityResponse.data.data?.length || 0} hotels with availability`);
        
        // Return the combined results
        return {
          ...availabilityResponse.data,
          hotels: hotelListResponse.data.data
        };
      } catch (availabilityError) {
        console.warn('Could not check availability, returning hotel list only:', availabilityError.message);
        
        // If availability check fails, try with fallback hotel ID
        try {
          console.log('Trying with fallback hotel ID: EDLONDER');
          const fallbackResponse = await axios.get(`${this.baseUrls.v3}/shopping/hotel-offers`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/vnd.amadeus+json'
            },
            params: {
              hotelIds: 'EDLONDER',
              checkInDate: params.checkInDate,
              checkOutDate: params.checkOutDate,
              adults: params.adults || 2,
              roomQuantity: 1,
              currency: 'USD',
              bestRateOnly: true
            }
          });
          
          if (fallbackResponse.data.data && fallbackResponse.data.data.length > 0) {
            console.log('Successfully found availability with fallback hotel');
            return {
              ...fallbackResponse.data,
              hotels: hotelListResponse.data.data
            };
          }
        } catch (fallbackError) {
          console.error('Fallback hotel check failed:', fallbackError.message);
        }
        
        // If all else fails, just return the hotel list
        return {
          data: hotelListResponse.data.data.map(hotel => ({
            hotelId: hotel.hotelId,
            name: hotel.name,
            address: hotel.address,
            geoCode: hotel.geoCode
          }))
        };
      }
    } catch (error) {
      console.error('Error searching hotels:', error.response?.data || error);
      throw error;
    }
  }

  async getHotelDetails(hotelId) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseUrls.v3}/shopping/hotel-offers/by-hotel`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          hotelId: hotelId,
          view: 'FULL'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting hotel details:', error);
      throw error;
    }
  }

  async getHotelAvailability(hotelId, checkInDate, checkOutDate, adults) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseUrls.v3}/shopping/hotel-offers`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.amadeus+json'
        },
        params: {
          hotelIds: hotelId,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          adults: adults,
          roomQuantity: 1,
          currency: 'USD',
          bestRateOnly: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting hotel availability:', error);
      throw error;
    }
  }

  async bookHotel(offerId, guests, payments) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.post(`${this.baseUrls.v2}/booking/hotel-bookings`, 
        {
          data: {
            offerId: offerId,
            guests: guests,
            payments: payments
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error booking hotel:', error);
      throw error;
    }
  }
}

const amadeusService = new AmadeusService();
export default amadeusService; 