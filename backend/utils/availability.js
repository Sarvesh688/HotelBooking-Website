const calculateTotalPrice = (roomPrice, nights, quantity) => {
  return roomPrice * nights * quantity;
};

// Availability is always open — hotel manages room allocation manually
const checkRoomAvailability = async (roomId, checkIn, checkOut, requestedQuantity = 1, excludeBookingId = null) => {
  return {
    available: true,
    availableRooms: 99,
    requestedQuantity,
    message: 'Rooms available'
  };
};

module.exports = { checkRoomAvailability, calculateTotalPrice };
