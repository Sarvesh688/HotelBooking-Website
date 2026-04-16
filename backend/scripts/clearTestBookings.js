/**
 * Clears ALL bookings from the database (test data cleanup).
 * Run once: node scripts/clearTestBookings.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Booking = require('../models/Booking');

async function clear() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const result = await Booking.deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} test booking(s)`);

  await mongoose.disconnect();
  process.exit(0);
}

clear().catch(err => {
  console.error(err);
  process.exit(1);
});
