import Amadeus from 'amadeus';

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

  async  getAccessToken() {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.REACT_APP_AMADEUS_API_KEY,
        password: process.env.REACT_APP_AMADEUS_API_SECRET,
      },
      params: {
        grant_type: 'client_credentials',
      }
    });
  
    return response.data.access_token;
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
      const response = await this.amadeus.referenceData.locations.hotels.byCity.get({
        cityCode
      });
      console.log('Hotels response:', response);
      return response.data || [];
    } catch (error) {
      console.error('Error getting hotels:', {
        message: error.message,
        code: error.code,
        description: error.description
      });
      throw new Error(error.description?.[0]?.detail || error.message || 'Failed to get hotels');
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

      // Search for hotel offers

      //https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city
      // const response = await this.amadeus.shopping.hotelOffers.get({
      //   cityCode,
      //   checkInDate: searchDates.checkIn,
      //   checkOutDate: searchDates.checkOut,
      //   adults,
      //   radius: 50,
      //   radiusUnit: 'KM',
      //   includeClosed: false,
      //   bestRateOnly: true,
      //   view: 'FULL'
      // });
      console.log('cccccccccccccccccc')
      const token = await this.getAccessToken();

      const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          cityCode:"PAR",               // e.g., 'PAR'
          radius: 5,              // radius in KM
          radiusUnit: 'KM',       // KM or MI
          amenities: 'ROOM_SERVICE',
          hotelSource: 'ALL'
        }
      });
      console.log(response,'kkkkkkkkkkkkkkkkkkkkkkkkkk')
      return response.data || [];
    } catch (error) {
      console.error('Error searching hotels:sssssssssssssssssssssssssss', error);
      throw new Error(error.description?.[0]?.detail || error.message || 'Failed to search hotels');
    }
  }

  async getHotelOfferById(offerId) {
    try {
      console.log('Getting hotel offer details for ID:', offerId);

      const response = await this.amadeus.shopping.hotelOffer(offerId).get();

      if (!response.data) {
        throw new Error('Hotel offer not found');
      }

      return response.data;
    } catch (error) {
      console.error('Error getting hotel offer:', {
        message: error.message,
        code: error.code,
        description: error.description
      });
      throw new Error(error.description || error.message);
    }
  }
}

const hotelService = new HotelService();
export default hotelService;