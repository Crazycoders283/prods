// API URL Configuration

// Get the base API URL from environment variables
const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://jet-set-go-psi.vercel.app/api';
  
  // Handle cases where API URL doesn't have protocol
  if (apiUrl && !apiUrl.startsWith('http') && !apiUrl.startsWith('/')) {
    return 'https://' + apiUrl;
  }
  
  // If VITE_API_URL is empty, use the Vercel deployment URL
  if (!apiUrl) {
    return 'https://jet-set-go-psi.vercel.app/api';
  }
  
  // Ensure URL has no trailing slash conflicts
  return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

// Create endpoint URLs
const createEndpoint = (path) => {
  // If path starts with slash and API_BASE_URL ends with slash, 
  // avoid double slash
  if (path.startsWith('/') && API_BASE_URL.endsWith('/')) {
    return `${API_BASE_URL}${path.substring(1)}`;
  }
  
  // If neither has slash, add one
  if (!path.startsWith('/') && !API_BASE_URL.endsWith('/')) {
    return `${API_BASE_URL}/${path}`;
  }
  
  return `${API_BASE_URL}${path}`;
};

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    register: createEndpoint('/auth/register'),
    login: createEndpoint('/auth/login'),
    me: createEndpoint('/auth/me')
  },
  
  // User endpoints
  user: {
    profile: createEndpoint('/users/profile'),
    update: createEndpoint('/users/update')
  },
  
  // Flight endpoints
  flights: {
    search: createEndpoint('/flights/search'),
    booking: createEndpoint('/flights/booking/flight-orders')
  },
  
  // Hotel endpoints
  hotels: {
    search: createEndpoint('/hotels/search'),
    booking: createEndpoint('/hotels/details'),
    offers: createEndpoint('/hotels/offers')
  },
  
  // Email endpoints
  email: {
    send: createEndpoint('/email/send'),
    callback: createEndpoint('/email/callback')
  }
};

export default {
  baseUrl: API_BASE_URL,
  endpoints
}; 