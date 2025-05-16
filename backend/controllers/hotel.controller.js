import hotelService from '../services/hotel.service.js';
import axios from 'axios';

// const getAccessToken = async () => {
//   const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', null, {
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     auth: {
//       username: process.env.REACT_APP_AMADEUS_API_KEY, // Use server-side env vars
//       password: process.env.REACT_APP_AMADEUS_API_SECRET,
//     },
//     params: {
//       grant_type: 'client_credentials',
//     }
//   });

//   return response.data.access_token;
// };


const getAccessToken = async () => {
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(), // form body
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: process.env.REACT_APP_AMADEUS_API_KEY,
        // client_secret: // Make sure this is set in your .env
          password: process.env.REACT_APP_AMADEUS_API_SECRET,      // Make sure this is set in your .env
        }
      }
    );

    console.log('Access Token:', response.data.access_token);
    return response.data.access_token;

  } catch (error) {
    console.error('Failed to get access token:', error.response?.data || error.message);
    throw new Error('Could not generate access token');
  }
};


export const listHotels = async (req, res) => {
  try {
    const { cityCode } = req.query;
    
    if (!cityCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'City code is required' 
      });
    }

    const hotels = await hotelService.getHotelsByCity(cityCode);
    
    res.json({
      success: true,
      data: hotels
    });
  } catch (error) {
    console.error('Error in listHotels controller:', error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Error listing hotels',
      error: error.message
    });
  }
};

export const getDestinations = async (req, res) => {
  try {
    const destinations = await hotelService.getDestinations();
    res.json({
      success: true,
      data: destinations
    });
  } catch (error) {
    console.error('Error getting destinations:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting destinations',
      error: error.message
    });
  }
};

export const searchHotels = async (req, res) => {
  console.log(req);
  try {
    const params = req.method === 'POST' ? req.body : req.query;
    const { destination, dates, travelers, cityCode, checkInDate, checkOutDate, adults } = params;
    console.log(params,'sssssssssssssssssssss')

    const searchParams = {
      cityCode: cityCode || destination,
      checkInDate,
      checkOutDate,
      adults: parseInt(adults || travelers) || 2
    };
    if (dates && dates !== 'Select dates') {
      const [start, end] = dates.split(' - ');
      if (start && end) {
        searchParams.checkInDate = start;
        searchParams.checkOutDate = end;
      }
    }

    // Get access token
    const token = await getAccessToken();

    // Fetch hotel offers from Amadeus API
    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        cityCode: searchParams.cityCode,
        radius: 5,
        radiusUnit: 'KM',
        amenities: 'ROOM_SERVICE',
        hotelSource: 'ALL'
      }
    });
    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error('Error in searchHotels:', error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.message || 'Error searching hotels'
    });
  }
};



export const getHotelDetails = async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    if (!hotelId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hotel ID is required' 
      });
    }

    const hotelDetails = await hotelService.getHotelDetails(hotelId);
    
    res.json({
      success: true,
      data: hotelDetails
    });
  } catch (error) {
    console.error('Error in getHotelDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting hotel details',
      error: error.message
    });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkInDate, checkOutDate, adults } = req.query;
    
    if (!hotelId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hotel ID, check-in date, and check-out date are required' 
      });
    }

    const availability = await hotelService.checkAvailability(
      hotelId,
      checkInDate,
      checkOutDate,
      parseInt(adults) || 1
    );
    
    res.json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error in checkAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking hotel availability',
      error: error.message
    });
  }
};

export const bookHotel = async (req, res) => {
  try {
    const { offerId, guests, payments } = req.body;
    
    if (!offerId || !guests || !payments) {
      return res.status(400).json({ 
        success: false, 
        message: 'Offer ID, guests, and payment information are required' 
      });
    }

    const booking = await hotelService.bookHotel(
      req.params.hotelId,
      offerId,
      guests,
      payments
    );
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error in bookHotel:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking hotel',
      error: error.message
    });
  }
}; 