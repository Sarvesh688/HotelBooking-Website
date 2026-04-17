const Booking = require('../models/Booking');
const Room = require('../models/Room');

const checkRoomAvailability = async (roomId, checkIn, checkOut, requestedQuantity = 1, excludeBookingId = null) => {
  const room = await Room.findById(roomId);
  if (!room) return { available: false, message: 'Room type not found' };

  // Normalize to midnight to avoid time-of-day issues
  const checkInDate = new Date(checkIn); checkInDate.setHours(0, 0, 0, 0);
  const checkOutDate = new Date(checkOut); checkOutDate.setHours(0, 0, 0, 0);

  // Only count confirmed bookings
  const query = {
    roomType: roomId,
    status: 'confirmed',
    $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }]
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const overlappingBookings = await Booking.find(query);

  // Find max rooms booked on any single day in the range
  let maxBookedRooms = 0;
  const currentDate = new Date(checkInDate);
  while (currentDate < checkOutDate) {
    let dailyTotal = 0;
    for (const booking of overlappingBookings) {
      const start = new Date(booking.checkIn); start.setHours(0, 0, 0, 0);
      const end = new Date(booking.checkOut); end.setHours(0, 0, 0, 0);
      if (currentDate >= start && currentDate < end) dailyTotal += booking.quantity;
    }
    maxBookedRooms = Math.max(maxBookedRooms, dailyTotal);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const totalRooms = room.totalRooms || 99; // fallback to 99 if not set
  const availableRooms = totalRooms - maxBookedRooms;
  const isAvailable = availableRooms >= requestedQuantity;

  return {
    available: isAvailable,
    availableRooms: Math.max(0, availableRooms),
    totalRooms,
    requestedQuantity,
    message: isAvailable
      ? `${availableRooms} room(s) available`
      : availableRooms <= 0
        ? 'No rooms available for selected dates'
        : `Only ${availableRooms} room(s) available for selected dates`
  };
};

const calculateTotalPrice = (roomPrice, nights, quantity) => {
  return roomPrice * nights * quantity;
};

module.exports = { checkRoomAvailability, calculateTotalPrice };
