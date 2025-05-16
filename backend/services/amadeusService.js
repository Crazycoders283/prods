const axios = require('axios');

class AmadeusService {
  constructor() {
    this.baseUrl = 'https://test.api.amadeus.com/v2';
    this.token = null;
    this.tokenExpiration = null;
  }

  async getAccessToken() {
    // Check if we have a valid token
    if (this.token && this.tokenExpiration && new Date() < this.tokenExpiration) {
      return this.token;
    }

    try {
      const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', 
        'grant_type=client_credentials&client_id=' + process.env.AMADEUS_API_KEY + '&client_secret=' + process.env.AMADEUS_API_SECRET,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.token = response.data.access_token;
      // Set token expiration to 29 minutes from now (tokens typically expire in 30 minutes)
      this.tokenExpiration = new Date(Date.now() + 29 * 60 * 1000);
      
      return this.token;
    } catch (error) {
      console.error('Error getting Amadeus access token:', error);
      throw error;
    }
  }

  async searchHotels(params) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseUrl}/shopping/hotel-offers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          cityCode: params.cityCode,
          radius: params.radius || 5,
          radiusUnit: 'KM',
          paymentPolicy: 'NONE',
          includeClosed: false,
          bestRateOnly: true,
          view: 'FULL',
          sort: 'PRICE',
          ...params
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  }

  async getHotelDetails(hotelId) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(`${this.baseUrl}/shopping/hotel-offers/by-hotel`, {
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
      
      const response = await axios.get(`${this.baseUrl}/shopping/hotel-offers/by-hotel`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          hotelId: hotelId,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          adults: adults,
          view: 'FULL'
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
      
      const response = await axios.post(`${this.baseUrl}/booking/hotel-bookings`, 
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

module.exports = new AmadeusService(); 