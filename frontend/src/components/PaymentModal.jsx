import React, { useState, useEffect } from 'react';
import { FaTimes, FaCreditCard, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { loadRazorpayScript } from '../utils/razorpay';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, orderDetails, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handlePayment = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Check your internet connection.');
      setLoading(false);
      return;
    }

    const { orderId, amount, bookingId, keyId } = orderDetails;

    const rzp = new window.Razorpay({
      key: keyId,
      amount: amount,
      currency: 'INR',
      order_id: orderId,
      name: 'Hotel Sachida Palace',
      description: `Booking #${bookingId.slice(-8)}`,
      prefill: orderDetails.prefill,
      theme: { color: '#b8860b' },
      handler: function (response) {
        // Payment successful — close modal first, then verify
        onClose();
        onSuccess({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId,
        });
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
          toast.error('Payment cancelled');
        },
      },
    });

    rzp.on('payment.failed', (response) => {
      setLoading(false);
      toast.error('Payment failed: ' + (response.error?.description || 'Unknown error'));
    });

    rzp.open();
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Booking Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Room:</span> {orderDetails.roomName}</p>
              <p><span className="text-gray-600">Check-in:</span> {orderDetails.checkIn}</p>
              <p><span className="text-gray-600">Check-out:</span> {orderDetails.checkOut}</p>
              <p><span className="text-gray-600">Guests:</span> {orderDetails.guests}</p>
              <p><span className="text-gray-600">Nights:</span> {orderDetails.nights}</p>
              <p className="text-lg font-bold text-primary mt-2">
                Total: ₹{orderDetails.amountDisplay}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', label: 'Card', icon: <FaCreditCard className="text-xl mb-1" /> },
                { id: 'upi', label: 'UPI', icon: <FaMobileAlt className="text-xl mb-1" /> },
                { id: 'netbanking', label: 'NetBanking', icon: <FaUniversity className="text-xl mb-1" /> },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`flex flex-col items-center p-3 border rounded-lg transition ${
                    paymentMethod === id ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  {icon}
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition disabled:bg-gray-400"
          >
            {loading ? 'Opening Payment Gateway...' : `Pay ₹${orderDetails.amountDisplay} via ${paymentMethod.toUpperCase()}`}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payments powered by Razorpay. All major UPI apps, Credit/Debit cards accepted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
