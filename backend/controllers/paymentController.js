const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const { checkRoomAvailability, calculateTotalPrice } = require('../utils/availability');
const { sendBookingConfirmationEmail } = require('../utils/sendEmail');
const { sendWhatsAppMessage, sendOwnerWhatsApp } = require('../utils/sendWhatsApp');

const calcNights = (checkIn, checkOut) => {
  const start = new Date(checkIn); start.setHours(0, 0, 0, 0);
  const end = new Date(checkOut); end.setHours(0, 0, 0, 0);
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
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const nights = calcNights(checkIn, checkOut);
    if (nights <= 0) return res.status(400).json({ message: 'Check-out must be after check-in' });

    // Check availability before creating order
    const availability = await checkRoomAvailability(roomId, checkIn, checkOut, quantity);
    if (!availability.available) {
      return res.status(400).json({ message: availability.message });
    }

    const totalPrice = calculateTotalPrice(room.price, nights, quantity);

    // Create Razorpay order — store booking details in notes (no DB save yet)
    const order = await razorpay.orders.create({
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: `${roomId}_${Date.now()}`,
      payment_capture: 1,
      notes: {
        roomId,
        roomName: room.name,
        checkIn,
        checkOut,
        guestName,
        guestEmail,
        guestPhone,
        totalAdults: String(totalAdults),
        totalChildren: String(totalChildren),
        quantity: String(quantity),
        totalPrice: String(totalPrice),
        nights: String(nights)
      }
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Fetch order details from Razorpay to get booking notes
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const notes = order.notes;

    if (!notes || !notes.roomId) {
      return res.status(400).json({ message: 'Order details not found' });
    }

    const room = await Room.findById(notes.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Final availability check before confirming
    const availability = await checkRoomAvailability(
      notes.roomId, notes.checkIn, notes.checkOut, parseInt(notes.quantity)
    );
    if (!availability.available) {
      return res.status(400).json({ message: 'Rooms no longer available. Please contact hotel.' });
    }

    // NOW save to DB — only confirmed bookings
    const booking = new Booking({
      roomType: notes.roomId,
      roomName: notes.roomName,
      checkIn: new Date(notes.checkIn),
      checkOut: new Date(notes.checkOut),
      guestName: notes.guestName,
      guestEmail: notes.guestEmail,
      guestPhone: notes.guestPhone,
      totalAdults: parseInt(notes.totalAdults),
      totalChildren: parseInt(notes.totalChildren),
      quantity: parseInt(notes.quantity),
      totalPrice: parseInt(notes.totalPrice),
      nights: parseInt(notes.nights),
      status: 'confirmed',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentId: razorpay_payment_id
    });

    await booking.save();
    console.log('✅ Booking confirmed and saved:', booking._id);

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
