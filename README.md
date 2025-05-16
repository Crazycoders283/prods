# JetSet Go

A modern travel booking application with flight and hotel search capabilities.

## 🚀 Live Demo

The application is deployed and available at:
- Frontend: [https://jet-set-go-psi.vercel.app](https://jet-set-go-psi.vercel.app)
- API Base URL: [https://jet-set-go-psi.vercel.app/api](https://jet-set-go-psi.vercel.app/api)

## 📋 Features

- Flight search using Amadeus API
- Intuitive user interface for travel bookings
- Responsive design for mobile and desktop
- Authentication and user management

## 🛠️ Technologies Used

- React.js for frontend
- Node.js and Express for backend
- Supabase for database
- Amadeus API for flight data
- Vercel for deployment

## 🔧 API Configuration

The application uses a centralized API configuration system that handles multiple environments:

- Local development: `http://localhost:5001/api`
- Production: `https://jet-set-go-psi.vercel.app/api`

The API configuration is managed in `src/config/api.js` which ensures consistent URL handling across the application.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jet-set-go12/jet-set-go.git
cd jet-set-go
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in a `.env` file:
```
VITE_API_URL=http://localhost:5001/api
REACT_APP_AMADEUS_API_KEY=your_amadeus_key
REACT_APP_AMADEUS_API_SECRET=your_amadeus_secret
```

4. Start the development server:
```bash
npm run dev
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
