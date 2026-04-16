const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { calculateTotalPrice } = require('../utils/availability');
const { sendBookingConfirmationEmail } = require('../utils/sendEmail');
const { sendWhatsAppMessage, sendOwnerWhatsApp } = require('../utils/sendWhatsApp');

const calcNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  start.setHours(0, 0, 0, 0);
  const end = new Date(checkOut);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

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

    const nights = calcNights(checkIn, checkOut);
    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
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
    const order = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: booking._id.toString(),
      payment_capture: 1
    });

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Booking.findByIdAndUpdate(bookingId, { status: 'failed' });
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Confirm booking
    booking.status = 'confirmed';
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.paymentId = razorpay_payment_id;
    await booking.save();

    console.log('✅ Booking confirmed:', booking._id);

    const room = await Room.findById(booking.roomType);

    // Send confirmations (non-blocking)
    try {
      await sendBookingConfirmationEmail(booking, room, false);
      await sendWhatsAppMessage(booking.guestPhone, booking, room);
      await sendOwnerWhatsApp(booking, room);
    } catch (notifyError) {
      console.error('Notification error (non-critical):', notifyError);
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
