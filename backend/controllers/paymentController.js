const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { checkRoomAvailability, calculateTotalPrice } = require('../utils/availability');
const { sendBookingConfirmationEmail } = require('../utils/sendEmail');
const { sendWhatsAppMessage, sendOwnerWhatsApp } = require('../utils/sendWhatsApp');
const moment = require('moment');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guestName, guestEmail, guestPhone, totalAdults, totalChildren, quantity } = req.body;
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const nights = Math.ceil(moment(checkOut).diff(moment(checkIn), 'days', true));
    if (nights <= 0) {
      return res.status(400).json({ message: 'Invalid dates' });
    }
    
    // Check availability
    const availability = await checkRoomAvailability(roomId, checkIn, checkOut, quantity);
    if (!availability.available) {
      return res.status(400).json({ message: availability.message });
    }
    
    const totalPrice = calculateTotalPrice(room.price, nights, quantity);
    
    // Create pending booking
    const booking = new Booking({
      roomType: roomId,
      roomName: room.name,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guestName,
      guestEmail,
      guestPhone,
      totalAdults,
      totalChildren,
      quantity,
      totalPrice,
      nights,
      status: 'pending'
    });
    
    await booking.save();
    
    // Create Razorpay order
    const options = {
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: booking._id.toString(),
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    
    booking.razorpayOrderId = order.id;
    await booking.save();
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
    
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    console.log('📝 Verify payment called with:', req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    
    const isAuthentic = expectedSignature === razorpay_signature;
    
    if (!isAuthentic) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'failed' });
      return res.status(400).json({ message: 'Payment verification failed' });
    }
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Final availability check before confirming
    const availability = await checkRoomAvailability(
      booking.roomType, 
      booking.checkIn, 
      booking.checkOut, 
      booking.quantity,
      bookingId
    );
    
    if (!availability.available) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'failed' });
      return res.status(400).json({ message: 'Rooms no longer available. Please contact hotel.' });
    }
    
    // Update booking
    booking.status = 'confirmed';
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentId = razorpay_payment_id;
    await booking.save();
    console.log('✅ Booking saved with status: confirmed');
    console.log('📊 Booking ID:', booking._id);
    
    const room = await Room.findById(booking.roomType);
    
    // Send confirmations
    try {
      await sendBookingConfirmationEmail(booking, room, false);
      await sendWhatsAppMessage(booking.guestPhone, booking, room);
      await sendOwnerWhatsApp(booking, room);
    } catch (emailError) {
      console.error('Notification error:', emailError);
    }
    
    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      bookingId: booking._id
    });
    
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };