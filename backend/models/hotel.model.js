import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  amenities: [{
    type: String
  }],
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  rooms: [{
    type: {
      type: String,
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    available: {
      type: Boolean,
      default: true
    }
  }],
  policies: {
    checkIn: {
      type: String,
      required: true
    },
    checkOut: {
      type: String,
      required: true
    },
    cancellation: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
hotelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel; 