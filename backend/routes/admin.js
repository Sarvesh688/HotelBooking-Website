const express = require('express');
const router = express.Router();
const { adminLogin, getBookings, updateBookingStatus } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.post('/login', adminLogin);
router.get('/bookings', protect, getBookings);
router.put('/bookings/:id', protect, updateBookingStatus);

module.exports = router;