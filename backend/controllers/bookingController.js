const { checkRoomAvailability, calculateTotalPrice } = require('../utils/availability');
const Room = require('../models/Room');
const moment = require('moment');

const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, quantity } = req.body;
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const nights = Math.ceil(moment(checkOut).diff(moment(checkIn), 'days', true));
    if (nights <= 0) {
      return res.status(400).json({ message: 'Invalid dates' });
    }
    
    const availability = await checkRoomAvailability(roomId, checkIn, checkOut, quantity);
    const totalPrice = calculateTotalPrice(room.price, nights, quantity);
    
    res.json({
      available: availability.available,
      availableRooms: availability.availableRooms,
      totalPrice,
      nights,
      message: availability.message
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkAvailability };