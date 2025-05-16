import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.REACT_APP_AMADEUS_API_KEY,
  clientSecret: process.env.REACT_APP_AMADEUS_API_SECRET
});

// Search flights controller
const searchFlights = async (req, res) => {
  // Implementation moved to routes
};

// Create flight order controller
const createFlightOrder = async (req, res) => {
  try {
    const { travelerDetails, contactInfo, flightOffer } = req.body;

    // Validate required fields
    if (!travelerDetails || !contactInfo || !flightOffer) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: travelerDetails, contactInfo, and flightOffer are required'
      });
    }

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
  } catch (error) {
    console.error('Error in createFlightOrder:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

module.exports = {
  searchFlights,
  createFlightOrder
};
