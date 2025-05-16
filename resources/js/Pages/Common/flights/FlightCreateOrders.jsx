import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, Calendar, Lock, CheckCircle, ArrowLeft, 
  Ticket, ShieldCheck, Loader, AlertCircle, Check,
  Plane
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../Navbar';
import Footer from '../Footer';
import withPageElements from '../PageWrapper';
import { endpoints } from '../../../../config/api';

function FlightCreateOrders() {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState(null);
  const [pnr, setPnr] = useState(null);
  const [error, setError] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    // Check if we have the required data from the payment step
    if (location.state && location.state.paymentSuccess) {
      setOrderData(location.state);
      setLoading(false);
      // Process the order automatically when component loads
      processFlightOrder(location.state);
    } else {
      // If no data or payment was not successful, redirect to payment page
      navigate("/flight-payment");
    }
  }, [location, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Function to call the Flight Create Orders API
  // API: POST /v1/booking/flight-orders (https://api.amadeus.com/v1/booking/flight-orders)
  const processFlightOrder = async (data) => {
    setProcessingOrder(true);
    try {
      // Ensure we have valid flight offer data
      const flightOffer = data.bookingDetails?.flightOffer || {};
      
      // Check if we're missing critical flight data
      if (!flightOffer || Object.keys(flightOffer).length === 0) {
        console.error('Missing flight offer data in booking details');
        throw new Error('Missing flight details. Please try searching for flights again.');
      }
      
      // Format traveler details according to Amadeus API specs
      const travelers = data.passengerData?.map((passenger, index) => ({
        id: `${index + 1}`,
        dateOfBirth: passenger.dateOfBirth || '1990-01-01',
        name: {
          firstName: passenger.firstName,
          lastName: passenger.lastName
        },
        gender: passenger.gender || 'MALE', // MALE, FEMALE, UNSPECIFIED or UNDISCLOSED
        contact: {
          emailAddress: data.contactDetails?.email,
          phones: [{
            deviceType: 'MOBILE',
            countryCallingCode: data.contactDetails?.countryCode || '91',
            number: data.contactDetails?.phoneNumber || '9999999999'
          }]
        },
        documents: passenger.passportNumber ? [{
          documentType: 'PASSPORT',
          number: passenger.passportNumber,
          expiryDate: passenger.passportExpiry || '2030-01-01',
          issuanceCountry: passenger.nationality || 'IN',
          nationality: passenger.nationality || 'IN',
          holder: true
        }] : []
      })) || [];

      // If we don't have passenger data, create placeholder data
      if (!travelers.length) {
        console.warn('Missing passenger data, creating placeholder traveler');
        travelers.push({
          id: '1',
          dateOfBirth: '1990-01-01',
          name: {
            firstName: data.contactDetails?.firstName || 'Guest',
            lastName: data.contactDetails?.lastName || 'User'
          },
          gender: 'MALE',
          contact: {
            emailAddress: data.contactDetails?.email || 'guest@example.com',
            phones: [{
              deviceType: 'MOBILE',
              countryCallingCode: '91',
              number: data.contactDetails?.phoneNumber || '9999999999'
            }]
          }
        });
      }

      // Prepare payment information if available
      const formOfPayments = [{
        other: {
          method: 'CREDIT_CARD',
          flightOfferIds: [flightOffer.id || '1']
        }
      }];

      // Format request according to Amadeus API structure
      const flightOrderRequest = {
        data: {
          type: 'flight-order',
          flightOffers: [flightOffer],
          travelers: travelers,
          remarks: {
            general: [{
              subType: 'GENERAL_MISCELLANEOUS',
              text: 'ONLINE BOOKING FROM FLIGHT BOOKING PLATFORM'
            }]
          },
          ticketingAgreement: {
            option: 'DELAY_TO_CANCEL',
            delay: '6D'
          },
          contacts: [{
            addresseeName: {
              firstName: data.contactDetails?.firstName || travelers[0]?.name?.firstName || 'Guest',
              lastName: data.contactDetails?.lastName || travelers[0]?.name?.lastName || 'User'
            },
            companyName: 'JetSet GO',
            purpose: 'STANDARD',
            phones: [{
              deviceType: 'MOBILE',
              countryCallingCode: data.contactDetails?.countryCode || '91',
              number: data.contactDetails?.phoneNumber || '9999999999'
            }],
            emailAddress: data.contactDetails?.email || 'guest@example.com'
          }],
          formOfPayments: formOfPayments
        }
      };
      
      console.log('Flight order request payload:', flightOrderRequest);
      
      // Make API request to create the flight order
      const response = await axios.post(endpoints.flights.booking, flightOrderRequest);
      
      console.log('Flight order creation response:', response.data);
      
      if (response.data.success) {
        setOrderSuccess(true);
        setBookingReference(response.data.data.bookingReference || response.data.data.id);
        setPnr(response.data.data.pnr || response.data.data.associatedRecords?.[0]?.reference);
        
        // Extract additional booking information if available
        const orderDetails = {
          reference: response.data.data.bookingReference || response.data.data.id,
          pnr: response.data.data.pnr || response.data.data.associatedRecords?.[0]?.reference,
          status: response.data.data.status || 'CONFIRMED',
          createdAt: response.data.data.createdAt || new Date().toISOString(),
          travelers: response.data.data.travelers || travelers
        };
        
        // Wait 2 seconds and then navigate to success page
        setTimeout(() => {
          navigate("/flight-booking-success", {
            state: {
              ...data,
              bookingReference: orderDetails.reference,
              pnr: orderDetails.pnr,
              orderCreatedAt: orderDetails.createdAt,
              orderStatus: orderDetails.status
            }
          });
        }, 2000);
      } else {
        setOrderSuccess(false);
        handleApiError(response.data);
      }
    } catch (err) {
      console.error('Error creating flight order:', err);
      setOrderSuccess(false);
      handleApiError(err);
    } finally {
      setProcessingOrder(false);
    }
  };

  // Handle API errors based on Amadeus error codes
  const handleApiError = (err) => {
    // Check if it's an Amadeus API error response
    if (err.response?.data?.errors) {
      const amadeusError = err.response.data.errors[0];
      
      // Handle specific error codes
      switch (amadeusError.code) {
        case 477:
          setError(`Invalid format: ${amadeusError.detail || 'Please check your booking details'}`);
          break;
        case 141:
          setError('A system error occurred. Please try again later.');
          break;
        default:
          setError(`${amadeusError.title || 'Error'}: ${amadeusError.detail || 'An error occurred during booking'}`);
      }
    } else if (err.response?.data?.error) {
      // Handle our backend error format
      setError(err.response.data.error || 'Failed to create flight order');
    } else {
      // Handle general errors
      setError(err.message || 'An error occurred while creating your flight order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
        <Navbar forceScrolled={true} />
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-center text-gray-600 font-medium text-lg">Processing Your Booking...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-gray-100 min-h-screen">
      <Navbar forceScrolled={true} />
      
      {/* Content Container - Starting after navbar */}
      <div className="pt-20 animate-fadeIn">
        {/* Order Processing Title */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-2">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Flight Booking</h1>
              <p className="text-gray-600">Creating your flight order with confirmation details</p>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto">
          <div className={`transition-opacity duration-500 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center justify-between max-w-3xl mx-auto min-w-[500px]">
              {[
                { icon: <Check />, label: "Flight Selection", completed: true },
                { icon: <Check />, label: "Passenger Details", completed: true },
                { icon: <Check />, label: "Payment", completed: true },
                { icon: <CheckCircle />, label: "Confirmation", completed: orderSuccess, active: !orderSuccess }
              ].map((step, index) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 
                      ${step.completed ? 'bg-green-100 text-green-600 border-green-500' : 
                        step.active ? 'bg-blue-600 text-white border-blue-600 animate-pulse shadow-md shadow-blue-300' : 
                        'bg-gray-100 text-gray-400 border-gray-300'}`}>
                      {step.icon}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500
                      ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
              <div className="text-center">
                {processingOrder ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full border-4 border-blue-50 flex items-center justify-center">
                      <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Creating Your Flight Booking</h2>
                    <p className="text-gray-600">
                      We're securing your flight reservation with the airline...
                    </p>
                    <div className="pt-2 pb-2">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-progress-indeterminate"></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      This may take a few moments. Please don't close this window.
                    </p>
                  </div>
                ) : orderSuccess ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Booking Confirmed!</h2>
                    <p className="text-gray-600">
                      Your flight has been successfully booked. You'll be redirected to the confirmation page shortly.
                    </p>
                    
                    <div className="py-3">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Booking Reference:</span>
                          <span className="font-semibold text-gray-800">{bookingReference || 'Generated'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">PNR Number:</span>
                          <span className="font-semibold text-gray-800">{pnr || 'Generated'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="animate-pulse">
                      <p className="text-sm text-gray-600">
                        Redirecting to your booking confirmation...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Booking Failed</h2>
                    <p className="text-gray-600">
                      We encountered an issue while creating your flight booking.
                    </p>
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm">
                      {error || "An unexpected error occurred. Please try again."}
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => navigate("/flight-payment")}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Return to Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Add CSS for the animate-progress-indeterminate class */}
      <style jsx>{`
        @keyframes progress-indeterminate {
          0% {
            transform: translateX(-100%);
            width: 50%;
          }
          50% {
            transform: translateX(0%);
            width: 50%;
          }
          100% {
            transform: translateX(100%);
            width: 50%;
          }
        }
        .animate-progress-indeterminate {
          animation: progress-indeterminate 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default withPageElements(FlightCreateOrders); 