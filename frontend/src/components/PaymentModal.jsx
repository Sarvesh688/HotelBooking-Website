import React, { useState, useEffect } from 'react';
import { FaTimes, FaCreditCard, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import { loadRazorpay } from '../utils/razorpay';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, orderDetails, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { orderId, amount, bookingId, keyId } = orderDetails;
      
      const success = await loadRazorpay({
        key: keyId,
        amount: amount,
        currency: 'INR',
        orderId: orderId,
        name: 'Hotel Sachida Palace',
        description: `Booking #${bookingId.slice(-8)}`,
        handler: async (response) => {
          // Payment success callback
          onSuccess({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId
          });
          onClose();
        },
        prefill: orderDetails.prefill,
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      });
      
      if (!success) {
        toast.error('Failed to load payment gateway');
      }
    } catch (error) {
      toast.error('Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Room:</span> {orderDetails.roomName}</p>
              <p><span className="text-gray-600">Check-in:</span> {orderDetails.checkIn}</p>
              <p><span className="text-gray-600">Check-out:</span> {orderDetails.checkOut}</p>
              <p><span className="text-gray-600">Guests:</span> {orderDetails.guests}</p>
              <p><span className="text-gray-600">Nights:</span> {orderDetails.nights}</p>
              <p className="text-lg font-bold text-primary mt-2">Total: ₹{orderDetails.amount}</p>
            </div>
          </div>
          
          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center p-3 border rounded-lg transition ${
                  paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <FaCreditCard className="text-xl mb-1" />
                <span className="text-xs">Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex flex-col items-center p-3 border rounded-lg transition ${
                  paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <FaMobileAlt className="text-xl mb-1" />
                <span className="text-xs">UPI</span>
              </button>
              <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex flex-col items-center p-3 border rounded-lg transition ${
                  paymentMethod === 'netbanking' ? 'border-primary bg-primary/5' : 'border-gray-200'
                }`}
              >
                <FaUniversity className="text-xl mb-1" />
                <span className="text-xs">NetBanking</span>
              </button>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : `Pay ₹${orderDetails.amount} via ${paymentMethod.toUpperCase()}`}
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