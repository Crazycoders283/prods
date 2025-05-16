import express from 'express';
import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.REACT_APP_AMADEUS_API_KEY,
  clientSecret: process.env.REACT_APP_AMADEUS_API_SECRET
});

console.log('Amadeus client initialized with:', {
  clientId: process.env.REACT_APP_AMADEUS_API_KEY,
  clientSecret: process.env.REACT_APP_AMADEUS_API_SECRET?.substring(0, 4) + '...' // Log only first 4 chars of secret
});

// Flight search endpoint
router.post('/search', async (req, res) => {
  try {
    const { from, to, departDate, returnDate, tripType, travelers } = req.body;

    // Validate required fields
    if (!from || !to || !departDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: from, to, and departDate are required'
      });
    }

    console.log('Searching flights with params:', { from, to, departDate, returnDate, tripType, travelers });

    // Prepare Amadeus API parameters
    const amadeusParams = {
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: departDate,
      adults: parseInt(travelers) || 1,
      max: 10
    };

    // Only add returnDate if it's provided and not empty
    if (returnDate && returnDate.trim() !== '') {
      amadeusParams.returnDate = returnDate;
    }

    console.log('Calling Amadeus API with params:', amadeusParams);

    try {
      // Call Amadeus API
      const response = await amadeus.shopping.flightOffersSearch.get(amadeusParams);
      console.log('Amadeus API response:', response);

      if (!response.data || response.data.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      // Transform Amadeus response to our format
      const flights = response.data.map(offer => {
        try {
          return {
            id: offer.id,
            price: {
              total: offer.price?.total || '0',
              amount: parseFloat(offer.price?.total || '0'),
              currency: offer.price?.currency || 'USD',
              base: offer.price?.base || '0',
              fees: offer.price?.fees || []
            },
            itineraries: offer.itineraries.map(itinerary => ({
              duration: itinerary.duration,
              segments: itinerary.segments.map(segment => ({
                departure: {
                  at: segment.departure.at,
                  iataCode: segment.departure.iataCode,
                  terminal: segment.departure.terminal || 'T1',
                  city: segment.departure.iataCode
                },
                arrival: {
                  at: segment.arrival.at,
                  iataCode: segment.arrival.iataCode,
                  terminal: segment.arrival.terminal || 'T1',
                  city: segment.arrival.iataCode
                },
                duration: segment.duration,
                carrierCode: segment.carrierCode,
                number: segment.number,
                aircraft: segment.aircraft?.code || 'Unknown',
                operating: segment.operating,
                cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
                class: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.class || 'ECONOMY',
                baggage: {
                  checked: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags || { weight: 0, weightUnit: 'KG' },
                  cabin: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCabinBags || { weight: 0, weightUnit: 'KG' }
                }
              }))
            })),
            travelerPricings: offer.travelerPricings?.map(pricing => ({
              travelerId: pricing.travelerId,
              fareDetailsBySegment: pricing.fareDetailsBySegment?.map(segment => ({
                segmentId: segment.segmentId,
                cabin: segment.cabin || 'ECONOMY',
                class: segment.class || 'ECONOMY',
                includedCheckedBags: segment.includedCheckedBags || { weight: 0, weightUnit: 'KG' },
                includedCabinBags: segment.includedCabinBags || { weight: 0, weightUnit: 'KG' },
                amenities: segment.amenities || []
              })) || []
            })) || []
          };
        } catch (transformError) {
          console.error('Error transforming flight offer:', transformError);
          return null;
        }
      }).filter(Boolean); // Remove any null entries from failed transformations

      res.json({
        success: true,
        data: flights
      });
    } catch (amadeusError) {
      console.error('Amadeus API error:', amadeusError);
      console.error('Error details:', {
        message: amadeusError.message,
        code: amadeusError.code,
        response: amadeusError.response?.data
      });
      
      return res.status(500).json({
        success: false,
        error: amadeusError.message || 'Error calling Amadeus API',
        details: amadeusError.response?.data || {}
      });
    }
  } catch (error) {
    console.error('Error in flight search:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Flight booking endpoint
router.post('/booking/flight-orders', async (req, res) => {
  try {
    const { travelerDetails, contactInfo, flightOffer } = req.body;

    // Validate required fields
    if (!travelerDetails || !contactInfo || !flightOffer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: travelerDetails, contactInfo, and flightOffer are required'
      });
    }

    console.log('Creating flight order with:', { travelerDetails, contactInfo, flightOffer });

    try {
      // Call Amadeus API to create the booking
      const response = await amadeus.booking.flightOrders.post(
        JSON.stringify({
          data: {
            type: 'flight-order',
            flightOffers: [flightOffer],
            travelers: travelerDetails.map(traveler => ({
              id: traveler.id,
              dateOfBirth: traveler.dateOfBirth,
              name: {
                firstName: traveler.firstName,
                lastName: traveler.lastName
              },
              gender: traveler.gender,
              contact: {
                emailAddress: contactInfo.email,
                phones: [{
                  deviceType: 'MOBILE',
                  countryCallingCode: contactInfo.countryCode,
                  number: contactInfo.phoneNumber
                }]
              }
            }))
          }
        })
      );

      console.log('Amadeus booking response:', response);

      if (!response.data) {
        return res.status(500).json({
          success: false,
          error: 'Failed to create booking'
        });
      }

      // Return the booking confirmation with PNR
      res.json({
        success: true,
        data: {
          pnr: response.data.associatedRecords?.[0]?.reference,
          bookingReference: response.data.id,
          status: response.data.status,
          travelers: response.data.travelers,
          flightOffers: response.data.flightOffers,
          createdAt: response.data.createdAt
        }
      });
    } catch (amadeusError) {
      console.error('Amadeus booking error:', amadeusError);
      console.error('Error details:', {
        message: amadeusError.message,
        code: amadeusError.code,
        response: amadeusError.response?.data
      });
      
      return res.status(500).json({
        success: false,
        error: amadeusError.message || 'Error creating booking with Amadeus API',
        details: amadeusError.response?.data || {}
      });
    }
  } catch (error) {
    console.error('Error in flight booking:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

export default router;
