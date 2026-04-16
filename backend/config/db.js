const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');

    // Drop the old broken TTL index on Booking collection if it exists
    try {
      const Booking = require('../models/Booking');
      await Booking.collection.dropIndex('createdAt_1');
      console.log('Dropped old TTL index on Booking.createdAt');
    } catch (e) {
      // Index doesn't exist — that's fine
    }
    
    // Seed initial rooms if none exist
    const Room = require('../models/Room');
    const count = await Room.countDocuments();
    if (count === 0) {
      await Room.insertMany([
        {
          name: 'Double Bed Room',
          type: 'double',
          price: 2000,
          maxAdults: 2,
          maxChildren: 1,
          totalRooms: 6,
          description: 'Comfortable double bed room with attached toilet and geyser. Perfect for couples or small families.',
          amenities: ['Attached Bathroom', 'Geyser', 'TV', 'Free Wi-Fi', 'Room Service'],
          imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500'
        },
        {
          name: 'Triple Bed Room',
          type: 'triple',
          price: 2500,
          maxAdults: 3,
          maxChildren: 1,
          totalRooms: 4,
          description: 'Spacious triple bed room with attached toilet and geyser. Ideal for small groups.',
          amenities: ['Attached Bathroom', 'Geyser', 'TV', 'Free Wi-Fi', 'Room Service'],
          imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500'
        },
        {
          name: 'Six Bed Family Suite',
          type: 'family',
          price: 4500,
          maxAdults: 6,
          maxChildren: 3,
          totalRooms: 3,
          description: 'Large family suite with six beds, attached toilet and geyser. Perfect for large families or groups.',
          amenities: ['Attached Bathroom', 'Geyser', 'TV', 'Free Wi-Fi', 'Room Service', 'Extra Space'],
          imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500'
        }
      ]);
      console.log('Sample rooms seeded');
    }
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;