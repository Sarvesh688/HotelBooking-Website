const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['double', 'triple', 'family'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  maxAdults: {
    type: Number,
    required: true
  },
  maxChildren: {
    type: Number,
    required: true
  },
  totalRooms: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amenities: [String],
  imageUrl: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);