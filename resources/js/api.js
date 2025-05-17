import axios from 'axios';

// Determine API URL based on environment
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://jet-set-go-psi.vercel.app/api' // In production, use the correct Vercel URL
  : 'https://jet-set-go-psi.vercel.app/api'; // In development, use the same URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (tokenData) => api.post('/auth/google-login', tokenData),
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  }
};

// User API endpoints
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`)
};

export default api;
