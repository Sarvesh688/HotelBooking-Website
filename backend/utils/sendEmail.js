const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 5000,
  socketTimeout: 5000
});

const sendBookingConfirmationEmail = async (booking, room, isForOwner = false) => {
  const checkInDate = new Date(booking.checkIn).toLocaleDateString('en-IN');
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString('en-IN');
  
  const guestHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #b8860b;">Hotel Sachida Palace</h2>
      <h3>Booking Confirmation</h3>
      <p>Dear ${booking.guestName},</p>
      <p>Thank you for booking with Hotel Sachida Palace! Your booking has been confirmed.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Booking Details:</h4>
        <p><strong>Booking ID:</strong> ${booking._id}</p>
        <p><strong>Room Type:</strong> ${room.name}</p>
        <p><strong>Quantity:</strong> ${booking.quantity} room(s)</p>
        <p><strong>Check-in:</strong> ${checkInDate}</p>
        <p><strong>Check-out:</strong> ${checkOutDate}</p>
        <p><strong>Nights:</strong> ${booking.nights}</p>
        <p><strong>Guests:</strong> ${booking.totalAdults} Adults, ${booking.totalChildren} Children</p>
        <p><strong>Total Amount:</strong> ₹${booking.totalPrice}</p>
      </div>
      
      <div style="background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Hotel Contact:</h4>
        <p>📞 9897468711 / 9997337702</p>
        <p>📍 Gabni Gawn, Chandrapuri, Rudraprayag NH-107</p>
        <p>👨‍💼 Owner: Rithik Nautiyal & Smt Anju Nautiyal</p>
      </div>
      
      <p>For any assistance, please contact us at the numbers above.</p>
      <p>Wishing you a pleasant stay!</p>
      <p>Team Hotel Sachida Palace</p>
    </div>
  `;
  
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #b8860b;">New Booking Alert - Hotel Sachida Palace</h2>
      <p>A new booking has been confirmed.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Guest Details:</h4>
        <p><strong>Name:</strong> ${booking.guestName}</p>
        <p><strong>Email:</strong> ${booking.guestEmail}</p>
        <p><strong>Phone:</strong> ${booking.guestPhone}</p>
        <p><strong>Room Type:</strong> ${room.name}</p>
        <p><strong>Quantity:</strong> ${booking.quantity}</p>
        <p><strong>Check-in:</strong> ${checkInDate}</p>
        <p><strong>Check-out:</strong> ${checkOutDate}</p>
        <p><strong>Total Amount:</strong> ₹${booking.totalPrice}</p>
        <p><strong>Payment ID:</strong> ${booking.razorpayPaymentId}</p>
      </div>
      
      <p>Please prepare the room for the guest.</p>
    </div>
  `;
  
  const mailOptions = {
    from: `"Hotel Sachida Palace" <${process.env.EMAIL_USER}>`,
    to: isForOwner ? process.env.OWNER_EMAIL : booking.guestEmail,
    subject: isForOwner ? 'New Booking Confirmed - Hotel Sachida Palace' : 'Booking Confirmation - Hotel Sachida Palace',
    html: isForOwner ? ownerHtml : guestHtml
  };
  
  await transporter.sendMail(mailOptions);
  
  // Also send to owner if sending to guest
  if (!isForOwner) {
    const ownerMailOptions = { ...mailOptions, to: process.env.OWNER_EMAIL, subject: 'New Booking Alert - Hotel Sachida Palace', html: ownerHtml };
    await transporter.sendMail(ownerMailOptions);
  }
};

module.exports = { sendBookingConfirmationEmail };