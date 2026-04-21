import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaHome, FaWhatsapp } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const whatsappMessage = encodeURIComponent(
    `Hello Hotel Sachida Palace,\n\nI have completed my booking.\nBooking ID: ${bookingId}\n\nPlease confirm my reservation. Thank you!`
  );
  const whatsappUrl = `https://wa.me/919997337702?text=${whatsappMessage}`;

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for booking with Hotel Sachida Palace.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Booking ID</p>
          <p className="font-mono text-sm font-bold">{bookingId}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm font-medium mb-3">
            Send your booking confirmation to the hotel on WhatsApp
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            <FaWhatsapp className="mr-2 text-xl" />
            Confirm on WhatsApp
          </a>
        </div>

        <p className="text-gray-500 text-sm mb-6">
          For any queries call: <strong>9897468711 / 9997337702</strong>
        </p>

        <Link
          to="/"
          className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
        >
          <FaHome className="mr-2" /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
