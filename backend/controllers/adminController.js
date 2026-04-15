const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if admin exists, if not create default
    let admin = await Admin.findOne({ email });
    if (!admin && email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      admin = new Admin({ email, password, name: 'Owner' });
      await admin.save();
    }
    
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    res.json({ success: true, token, admin: { id: admin._id, email: admin.email, name: admin.name } });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('roomType').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { adminLogin, getBookings, updateBookingStatus };