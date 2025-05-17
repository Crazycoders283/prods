import express from 'express';
import { listHotels, searchHotels, getDestinations, getHotelDetails, checkAvailability, bookHotel } from '../controllers/hotel.controller.js';
import axios from 'axios';
import dayjs from 'dayjs';

const router = express.Router();

// IMPORTANT: Order matters - more specific routes must come before generic ones
// Get list of destinations
router.get('/destinations', getDestinations);

// List hotels in a city
router.get('/list', listHotels);

// Search hotels with availability (support both GET and POST)
router.post('/search', searchHotels);
router.get('/search', searchHotels);

// Check availability
router.get('/check-availability', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { destination, checkInDate, checkOutDate, travelers } = req.query;

    if (!destination || !checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: destination, checkInDate, and checkOutDate are required'
      });
    }

    // Format dates if needed
    const formattedCheckIn = formatDate(checkInDate);
    const formattedCheckOut = formatDate(checkOutDate);
    
    console.log('Check availability params:', {
      destination,
      checkInDate: formattedCheckIn,
      checkOutDate: formattedCheckOut
    });

    // First, search for hotels in the city
    const searchResponse = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        cityCode: destination,
        radius: 5,
        radiusUnit: 'KM',
        amenities: 'ROOM_SERVICE',
        hotelSource: 'ALL'
      }
    });

    if (!searchResponse.data.data || searchResponse.data.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No hotels found in this location'
      });
    }

    // Get the first hotel's ID
    const hotelId = searchResponse.data.data[0].hotelId;

    // Now check availability for this hotel
    const hotelResponse = await axios.get(`https://test.api.amadeus.com/v3/shopping/hotel-offers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.amadeus+json'
      },
      params: {
        hotelIds: destination,
        checkInDate: formattedCheckIn,
        checkOutDate: formattedCheckOut,
        adults: travelers || 1,
        roomQuantity: 1,
        currency: 'USD',
        bestRateOnly: true
      }
    });

    if (hotelResponse.data.data && hotelResponse.data.data.length > 0) {
      res.json({
        success: true,
        data: hotelResponse.data
      });
    } else {
      res.json({
        success: false,
        message: 'No availability found for these dates'
      });
    }
  } catch (error) {
    console.error('Error checking hotel availability:', error.response?.data || error);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.errors?.[0]?.detail || 'Error checking hotel availability'
    });
  }
});

// Get hotel offers by ID
router.get('/offers/:hotelId', checkAvailability);

// Book a hotel
router.post('/book/:hotelId', bookHotel);

// Get hotel details by ID - specific path
router.get('/details/:hotelId', getHotelDetails);

// IMPORTANT: This generic path must be last to avoid catching other routes
// Get hotel details by ID - direct path
router.get('/:hotelId', getHotelDetails);

const getAccessToken = async () => {
  try {
    const apiKey = process.env.AMADEUS_API_KEY || process.env.REACT_APP_AMADEUS_API_KEY;
    const apiSecret = process.env.AMADEUS_API_SECRET || process.env.REACT_APP_AMADEUS_API_SECRET;
    
    console.log('API credentials available:', {
      keyPresent: !!apiKey,
      secretPresent: !!apiSecret
    });
    
    if (!apiKey || !apiSecret) {
      throw new Error('Missing Amadeus API credentials');
    }
    
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({ grant_type: 'client_credentials' }).toString(), // form body
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: apiKey,    // Use the resolved API key
          password: apiSecret, // Use the resolved API secret
        }
      }
    );

    console.log('Access Token obtained successfully');
    return response.data.access_token;

  } catch (error) {
    console.error('Failed to get access token:', error.response?.data || error.message);
    throw new Error('Could not generate access token');
  }
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // add 1 because months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Return original if can't parse
  }
};

export default router;
