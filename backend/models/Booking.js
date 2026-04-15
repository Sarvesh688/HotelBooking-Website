const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  roomName: String,
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guestName: {
    type: String,
    required: true
  },
  guestEmail: {
    type: String,
    required: true
  },
  guestPhone: {
    type: String,
    required: true
  },
  totalAdults: {
    type: Number,
    required: true
  },
  totalChildren: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  nights: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  bookingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for TTL cleanup of pending bookings older than 30 minutes
bookingSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800, partialFilterExpression: { status: 'pending' } });

module.exports = mongoose.model('Booking', bookingSchema);