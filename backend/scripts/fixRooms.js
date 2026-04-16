/**
 * Run this once to fix rooms in the database:
 *   node scripts/fixRooms.js
 *
 * It will:
 * 1. Set totalRooms on any room that has 0 or missing totalRooms
 * 2. Print all rooms so you can verify
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Room = require('../models/Room');

const defaults = {
  double: 6,
  triple: 4,
  family: 3,
};

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const rooms = await Room.find({});
  console.log(`\nFound ${rooms.length} room(s) in DB:\n`);

  for (const room of rooms) {
    console.log(`  [${room.type}] "${room.name}" — totalRooms: ${room.totalRooms}`);

    if (!room.totalRooms || room.totalRooms === 0) {
      const newTotal = defaults[room.type] || 1;
      room.totalRooms = newTotal;
      await room.save();
      console.log(`    ✅ Fixed → totalRooms set to ${newTotal}`);
    }
  }

  // If no rooms exist at all, seed them fresh
  if (rooms.length === 0) {
    console.log('\nNo rooms found — seeding fresh rooms...');
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
        imageUrl: '',
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
        imageUrl: '',
      },
      {
        name: 'Six Bed Family Suite',
        type: 'family',
        price: 4500,
        maxAdults: 6,
        maxChildren: 3,
        totalRooms: 3,
        description: 'Large family suite with six beds, attached toilet and geyser. Perfect for large families.',
        amenities: ['Attached Bathroom', 'Geyser', 'TV', 'Free Wi-Fi', 'Room Service', 'Extra Space'],
        imageUrl: '',
      },
    ]);
    console.log('✅ Rooms seeded successfully');
  }

  console.log('\nDone. Current rooms:\n');
  const updated = await Room.find({});
  updated.forEach(r => {
    console.log(`  [${r.type}] "${r.name}" — totalRooms: ${r.totalRooms}, price: ₹${r.price}`);
  });

  await mongoose.disconnect();
  process.exit(0);
}

fix().catch(err => {
  console.error(err);
  process.exit(1);
});
