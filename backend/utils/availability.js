const Booking = require('../models/Booking');
const Room = require('../models/Room');

const checkRoomAvailability = async (roomId, checkIn, checkOut, requestedQuantity = 1, excludeBookingId = null) => {
  const room = await Room.findById(roomId);
  if (!room) return { available: false, message: 'Room type not found' };

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Find overlapping bookings
  const query = {
    roomType: roomId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  const overlappingBookings = await Booking.find(query);
  
  // Calculate total rooms booked for each day in the range
  let maxBookedRooms = 0;
  const currentDate = new Date(checkInDate);
  
  while (currentDate < checkOutDate) {
    let dailyTotal = 0;
    for (const booking of overlappingBookings) {
      const bookingStart = new Date(booking.checkIn);
      const bookingEnd = new Date(booking.checkOut);
      if (currentDate >= bookingStart && currentDate < bookingEnd) {
        dailyTotal += booking.quantity;
      }
    }
    maxBookedRooms = Math.max(maxBookedRooms, dailyTotal);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  const availableRooms = room.totalRooms - maxBookedRooms;
  const isAvailable = availableRooms >= requestedQuantity;
  
  return {
    available: isAvailable,
    availableRooms,
    requestedQuantity,
    message: isAvailable ? 'Rooms available' : `Only ${availableRooms} rooms available for selected dates`
  };
};

const calculateTotalPrice = (roomPrice, nights, quantity) => {
  return roomPrice * nights * quantity;
};

module.exports = { checkRoomAvailability, calculateTotalPrice };