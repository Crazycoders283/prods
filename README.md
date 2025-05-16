# JetSetGo Travel App

A modern full-stack travel application built with React, Node.js, and Supabase.

## Features

* User authentication with JWT
* Travel packages and bookings
* Flight search and booking interface
* Cruise and hotel accommodations
* Responsive design for all devices
* API integration with travel services

## Technology Stack

* Frontend: React, Bootstrap, Tailwind CSS
* Backend: Node.js, Express
* Database: Supabase
* Deployment: Vercel

## Live Demo

Visit [https://jetsetters-final.vercel.app](https://jetsetters-final.vercel.app) to see the application in action.

## Project Structure

```
├── backend/             # Backend Node.js code
│   ├── config/          # Database configuration
│   ├── controllers/     # API controllers
│   ├── middleware/      # Authentication middleware
│   ├── models/          # Supabase models
│   └── routes/          # API routes
├── public/              # Static assets
├── resources/           # Frontend React code
│   ├── css/             # Stylesheets
│   └── js/              # React components
└── server.js            # Express server entry point
```

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/Crazycoders283/jetset.git
   cd jetset
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=30d
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## Available Scripts

- `npm run dev`: Starts both backend and frontend in development mode
- `npm run server`: Runs just the Node.js backend
- `npm run client`: Runs just the React frontend
- `npm run build`: Builds the frontend for production
- `npm start`: Starts the production server

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user profile

### Users
- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get user by ID
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user

## Technologies Used

- **Frontend**: React, React Router, Axios, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase
- **Authentication**: JWT (JSON Web Tokens)

## Development

The project uses a concurrently package to run both frontend and backend servers simultaneously during development.

## Testing the API

A test script is included to verify API functionality:
```
node backend/test-api.js
```

## License

MIT
