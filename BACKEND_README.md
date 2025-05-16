# JetSet Node.js Backend

## Overview
This document outlines the Node.js backend that's been configured to replace the Laravel backend for the JetSet application.

## Tech Stack
- **Node.js & Express**: Backend server framework
- **MongoDB**: Database (requires separate installation)
- **JWT**: Authentication & Authorization
- **Mongoose**: MongoDB object modeling

## Directory Structure
```
/backend
  /controllers      # Request handlers
  /models           # Database models
  /routes           # API routes
  /middleware       # Authentication middleware
  /config           # Configuration files
  /utils            # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user profile (requires authentication)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete a user

## Configuration
The backend uses the following environment variables from `.env.node`:

```
PORT=5000 
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/jetset
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173
```

## Setup Instructions

1. **Install MongoDB** if not already installed
2. **Copy environment variables**
   ```bash
   cp .env.node .env
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start both the Node.js backend and React frontend concurrently.

## Frontend Integration
The frontend integration has been set up with:

1. **API Client** (`resources/js/api/index.js`)
   - Configured Axios instance with authentication
   - API endpoints for auth and users

2. **Authentication Context** (`resources/js/contexts/AuthContext.jsx`)
   - Provider for authentication state
   - Methods for login, register, logout
   - User profile management

## Usage in Frontend

```jsx
import { useAuth } from '../contexts/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated, loading, error } = useAuth();
  
  const handleLogin = async (credentials) => {
    const result = await login(credentials);
    if (result.success) {
      // Redirect or perform actions after successful login
    }
  };
  
  return (
    // Your login form
  );
}
```
