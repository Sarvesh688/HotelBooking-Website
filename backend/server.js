const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});