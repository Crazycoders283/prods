// API URL Configuration

// Default production and development URLs
const DEFAULT_PROD_URL = 'https://jet-set-go-psi.vercel.app/api';
const DEFAULT_DEV_PORT = 5004;

// Get the base API URL from environment variables - prioritize frontend-safe variables
const getApiBaseUrl = () => {
  // Check for local development environment first
  const isLocalDevelopment = window.location.hostname === 'localhost' || 
                             window.location.hostname === '127.0.0.1';
  
  // In local development, use the local API server
  if (isLocalDevelopment) {
    // Try to get port from environment variables
    let port;
    
    // First try Vite-injected environment variables (frontend-safe)
    if (import.meta.env?.VITE_API_PORT) {
      port = import.meta.env.VITE_API_PORT;
    }
    // Then try Node.js environment variables (only works in SSR/backend)
    else if (typeof process !== 'undefined' && process.env?.PORT) {
      port = process.env.PORT;
    }
    // Fall back to default port
    else {
      port = DEFAULT_DEV_PORT;
    }
    
    return `http://localhost:${port}/api`;
  }
  
  // For production, prioritize environment variables
  // First try Vite-injected variables (these are frontend-safe)
  let apiUrl = import.meta.env?.VITE_API_URL;
  
  // Then try VITE_APP_URL (which is also defined in your .env)
  if (!apiUrl && import.meta.env?.VITE_APP_URL) {
    apiUrl = import.meta.env.VITE_APP_URL;
  }
  
  // If still no URL, fall back to default production URL
  if (!apiUrl) {
    apiUrl = DEFAULT_PROD_URL;
    console.log('Using default production API URL:', apiUrl);
  }
  
  // Handle cases where API URL doesn't have protocol
  if (apiUrl && !apiUrl.startsWith('http') && !apiUrl.startsWith('/')) {
    apiUrl = 'https://' + apiUrl;
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

// Export the base URL directly for components to use
export { API_BASE_URL };

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