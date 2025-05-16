import React, { useState } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaCalendarAlt, FaUser } from 'react-icons/fa';
import axios from 'axios';

const HotelSearch = () => {
 
const location = useLocation();
const hotels = location.state?.hotels;

  // Try to load last search from session storage
  const [searchParams, setSearchParams] = useState(() => {
    const savedSearch = sessionStorage.getItem('lastHotelSearch');
    if (savedSearch) {
      const parsed = JSON.parse(savedSearch);
      // Only use saved search if it's less than 24 hours old
      if (new Date().getTime() - new Date(parsed.timestamp).getTime() < 24 * 60 * 60 * 1000) {
        return {
          cityCode: parsed.cityCode,
          checkInDate: parsed.checkInDate,
          checkOutDate: parsed.checkOutDate,
          adults: parsed.adults
        };
      }
    }
    return {
      cityCode: '',
      checkInDate: new Date().toISOString().split('T')[0],
      checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      adults: 2
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Popular city codes for Amadeus API
  const popularCities = [
    { code: 'PAR', name: 'Paris', country: 'France' },
    { code: 'LON', name: 'London', country: 'United Kingdom' },
    { code: 'NYC', name: 'New York', country: 'United States' },
    { code: 'TYO', name: 'Tokyo', country: 'Japan' },
    { code: 'ROM', name: 'Rome', country: 'Italy' },
    { code: 'SYD', name: 'Sydney', country: 'Australia' },
    { code: 'SIN', name: 'Singapore', country: 'Singapore' },
    { code: 'DXB', name: 'Dubai', country: 'UAE' },
    { code: 'BKK', name: 'Bangkok', country: 'Thailand' },
    { code: 'BCN', name: 'Barcelona', country: 'Spain' },
    { code: 'AMS', name: 'Amsterdam', country: 'Netherlands' },
    { code: 'HKG', name: 'Hong Kong', country: 'China' }
  ];

  const validateDates = () => {
    const checkIn = new Date(searchParams.checkInDate);
    const checkOut = new Date(searchParams.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      setError('Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return false;
    }

    const maxStay = new Date(today);
    maxStay.setFullYear(maxStay.getFullYear() + 1);
    if (checkIn > maxStay || checkOut > maxStay) {
      setError('Dates cannot be more than 1 year in advance');
      return false;
    }

    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateDates()) {
      setLoading(false);
      return;
    }

    try {
      // Format dates as YYYY-MM-DD
      const formattedDates = `${searchParams.checkInDate} - ${searchParams.checkOutDate}`;

      const response = await axios.post('/api/hotels/search', {
        destination: searchParams.cityCode,
        dates: formattedDates,
        travelers: searchParams.adults,
        packageType: 'All Inclusive'
      });

      if (response.data.success) {
        // Store search params in session storage for persistence
        sessionStorage.setItem('lastHotelSearch', JSON.stringify({
          ...searchParams,
          timestamp: new Date().toISOString()
        }));

        navigate('/hotels/results', { 
          state: { 
            searchResults: response.data.data,
            searchParams: searchParams 
          }
        });
      } else {
        setError(response.data.message || 'Failed to fetch hotels');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date, field) => {
    const formattedDate = date.toISOString().split('T')[0];
    setSearchParams(prev => ({
      ...prev,
      [field]: formattedDate
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Find Your Perfect Hotel
          </h1>

          <form onSubmit={handleSearch} className="space-y-6">
            {/* City Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Destination
              </label>
              <select
                value={searchParams.cityCode}
                onChange={(e) => setSearchParams({...searchParams, cityCode: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a destination</option>
                {popularCities.map((city) => (
                  <option key={city.code} value={city.code}>
                    {city.name}, {city.country} ({city.code})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Popular destinations worldwide
              </p>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={new Date(searchParams.checkInDate)}
                    onChange={(date) => handleDateChange(date, 'checkInDate')}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={new Date(searchParams.checkOutDate)}
                    onChange={(date) => handleDateChange(date, 'checkOutDate')}
                    minDate={new Date(searchParams.checkInDate)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Number of Adults */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Adults
              </label>
              <div className="relative">
                <select
                  value={searchParams.adults}
                  onChange={(e) => setSearchParams({...searchParams, adults: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                  ))}
                </select>
                <FaUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSearch />
                  <span>Search Hotels</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;
