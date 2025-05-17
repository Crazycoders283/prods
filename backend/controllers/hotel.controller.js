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
  try {
    // Extract parameters from both query (GET) and body (POST)
    const { destination, checkInDate, checkOutDate, travelers } = { ...req.query, ...req.body };
    
    console.log('HotelController: Search request received with params:', {
      destination,
      checkInDate,
      checkOutDate,
      travelers,
      method: req.method,
      url: req.originalUrl
    });

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Destination is required'
      });
    }
    
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }

    // Convert travelers to a number (default to 2)
    const adults = parseInt(travelers || '2', 10);
    
    // Add additional environment diagnostics
    console.log('Environment variables check:', {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      AMADEUS_KEY_EXISTS: !!process.env.REACT_APP_AMADEUS_API_KEY,
      AMADEUS_SECRET_EXISTS: !!process.env.REACT_APP_AMADEUS_API_SECRET
    });
    
    try {
      const results = await hotelService.searchHotels(
        destination, 
        checkInDate, 
        checkOutDate, 
        adults
      );
      
      // Check if results is valid
      if (!results || (!results.data && !Array.isArray(results))) {
        console.error('HotelController: Invalid results returned from service');
        return res.status(200).json({
          success: true,
          data: { data: [] }, // Return empty array rather than error
          message: 'No hotels found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: results
      });
    } catch (serviceError) {
      console.error('HotelController: Service error:', serviceError);
      // Return a 200 with empty results instead of error
      return res.status(200).json({
        success: true,
        data: { data: [] },
        message: 'No hotels found for this search'
      });
    }
  } catch (error) {
    console.error('HotelController: Error in searchHotels:', error.message);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Return 200 with empty results to avoid client side errors
    return res.status(200).json({
      success: true,
      data: { data: [] },
      message: 'Error processing search request, please try again'
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

    console.log('HotelController: Getting details for hotel ID:', hotelId);

    // Add a try-catch specifically for the service call
    try {
      const hotelDetails = await hotelService.getHotelDetails(hotelId);
      
      return res.json({
        success: true,
        data: hotelDetails
      });
    } catch (serviceError) {
      console.error('Error from hotel service:', serviceError);
      return res.status(404).json({
        success: false,
        message: serviceError.message || 'Hotel details not found'
      });
    }
  } catch (error) {
    console.error('Error in getHotelDetails controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting hotel details',
      error: error.message
    });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkInDate, checkOutDate, adults, children } = req.query;
    
    if (!hotelId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hotel ID, check-in date, and check-out date are required' 
      });
    }

    const availability = await hotelService.getHotelOffers(
      hotelId,
      {
        checkInDate,
        checkOutDate,
        adults: parseInt(adults) || 1,
        children: parseInt(children) || 0
      }
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
    const { hotelId } = req.params;
    const { offerId, guests, payments } = req.body;
    
    if (!hotelId || !offerId || !guests || !payments) {
      return res.status(400).json({ 
        success: false, 
        message: 'Hotel ID, offer ID, guests, and payment information are required' 
      });
    }

    const booking = await hotelService.bookHotel(
      hotelId,
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