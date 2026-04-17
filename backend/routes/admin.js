const express = require('express');
const router = express.Router();
const { adminLogin, getBookings, updateBookingStatus } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

router.post('/login', adminLogin);
router.get('/bookings', protect, getBookings);
router.put('/bookings/:id', protect, updateBookingStatus);
router.delete('/bookings/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Room management
router.get('/rooms', protect, async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/rooms/:id', protect, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });
    const totalRevenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayBookings = await Booking.countDocuments({ status: 'confirmed', createdAt: { $gte: todayStart } });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayBookings,
      pendingBookings
    });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;