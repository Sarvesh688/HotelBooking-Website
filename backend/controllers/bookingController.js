const { calculateTotalPrice } = require('../utils/availability');
const Room = require('../models/Room');

const calcNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  start.setHours(0, 0, 0, 0);
  const end = new Date(checkOut);
  end.setHours(0, 0, 0, 0);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, quantity } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const nights = calcNights(checkIn, checkOut);
    if (nights <= 0) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    const totalPrice = calculateTotalPrice(room.price, nights, quantity);

    res.json({
      available: true,
      totalPrice,
      nights,
      message: 'Rooms available'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkAvailability };
