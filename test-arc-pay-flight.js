import axios from 'axios';

// ARC Pay test credentials based on email
const ARC_PAY_API_URL = 'https://api.arcpay.travel/api/rest/version/77/merchant/TESTARC05511704';
const ARC_PAY_MERCHANT_ID = 'TESTARC05511704';
const ARC_PAY_API_USERNAME = 'TESTARC05511704'; // Note: Actually need to create user in portal and get API key
const ARC_PAY_API_PASSWORD = 'pqiUhfYMWhqUCAiKAKoQtCs5frc='; // Placeholder, actual API key needed

// Test flight booking data
const testFlightData = {
    bookingDetails: {
        flight: {
            departureCity: "Hyderabad",
            arrivalCity: "Delhi",
            departureDate: "2025-05-25",
            airline: "Air India",
            duration: "2h 30m",
            flightNumber: "AI-101"
        }
    },
    passengerData: [{
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        mobile: "9876543210",
        dateOfBirth: "1990-01-01",
        gender: "MALE",
        nationality: "IN"
    }],
    calculatedFare: {
        baseFare: 5000,
        tax: 500,
        addonsTotal: 0,
        vipServiceFee: 0,
        totalAmount: 5500,
        currency: "INR"
    }
};

/**
 * This test script demonstrates how to integrate with ARC Pay API
 * Based on the email information:
 * - The API supports several operations (Purchase, Authorize, Capture, Pay, Refund, Void)
 * - Authentication is password-based
 * - Has support for Tokenization, 3DS, AVS, etc.
 */

// Setup authentication for API requests
const getAuthConfig = () => {
    return {
        auth: {
            username: ARC_PAY_API_USERNAME,
            password: ARC_PAY_API_PASSWORD
        },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
};

// Main testing function
const testArcPayIntegration = async () => {
    try {
        // Generate a unique order ID (merchant reference number)
        const orderId = `FLIGHT-${Date.now()}`;
        console.log('\n========= ARC PAY INTEGRATION TEST =========');
        console.log('Test Order ID:', orderId);
        console.log('Test Flight Details:', JSON.stringify(testFlightData.bookingDetails.flight, null, 2));
        console.log('Test Passenger:', JSON.stringify(testFlightData.passengerData[0], null, 2));
        console.log('Test Amount:', `${testFlightData.calculatedFare.totalAmount} ${testFlightData.calculatedFare.currency}`);
        
        // Step 1: Create a session (mentioned in email)
        console.log('\n1. Creating payment session...');
        await createSession();
        
        // Step 2: Create order (based on API error response we received earlier)
        console.log('\n2. Creating order...');
        const orderResult = await createOrder(orderId);
        
        if (orderResult && orderResult.orderData) {
            // Step 3: Process payment with credit card
            console.log('\n3. Processing payment...');
            await processPayment(orderId, orderResult.orderData);
        }
    } catch (error) {
        console.error('\nTest failed with error:', error.message);
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error response:', JSON.stringify(error.response.data, null, 2));
        }
    }
};

// Step 1: Create a session
async function createSession() {
    try {
        // Based on the email, "Session" is a supported feature
        const sessionPayload = {
            merchantId: ARC_PAY_MERCHANT_ID
            // Additional fields might be needed based on actual API docs
        };
        
        console.log('Session request payload:', JSON.stringify(sessionPayload, null, 2));
        const response = await axios.post(`${ARC_PAY_API_URL}/session`, sessionPayload, getAuthConfig());
        console.log('Session created successfully:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Session creation failed:', error.message);
        console.error('Status:', error.response?.status);
        console.error('Error details:', JSON.stringify(error.response?.data || {}, null, 2));
        
        // Try alternative session approach
        try {
            console.log('\nTrying alternative session creation...');
            const altPayload = {
                // Try different payload structure
                apiUser: ARC_PAY_API_USERNAME,
                apiPassword: ARC_PAY_API_PASSWORD
            };
            
            const altResponse = await axios.post(`${ARC_PAY_API_URL}/session`, altPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            console.log('Alternative session created:', JSON.stringify(altResponse.data, null, 2));
            return altResponse.data;
        } catch (altError) {
            console.error('Alternative session creation also failed:', altError.message);
            if (altError.response) {
                console.error('Error details:', JSON.stringify(altError.response.data || {}, null, 2));
            }
            // Continue despite error, as we might be able to use other endpoints without a session
        }
    }
}

// Step 2: Create an order
async function createOrder(orderId) {
    try {
        // Based on previous error message, correct format is /order/{orderid}
        const orderPayload = {
            amount: testFlightData.calculatedFare.totalAmount,
            currency: testFlightData.calculatedFare.currency,
            description: `Flight: ${testFlightData.bookingDetails.flight.flightNumber} - ${testFlightData.bookingDetails.flight.departureCity} to ${testFlightData.bookingDetails.flight.arrivalCity}`,
            customer: {
                firstName: testFlightData.passengerData[0].firstName,
                lastName: testFlightData.passengerData[0].lastName,
                email: testFlightData.passengerData[0].email,
                phone: testFlightData.passengerData[0].mobile
            },
            billing: {
                address: {
                    street: "123 Test Street",
                    city: "Hyderabad",
                    state: "Telangana",
                    countryCode: "IN",
                    postalCode: "500001"
                }
            },
            transactionType: "PURCHASE", // Email mentions this is supported
            transactionSource: "INTERNET", // Email mentions this is supported
            returnUrl: "http://localhost:3000/payment/success",
            cancelUrl: "http://localhost:3000/payment/cancel"
        };
        
        console.log('Order creation payload:', JSON.stringify(orderPayload, null, 2));
        const response = await axios.post(`${ARC_PAY_API_URL}/order/${orderId}`, orderPayload, getAuthConfig());
        console.log('Order created successfully:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Order creation failed:', error.message);
        console.error('Status:', error.response?.status);
        console.error('Error details:', JSON.stringify(error.response?.data || {}, null, 2));
        
        // Try alternative order creation approach
        try {
            console.log('\nTrying alternative order creation...');
            // Try a different structure based on common gateway patterns
            const altPayload = {
                merchantOrderId: orderId,
                orderAmount: testFlightData.calculatedFare.totalAmount,
                orderCurrency: testFlightData.calculatedFare.currency,
                orderDescription: `Flight ${testFlightData.bookingDetails.flight.flightNumber}`,
                customerDetails: {
                    name: `${testFlightData.passengerData[0].firstName} ${testFlightData.passengerData[0].lastName}`,
                    email: testFlightData.passengerData[0].email,
                    phone: testFlightData.passengerData[0].mobile
                },
                returnUrl: "http://localhost:3000/payment/success",
                cancelUrl: "http://localhost:3000/payment/cancel"
            };
            
            const altResponse = await axios.post(`${ARC_PAY_API_URL}/order`, altPayload, getAuthConfig());
            console.log('Alternative order created:', JSON.stringify(altResponse.data, null, 2));
            return altResponse.data;
        } catch (altError) {
            console.error('Alternative order creation also failed:', altError.message);
            console.error('Error details:', JSON.stringify(altError.response?.data || {}, null, 2));
        }
    }
}

// Step 3: Process payment with test credit card details
async function processPayment(orderId, orderData) {
    try {
        // Use test credit card for sandbox environment
        const paymentPayload = {
            orderId: orderId,
            paymentMethod: {
                card: {
                    // Standard test credit card numbers
                    number: "4111111111111111", // Visa test card
                    expiryMonth: "12",
                    expiryYear: "2025",
                    securityCode: "123", // CVV
                    nameOnCard: `${testFlightData.passengerData[0].firstName} ${testFlightData.passengerData[0].lastName}`
                }
            },
            billingAddress: {
                street: "123 Test Street",
                city: "Hyderabad",
                state: "Telangana",
                countryCode: "IN",
                postalCode: "500001"
            }
        };
        
        // The endpoint might be different based on actual API docs
        // Trying with a common pattern for payment processing
        console.log('Payment processing payload:', JSON.stringify(paymentPayload, null, 2));
        const response = await axios.post(`${ARC_PAY_API_URL}/order/${orderId}/payment`, paymentPayload, getAuthConfig());
        console.log('Payment processed successfully:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Payment processing failed:', error.message);
        console.error('Status:', error.response?.status);
        console.error('Error details:', JSON.stringify(error.response?.data || {}, null, 2));
        
        // Try alternative payment endpoint
        try {
            console.log('\nTrying alternative payment processing...');
            // Different payload structure
            const altPayload = {
                card: {
                    number: "4111111111111111",
                    expiryMonth: "12",
                    expiryYear: "2025",
                    cvv: "123"
                },
                amount: testFlightData.calculatedFare.totalAmount,
                currency: testFlightData.calculatedFare.currency,
                customerEmail: testFlightData.passengerData[0].email
            };
            
            // Try different endpoint naming pattern
            const altResponse = await axios.post(`${ARC_PAY_API_URL}/pay`, altPayload, getAuthConfig());
            console.log('Alternative payment processed:', JSON.stringify(altResponse.data, null, 2));
            return altResponse.data;
        } catch (altError) {
            console.error('Alternative payment processing also failed:', altError.message);
            console.error('Error details:', JSON.stringify(altError.response?.data || {}, null, 2));
        }
    }
}

// Execute the test
testArcPayIntegration();