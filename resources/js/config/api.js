// API configuration
const config = {
  baseURL: `http://localhost:${process.env.BACKEND_PORT || 5001}`,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default config;
