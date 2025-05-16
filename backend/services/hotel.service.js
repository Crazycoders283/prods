import Amadeus from 'amadeus';
import axios from 'axios';

class HotelService {
  constructor() {
    this.amadeus = new Amadeus({
      clientId: process.env.REACT_APP_AMADEUS_API_KEY,
      clientSecret: process.env.REACT_APP_AMADEUS_API_SECRET
    });

    console.log('Hotel service initialized with:', {
      apiKey: process.env.REACT_APP_AMADEUS_API_KEY,
      apiSecret: process.env.REACT_APP_AMADEUS_API_SECRET ? '***' : 'missing'
    });

    // Cache for destinations to avoid frequent API calls
    this.destinationsCache = null;
    this.destinationsCacheExpiry = null;
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  }

  async getAccessToken() {
    try {
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: process.env.REACT_APP_AMADEUS_API_KEY,
            password: process.env.REACT_APP_AMADEUS_API_SECRET,
          }
        }
      );
    
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      throw new Error('Failed to get access token');
    }
  }

  async getDestinations() {
    try {
      // Check cache first
      if (this.destinationsCache && this.destinationsCacheExpiry > Date.now()) {
        return this.destinationsCache;
      }

      // Get popular cities
      const popularCities = [
        { code: 'LON', name: 'London', country: 'United Kingdom' },
        { code: 'PAR', name: 'Paris', country: 'France' },
        { code: 'NYC', name: 'New York', country: 'United States' },
        { code: 'TYO', name: 'Tokyo', country: 'Japan' },
        { code: 'ROM', name: 'Rome', country: 'Italy' },
        { code: 'SYD', name: 'Sydney', country: 'Australia' },
        { code: 'DXB', name: 'Dubai', country: 'United Arab Emirates' },
        { code: 'SIN', name: 'Singapore', country: 'Singapore' },
        { code: 'BCN', name: 'Barcelona', country: 'Spain' },
        { code: 'AMS', name: 'Amsterdam', country: 'Netherlands' }
      ];

      // Cache the results
      this.destinationsCache = popularCities;
      this.destinationsCacheExpiry = Date.now() + this.CACHE_DURATION;

      return popularCities;
    } catch (error) {
      console.error('Error getting destinations:', error);
      throw new Error('Failed to get destinations');
    }
  }

  async getHotelsByCity(cityCode) {
    try {
      console.log('Getting hotels for city:', cityCode);
      const token = await this.getAccessToken();
      
      const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          cityCode: cityCode,
          radius: 5,
          radiusUnit: 'KM',
          hotelSource: 'ALL'
        }
      });
      
      return response.data || [];
    } catch (error) {
      console.error('Error getting hotels:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errors?.[0]?.detail || error.message || 'Failed to get hotels');
    }
  }

  async searchHotels(query) {
    try {
      const { cityCode, checkInDate, checkOutDate, adults = 2 } = query;
      
      if (!cityCode) {
        throw new Error('City code is required');
      }

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];
      
      // Use provided dates or fallback to today/tomorrow
      const searchDates = {
        checkIn: checkInDate || today,
        checkOut: checkOutDate || tomorrow
      };

      // Get hotels in city first
      const hotelsResponse = await this.getHotelsByCity(cityCode);
      
      if (!hotelsResponse.data || hotelsResponse.data.length === 0) {
        return { data: [] };
      }
      
      // Get hotel IDs (limit to first 10 for performance)
      const hotelIds = hotelsResponse.data.slice(0, 10).map(hotel => hotel.hotelId).join(',');
      
      // Search for hotel offers
      const token = await this.getAccessToken();
      
      const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.amadeus+json'
        },
        params: {
          hotelIds: hotelIds,
          checkInDate: searchDates.checkIn,
          checkOutDate: searchDates.checkOut,
          adults: adults,
          roomQuantity: 1,
          currency: 'USD',
          bestRateOnly: true
        }
      });
      
      // Add additional display attributes to each hotel result
      if (response.data && response.data.data) {
        response.data.data = response.data.data.map(hotel => {
          // Find the corresponding hotel from the city search to get more details
          const hotelInfo = hotelsResponse.data.find(h => h.hotelId === hotel.hotel.hotelId);
          
          return {
            ...hotel,
            hotel: {
              ...hotel.hotel,
              name: hotel.hotel.name || (hotelInfo ? hotelInfo.name : 'Unknown Hotel'),
              cityName: hotelInfo ? hotelInfo.address?.cityName : '',
              address: {
                ...hotel.hotel.address,
                cityName: hotelInfo ? hotelInfo.address?.cityName : '',
                countryName: hotelInfo ? hotelInfo.address?.countryName : ''
              },
              rating: hotel.hotel.rating || (hotelInfo ? hotelInfo.rating : ''),
              amenities: hotel.hotel.amenities || [],
              media: hotel.hotel.media || [],
              description: hotel.hotel.description || 'No description available',
              contact: hotel.hotel.contact || {}
            }
          };
        });
      }
      
      return response.data || { data: [] };
    } catch (error) {
      console.error('Error searching hotels:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errors?.[0]?.detail || error.message || 'Failed to search hotels');
    }
  }

  async getHotelDetails(hotelId) {
    try {
      console.log('Getting hotel details for ID:', hotelId);
      const token = await this.getAccessToken();
      
      // First get the hotel information
      const hotelResponse = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!hotelResponse.data || !hotelResponse.data.data) {
        throw new Error('Hotel not found');
      }
      
      return {
        ...hotelResponse.data.data,
        // Add additional fields for the frontend display
        formattedAddress: hotelResponse.data.data.address ? 
          `${hotelResponse.data.data.address.lines?.join(', ') || ''}, ${hotelResponse.data.data.address.cityName || ''}, ${hotelResponse.data.data.address.countryName || ''}` : 
          'Address unavailable',
        phone: hotelResponse.data.data.contact?.phone || 'Phone unavailable',
        email: hotelResponse.data.data.contact?.email || 'Email unavailable'
      };
    } catch (error) {
      console.error('Error getting hotel details:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errors?.[0]?.detail || error.message || 'Failed to get hotel details');
    }
  }

  async getHotelOffers(hotelId, params) {
    try {
      console.log('Getting hotel offers for ID:', hotelId);
      
      const { checkInDate, checkOutDate, adults = 2, children = 0 } = params;
      
      if (!checkInDate || !checkOutDate) {
        throw new Error('Check-in and check-out dates are required');
      }
      
      const token = await this.getAccessToken();
      
      const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.amadeus+json'
        },
        params: {
          hotelIds: hotelId,
          checkInDate,
          checkOutDate,
          adults: adults,
          children: children,
          roomQuantity: 1,
          currency: 'USD',
          bestRateOnly: false
        }
      });
      
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        return { offers: [] };
      }
      
      // Enhance the offers with additional display info
      const hotelData = response.data.data[0];
      const offers = hotelData.offers.map(offer => {
        return {
          ...offer,
          // Add computed properties for the frontend
          formattedPrice: `$${parseFloat(offer.price.total).toFixed(2)} ${offer.price.currency}`,
          roomDescription: offer.room?.description?.text || 'Standard Room',
          cancellationPolicy: offer.policies?.cancellation?.description || 'Cancellation policy not available',
          bedType: offer.room?.typeEstimated?.bedType || 'Standard',
          amenities: offer.room?.amenities || []
        };
      });
      
      return {
        hotel: hotelData.hotel,
        offers
      };
    } catch (error) {
      console.error('Error getting hotel offers:', error.response?.data || error.message);
      throw new Error(error.response?.data?.errors?.[0]?.detail || error.message || 'Failed to get hotel offers');
    }
  }

  async checkAvailability(hotelId, checkInDate, checkOutDate, adults) {
    try {
      return await this.getHotelOffers(hotelId, { checkInDate, checkOutDate, adults });
    } catch (error) {
      console.error('Error checking availability:', error);
      throw new Error(error.message || 'Failed to check hotel availability');
    }
  }

  async bookHotel(hotelId, offerId, guests, payments) {
    try {
      console.log('Booking hotel:', { hotelId, offerId, guests, payments });
      
      // For now, just return a mock booking confirmation
      // In a real implementation, you would use the Amadeus booking API
      return {
        bookingId: 'MOCK-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        status: 'CONFIRMED',
        hotelId,
        offerId,
        checkInDate: guests.checkInDate,
        checkOutDate: guests.checkOutDate,
        guestName: `${guests.firstName} ${guests.lastName}`,
        totalPrice: payments.amount,
        currency: payments.currency || 'USD',
        bookingDate: new Date().toISOString(),
        confirmationNumber: 'CN' + Math.random().toString(36).substring(2, 10).toUpperCase()
      };
    } catch (error) {
      console.error('Error booking hotel:', error);
      throw new Error(error.message || 'Failed to book hotel');
    }
  }
}

const hotelService = new HotelService();
export default hotelService;