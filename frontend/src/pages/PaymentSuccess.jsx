import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaHome } from 'react-icons/fa';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

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
          <p className="font-mono text-sm">{bookingId}</p>
        </div>
        <p className="text-gray-600 mb-6">
          A confirmation email and WhatsApp message has been sent to your registered contact.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center">
          <FaHome className="mr-2" /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;