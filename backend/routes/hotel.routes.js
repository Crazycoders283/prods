import express from 'express';
import { listHotels, searchHotels, getDestinations } from '../controllers/hotel.controller.js';
import axios from 'axios';
import dayjs from 'dayjs';

const router = express.Router();
// console.log('coming to this page')
// Get list of destinations
router.get('/destinations', getDestinations);

// List hotels in a city
router.get('/list', listHotels);

// Search hotels with availability (support both GET and POST)
router.post('/search', searchHotels);
router.get('/search', searchHotels);

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
          
          username: process.env.REACT_APP_AMADEUS_API_KEY,    // Make sure this is set in your .env
          password:process.env.REACT_APP_AMADEUS_API_SECRET,       // Make sure this is set in your .env
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
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // add 1 because months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// Get hotel offer by ID
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
        checkInDate,
        checkOutDate,
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

export default router;
