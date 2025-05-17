import Amadeus from 'amadeus';
import axios from 'axios';

class HotelService {
  constructor() {
    const apiKey = process.env.AMADEUS_API_KEY || process.env.REACT_APP_AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET || process.env.REACT_APP_AMADEUS_API_SECRET;

    this.amadeus = new Amadeus({
      clientId: apiKey,
      clientSecret: apiSecret
    });

    console.log('HotelService: Initialized with API credentials:', {
      apiKey: apiKey ? '[PRESENT]' : '[MISSING]',
      apiSecret: apiSecret ? '[PRESENT]' : '[MISSING]'
    });

    // Cache for destinations to avoid frequent API calls
    this.destinationsCache = null;
    this.destinationsCacheExpiry = null;
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  }

  async getAccessToken() {
    try {
      console.log('HotelService: Getting access token from Amadeus');
      const apiKey = process.env.AMADEUS_API_KEY || process.env.REACT_APP_AMADEUS_API_KEY;
      const apiSecret = process.env.AMADEUS_API_SECRET || process.env.REACT_APP_AMADEUS_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        throw new Error('Missing Amadeus API credentials');
      }
      
      const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: apiKey,
            password: apiSecret,
          }
        }
      );
    
      console.log('HotelService: Successfully obtained access token');
      return response.data.access_token;
    } catch (error) {
      console.error('HotelService: Error getting access token:', 
        error.response?.status,
        error.response?.data || error.message
      );
      throw new Error('Failed to get access token from Amadeus');
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

  async searchHotels(destination, checkInDate, checkOutDate, adults = 1) {
    try {
      console.log('HotelService: searchHotels called with params:', {
        destination,
        checkInDate,
        checkOutDate,
        adults
      });

      // Validate dates
      const isValidDate = (dateStr) => {
        const d = new Date(dateStr);
        return !isNaN(d.getTime());
      };

      if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        console.error('HotelService: Invalid date format', { checkInDate, checkOutDate });
        throw new Error('INVALID DATE');
      }

      // Ensure date format is YYYY-MM-DD
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      const formattedCheckIn = formatDate(checkInDate);
      const formattedCheckOut = formatDate(checkOutDate);

      console.log('HotelService: Using formatted dates:', {
        formattedCheckIn,
        formattedCheckOut
      });

      // Make the API call to Amadeus
      const response = await this.amadeus.shopping.hotelOffers.get({
        cityCode: destination,
        checkInDate: formattedCheckIn,
        checkOutDate: formattedCheckOut,
        adults: adults,
        roomQuantity: 1,
        currency: 'USD'
      });

      console.log(`HotelService: Search successful, found ${response.data.length || 0} hotels`);
      return response.data;
    } catch (error) {
      console.error('HotelService: Error searching hotels:', error.message, error.response?.data || error.description || error);
      throw new Error(`Amadeus Error - ${error.description || error.message || 'UNKNOWN ERROR'}`);
    }
  }

  async getHotelDetails(hotelId) {
    try {
      console.log('HotelService: Getting hotel details for ID:', hotelId);
      
      if (!hotelId) {
        throw new Error('Hotel ID is required');
      }
      
      const token = await this.getAccessToken();
      console.log('HotelService: Successfully obtained access token');
      
      // First get the hotel information
      const hotelResponse = await axios.get(`https://test.api.amadeus.com/v1/reference-data/locations/hotels/${hotelId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).catch(error => {
        console.error('HotelService: Amadeus API Error:', error.response?.status, error.response?.data || error.message);
        throw new Error(`Hotel not found: ${error.response?.data?.errors?.[0]?.detail || error.message}`);
      });
      
      if (!hotelResponse.data || !hotelResponse.data.data) {
        console.error('HotelService: Empty response from Amadeus API');
        throw new Error('Hotel not found');
      }
      
      console.log('HotelService: Successfully fetched hotel details:', hotelResponse.data.data.name);
      
      // Return properly formatted hotel data
      return {
        ...hotelResponse.data.data,
        // Add additional fields for the frontend display
        formattedAddress: hotelResponse.data.data.address ? 
          `${hotelResponse.data.data.address.lines?.join(', ') || ''}, ${hotelResponse.data.data.address.cityName || ''}, ${hotelResponse.data.data.address.countryName || ''}` : 
          'Address unavailable',
        phone: hotelResponse.data.data.contact?.phone || 'Phone unavailable',
        email: hotelResponse.data.data.contact?.email || 'Email unavailable',
        description: hotelResponse.data.data.description || 'No description available'
      };
    } catch (error) {
      console.error('HotelService: Error getting hotel details:', error.message);
      throw new Error(error.message || 'Failed to get hotel details');
    }
  }

  async getHotelOffers(hotelId, params) {
    try {
      console.log('HotelService: Getting hotel offers for ID:', hotelId, 'with params:', params);
      
      const { checkInDate, checkOutDate, adults = 2, children = 0 } = params;
      
      if (!hotelId) {
        throw new Error('Hotel ID is required');
      }
      
      if (!checkInDate || !checkOutDate) {
        throw new Error('Check-in and check-out dates are required');
      }
      
      // Validate dates
      const isValidDate = (dateStr) => {
        const d = new Date(dateStr);
        return !isNaN(d.getTime());
      };

      if (!isValidDate(checkInDate) || !isValidDate(checkOutDate)) {
        throw new Error('Invalid date format');
      }

      // Format dates properly
      const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      };

      const formattedCheckIn = formatDate(checkInDate);
      const formattedCheckOut = formatDate(checkOutDate);
      
      console.log('HotelService: Using formatted dates for offers:', {
        formattedCheckIn,
        formattedCheckOut
      });
      
      const token = await this.getAccessToken();
      
      const response = await axios.get('https://test.api.amadeus.com/v3/shopping/hotel-offers', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.amadeus+json'
        },
        params: {
          hotelIds: hotelId,
          checkInDate: formattedCheckIn,
          checkOutDate: formattedCheckOut,
          adults: adults,
          children: children,
          roomQuantity: 1,
          currency: 'USD',
          bestRateOnly: false
        }
      }).catch(error => {
        console.error('HotelService: Amadeus offers API Error:', 
          error.response?.status, 
          error.response?.data?.errors || error.message
        );
        throw new Error(`No offers available: ${error.response?.data?.errors?.[0]?.detail || error.message}`);
      });
      
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        console.log('HotelService: No offers found for hotel:', hotelId);
        return { offers: [] };
      }
      
      console.log(`HotelService: Found ${response.data.data[0].offers?.length || 0} offers for hotel ${hotelId}`);
      
      // Enhance the offers with additional display info
      const hotelData = response.data.data[0];
      const offers = hotelData.offers.map(offer => {
        return {
          ...offer,
          // Add computed properties for the frontend
          formattedPrice: `$${parseFloat(offer.price.total).toFixed(2)} ${offer.price.currency}`,
          roomDescription: offer.room?.description?.text || 'Standard Room',
          cancellationPolicy: offer.policies?.cancellation?.description?.text || 'Cancellation policy not available',
          bedType: offer.room?.typeEstimated?.bedType || 'Standard',
          amenities: offer.room?.amenities || []
        };
      });
      
      return {
        hotel: hotelData.hotel,
        offers
      };
    } catch (error) {
      console.error('HotelService: Error getting hotel offers:', error.message);
      throw new Error(error.message || 'Failed to get hotel offers');
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