const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Helper function to format phone number to international format
const formatPhoneNumber = (phone) => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // If it doesn't start with country code, add India code
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  return '+' + cleaned;
};

const sendWhatsAppMessage = async (toNumber, booking, room) => {
  try {
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-IN');
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-IN');
    
    const message = `🏨 *Hotel Sachida Palace* 🏨
    
✅ *Booking Confirmed!*

📋 Booking ID: ${booking._id}
🛏️ Room: ${room.name}
📅 Check-in: ${checkInDate}
📅 Check-out: ${checkOutDate}
👥 Guests: ${booking.totalAdults} Adults, ${booking.totalChildren} Children
💰 Amount: ₹${booking.totalPrice}

For any queries, contact: 9897468711 / 9997337702

Thank you for choosing Hotel Sachida Palace! 🎉`;

    const formattedNumber = formatPhoneNumber(toNumber);
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${formattedNumber}`
    });
    
    console.log(`WhatsApp message sent to ${formattedNumber}`);
    return true;
  } catch (error) {
    console.error('WhatsApp sending failed:', error);
    return false;
  }
};

const sendOwnerWhatsApp = async (booking, room) => {
  try {
    const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-IN');
    const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-IN');
    
    const message = `🏨 *NEW BOOKING - Hotel Sachida Palace* 🏨

👤 Guest: ${booking.guestName}
📞 Phone: ${booking.guestPhone}
📧 Email: ${booking.guestEmail}
🛏️ Room: ${room.name} (x${booking.quantity})
📅 Check-in: ${checkInDate}
📅 Check-out: ${checkOutDate}
💰 Total: ₹${booking.totalPrice}
💳 Payment ID: ${booking.razorpayPaymentId}

Please prepare the room for the guest.`;

    const formattedOwnerNumber = formatPhoneNumber(process.env.OWNER_WHATSAPP);

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${formattedOwnerNumber}`
    });
    
    console.log('Owner WhatsApp notification sent');
    return true;
  } catch (error) {
    console.error('Owner WhatsApp notification failed:', error);
    return false;
  }
};

module.exports = { sendWhatsAppMessage, sendOwnerWhatsApp };