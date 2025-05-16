import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Tv, Users, Heart, ArrowLeft, Search, X, Globe, Calendar, ChevronDown } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import axios from 'axios';

export default function HotelSearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(location.state?.searchParams || {});
  const [searchResults, setSearchResults] = useState(location.state?.searchResults || []);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState({});
  
  // Search states
  const [searchDestination, setSearchDestination] = useState(searchParams.cityCode || "");
  const [searchDates, setSearchDates] = useState("Select dates");
  const [searchTravelers, setSearchTravelers] = useState(searchParams.adults || 2);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [cityCode, setCityCode] = useState(searchParams.cityCode || "");
  
  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const datePickerRef = useRef(null);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Destination search suggestion states
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const destinationRef = useRef(null);

  // Fetch destinations from backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_APP_URL+'hotels/destinations', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (response.data.success) {
          setDestinationSuggestions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchDestinations();
  }, []);

  // Handle search submission
  const handleSearch = async () => {
    if (!searchDestination || !cityCode) {
      setSearchError("Please select a destination");
      return;
    }

    if (!selectedStartDate || !selectedEndDate) {
      setSearchError("Please select both check-in and check-out dates");
      return;
    }

    // Validate date range
    if (selectedEndDate <= selectedStartDate) {
      setSearchError("Check-out date must be after check-in date");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await axios.get(import.meta.env.VITE_APP_URL+'hotels/search', {
        params: {
          destination: cityCode,
          checkInDate: selectedStartDate.toISOString().split('T')[0],
          checkOutDate: selectedEndDate.toISOString().split('T')[0],
          travelers: searchTravelers
        }
      });

      if (response.data.success) {
        const hotelsData = response.data.data?.data || [];
        const formattedResults = hotelsData.map(hotel => ({
          id: hotel.hotelId || Math.random().toString(36).substr(2, 9),
          name: hotel.name || 'Hotel Name Not Available',
          location: hotel.address?.cityName || `${hotel.address?.countryCode || 'US'}`,
          price: '150', // Default price
          rating: hotel.rating || ((Math.random() * 2 + 3).toFixed(1)),
          image: hotel.media?.images?.[0]?.uri || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
          amenities: hotel.amenities || ['WiFi', 'Room Service', 'Restaurant']
        }));

        setSearchResults(formattedResults);
        setFilteredHotels(formattedResults);
        setSearchParams({
          cityCode,
          checkInDate: selectedStartDate.toISOString().split('T')[0],
          checkOutDate: selectedEndDate.toISOString().split('T')[0],
          adults: searchTravelers
        });
      } else {
        setError(response.data.message || "No hotels found");
      }
    } catch (error) {
      console.error('Error searching hotels:', error);
      setError(error.response?.data?.message || "Error searching hotels");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle destination input
  const handleDestinationInput = (value) => {
    setSearchDestination(value);
    if (value.length > 0) {
      const filtered = destinationSuggestions.filter(dest => 
        dest.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowDestinationSuggestions(filtered.length > 0);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  // Handle destination selection
  const handleDestinationSelect = (destination) => {
    setSearchDestination(destination.name);
    setCityCode(destination.code);
    setShowDestinationSuggestions(false);
  };

  // Update date range display
  const updateDateRange = (startDate, endDate) => {
    if (!startDate) {
      setSearchDates('Select dates');
      return;
    }

    const formattedStartDate = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (!endDate) {
      setSearchDates(`${formattedStartDate} - Select checkout`);
      return;
    }

    const formattedEndDate = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    setSearchDates(`${formattedStartDate} - ${formattedEndDate}`);
  };

  // Fetch search results if not available in location state
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchResults.length && searchParams.cityCode) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get('http://localhost:5001/api/hotels/search', {
            params: {
              destination: searchParams.cityCode,
              checkInDate: searchParams.checkInDate,
              checkOutDate: searchParams.checkOutDate,
              travelers: searchParams.adults
            }
          });

          if (response.data.success) {
            // Access the nested data array
            const hotelsData = response.data.data?.data || [];
            console.log('Raw Hotels Data:', hotelsData);
            
            const formattedResults = hotelsData.map(hotel => {
              // Extract price from the API response
              let hotelPrice = '0';
              
              // Try to get price from different possible locations in the response
              if (hotel.offers && hotel.offers.length > 0) {
                const offer = hotel.offers[0];
                if (offer.price) {
                  hotelPrice = offer.price.total || offer.price.base || offer.price;
                }
              } else if (hotel.price) {
                hotelPrice = typeof hotel.price === 'object' ? hotel.price.total || hotel.price.base : hotel.price;
              } else if (hotel.rates && hotel.rates.length > 0) {
                const rate = hotel.rates[0];
                hotelPrice = rate.total || rate.base || rate.price;
              }

              // If no price found, generate a random price between 100 and 500
              if (hotelPrice === '0' || hotelPrice === 0) {
                hotelPrice = (Math.random() * 400 + 100).toFixed(2);
              }

              // Ensure price is a valid number and format it
              const numericPrice = parseFloat(hotelPrice);
              hotelPrice = isNaN(numericPrice) ? '0' : numericPrice.toFixed(2);

              console.log('Processing hotel:', {
                name: hotel.name,
                hotelId: hotel.hotelId,
                chainCode: hotel.chainCode,
                finalPrice: hotelPrice
              });

              return {
                id: hotel.hotelId || Math.random().toString(36).substr(2, 9),
                name: hotel.name || 'Hotel Name Not Available',
                location: hotel.address?.cityName || `${hotel.address?.countryCode || 'US'}`,
                price: hotelPrice,
                rating: hotel.rating || ((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3.0 and 5.0
                image: hotel.media?.images?.[0]?.uri || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
                amenities: hotel.amenities || ['WiFi', 'Room Service', 'Restaurant']
              };
            });
            
            console.log('Formatted Results with Prices:', formattedResults);
            setSearchResults(formattedResults);
            setFilteredHotels(formattedResults);
          } else {
            setError(response.data.message || "No hotels found");
          }
        } catch (error) {
          console.error('Error fetching hotels:', error);
          setError(error.response?.data?.message || "Error fetching hotels");
        } finally {
          setIsLoading(false);
        }
      } else {
        setFilteredHotels(searchResults);
      }
    };

    fetchSearchResults();
  }, [searchParams, searchResults]);

  // Format price for display
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? '$0' : `$${numPrice.toFixed(2)}`;
  };

  // Filter and sort hotels
  useEffect(() => {
    if (!searchResults.length) return;

    let filtered = [...searchResults];

    // Apply search query filter
    if (searchDestination) {
      const query = searchDestination.toLowerCase();
      filtered = filtered.filter(hotel => 
        hotel.name.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query) ||
        hotel.amenities.some(amenity => amenity.toLowerCase().includes(query))
      );
    }

    // Apply price filter
    filtered = filtered.filter(hotel => {
      const price = parseFloat(hotel.price);
      return !isNaN(price) && price >= priceRange[0] && price <= priceRange[1];
    });

    // Apply amenities filter
    if (selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel =>
        selectedAmenities.every(amenity =>
          hotel.amenities.includes(amenity)
        )
      );
    }

    // Apply rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter(hotel =>
        parseFloat(hotel.rating) >= selectedRating
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      default:
        // Keep original order for 'recommended'
        break;
    }

    setFilteredHotels(filtered);
  }, [searchResults, sortBy, priceRange, selectedAmenities, selectedRating, searchDestination]);

  const toggleFavorite = (hotelId) => {
    setFavorites(prev => ({
      ...prev,
      [hotelId]: !prev[hotelId]
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Search
        </button>
      </div>
    );
  }

  if (!filteredHotels.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-gray-500 text-xl mb-4">No hotels found matching your criteria</div>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Modify Search
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar forceScrolled={true} />
      {/* Add a 120px margin below navbar */}
      <div style={{ marginTop: '120px' }} />

      {/* Search/Filter Section - now with 120px gap below navbar */}
      <div className="bg-white shadow-lg rounded-xl max-w-7xl mx-auto px-4 py-6 mb-8">
        {/* Search Form */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 items-start">
          {/* Destination */}
          <div className="flex flex-col space-y-2 p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <label className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Destination
            </label>
            <div className="relative group" ref={destinationRef}>
              <input
                type="text"
                value={searchDestination}
                onChange={(e) => handleDestinationInput(e.target.value)}
                onFocus={() => {
                  if (searchDestination.length > 0) {
                    setShowDestinationSuggestions(true);
                  }
                }}
                placeholder="Where do you want to go?"
                className="w-full py-3 pl-4 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-blue-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <div className="p-1 rounded-full bg-blue-50">
                  <Globe className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              {/* Destination Suggestions Dropdown */}
              {showDestinationSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {filteredSuggestions.map((destination, index) => (
                      <li 
                        key={index}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                        onClick={() => handleDestinationSelect(destination)}
                      >
                        <MapPin className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{destination.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          {/* Travel Dates */}
          <div className="flex flex-col space-y-2 p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <label className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Travel Dates
            </label>
            <div 
              className="relative group cursor-pointer"
              onClick={() => setShowDatePicker(!showDatePicker)}
              ref={datePickerRef}
            >
              <div className="w-full py-3 pl-4 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl hover:border-blue-200 transition-all duration-300">
                <span className="text-gray-700">{searchDates}</span>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="p-1 rounded-full bg-blue-50">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
              </div>
              {/* Date Picker */}
              {showDatePicker && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(currentMonth - 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronDown className="rotate-90" size={20} />
                    </button>
                    <span className="font-medium">
                      {months[currentMonth]} {currentYear}
                    </span>
                    <button
                      onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0);
                          setCurrentYear(currentYear + 1);
                        } else {
                          setCurrentMonth(currentMonth + 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronDown className="-rotate-90" size={20} />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm text-gray-500 py-1">
                        {day}
                      </div>
                    ))}
                    {Array.from({ length: new Date(currentYear, currentMonth, 1).getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(currentYear, currentMonth, day);
                      const isSelected = selectedStartDate && selectedEndDate && 
                        date >= selectedStartDate && date <= selectedEndDate;
                      const isStart = selectedStartDate && date.getTime() === selectedStartDate.getTime();
                      const isEnd = selectedEndDate && date.getTime() === selectedEndDate.getTime();
                      const isInRange = selectedStartDate && !selectedEndDate && 
                        date > selectedStartDate && date <= (hoverDate || selectedStartDate);

                      return (
                        <button
                          key={day}
                          onClick={() => {
                            if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                              setSelectedStartDate(date);
                              setSelectedEndDate(null);
                              updateDateRange(date, null);
                            } else if (date > selectedStartDate) {
                              setSelectedEndDate(date);
                              updateDateRange(selectedStartDate, date);
                            } else {
                              setSelectedStartDate(date);
                              setSelectedEndDate(null);
                              updateDateRange(date, null);
                            }
                          }}
                          onMouseEnter={() => {
                            if (selectedStartDate && !selectedEndDate) {
                              setHoverDate(date);
                            }
                          }}
                          className={`
                            p-2 rounded-lg text-sm
                            ${isSelected ? 'bg-blue-100 text-blue-700' : ''}
                            ${isStart ? 'bg-blue-500 text-white rounded-l-lg' : ''}
                            ${isEnd ? 'bg-blue-500 text-white rounded-r-lg' : ''}
                            ${isInRange ? 'bg-blue-50 text-blue-700' : ''}
                            ${!isSelected && !isStart && !isEnd && !isInRange ? 'hover:bg-gray-100' : ''}
                          `}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Travelers */}
          <div className="flex flex-col space-y-2 p-4 bg-white rounded-xl shadow-md border border-gray-100">
            <label className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Travelers
            </label>
            <div 
              onClick={() => setSearchTravelers(searchTravelers === 2 ? 4 : 2)}
              className="flex items-center w-full py-3 pl-4 pr-10 bg-gray-50/80 border border-gray-200 rounded-xl cursor-pointer transition-all duration-300 hover:border-blue-200"
            >
              <span className="text-gray-700">{searchTravelers} Travelers</span>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="p-1 rounded-full bg-blue-50">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
          {/* Search Button */}
          <div className="flex flex-col justify-end">
            <button 
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-12 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/30"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>Search Hotels</span>
                </>
              )}
            </button>
          </div>
        </div>
        {searchError && (
          <div className="mt-4 text-center text-red-500 text-sm bg-red-50 p-2 rounded-lg">
            {searchError}
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {filteredHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Hotel Image */}
              <div className="relative h-48">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleFavorite(hotel.id)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${favorites[hotel.id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                  />
                </button>
              </div>

              {/* Hotel Info */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <p className="text-sm text-gray-600">{hotel.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-900">{hotel.rating}</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {hotel.amenities?.map((amenity, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price and Book Button */}
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{formatPrice(hotel.price)}</p>
                    <p className="text-sm text-gray-600">per night</p>
                  </div>
                  <button
                    onClick={() => navigate(`/hotel-details`, { 
                      state: { 
                        hotelData: hotel,
                        searchParams: searchParams
                      } 
                    })}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No hotels found matching your criteria</h3>
            <p className="mt-2 text-gray-600">Try adjusting your filters or search for a different location.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 
