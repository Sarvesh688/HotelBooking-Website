import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import toast from 'react-hot-toast';
import PaymentModal from './PaymentModal';

const BookingForm = ({ room, onSuccess }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [totalAdults, setTotalAdults] = useState(1);
  const [totalChildren, setTotalChildren] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [priceDetails, setPriceDetails] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Calculate number of nights between check-in and check-out
  const calculateNights = (checkInDate, checkOutDate) => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut || checkIn >= checkOut) {
      toast.error('Please select valid dates');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/bookings/check-availability`, {
        roomId: room._id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        quantity
      });
      setAvailability(response.data);
      setPriceDetails(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error checking availability');
      setAvailability({ available: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkIn && checkOut && room) {
      // If checkOut is same or before checkIn, push it forward by 1 day
      if (checkOut <= checkIn) {
        const next = new Date(checkIn);
        next.setDate(next.getDate() + 1);
        setCheckOut(next);
        return;
      }
      checkAvailability();
    }
  }, [checkIn, checkOut, quantity]);

  const initiatePayment = async () => {
    if (!guestName || !guestEmail || !guestPhone) {
      toast.error('Please fill all guest details');
      return;
    }
    
    if (!availability?.available) {
      toast.error('Rooms not available for selected dates');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Creating order with:', { roomId: room._id, checkIn, checkOut, guestName, guestEmail, guestPhone, totalAdults, totalChildren, quantity });
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment/create-order`, {
        roomId: room._id,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guestName,
        guestEmail,
        guestPhone,
        totalAdults,
        totalChildren,
        quantity
      });
      console.log('✅ Order created:', response.data);
      
      const { orderId, amount, bookingId, keyId } = response.data;
      
      // Format dates for display
      const formattedCheckIn = checkIn.toLocaleDateString('en-IN');
      const formattedCheckOut = checkOut.toLocaleDateString('en-IN');
      const nights = calculateNights(checkIn, checkOut);
      
      setOrderDetails({
        orderId,
        amount: amount, // Keep in paise for Razorpay (backend returns paise)
        amountDisplay: amount / 100, // For showing ₹ in UI
        bookingId,
        keyId,
        roomName: room.name,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        nights: nights,
        guests: `${totalAdults} Adults, ${totalChildren} Children`,
        prefill: {
          name: guestName,
          email: guestEmail,
          contact: guestPhone
        }
      });
      
      setShowPaymentModal(true);
    } catch (error) {
      console.error('❌ Payment init error:', error.response?.status, error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      console.log('🔄 Verifying payment:', paymentResponse);
      const verifyResponse = await axios.post(`${import.meta.env.VITE_API_URL}/payment/verify-payment`, {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        bookingId: paymentResponse.bookingId
      });
      console.log('✅ Verify response:', verifyResponse.data);
      
      if (verifyResponse.data.success) {
        toast.success('Booking confirmed successfully!');
        onSuccess && onSuccess(verifyResponse.data.bookingId);
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('❌ Verify error:', error.response?.status, error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6">Book Your Stay</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Check-in Date</label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => { date.setHours(0,0,0,0); setCheckIn(date); }}
              minDate={new Date()}
              className="w-full p-3 border rounded-lg"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Check-out Date</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => { date.setHours(0,0,0,0); setCheckOut(date); }}
              minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
              className="w-full p-3 border rounded-lg"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Number of Rooms</label>
            <input
              type="number"
              min="1"
              max="5"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Adults</label>
              <input
                type="number"
                min="1"
                max={room.maxAdults * quantity}
                value={totalAdults}
                onChange={(e) => setTotalAdults(parseInt(e.target.value))}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Children</label>
              <input
                type="number"
                min="0"
                max={room.maxChildren * quantity}
                value={totalChildren}
                onChange={(e) => setTotalChildren(parseInt(e.target.value))}
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          
          {availability && (
            <div className={`p-4 rounded-lg ${availability.available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={availability.available ? 'text-green-700' : 'text-red-700'}>
                {availability.message}
              </p>
              {availability.available && priceDetails && (
                <div className="mt-2">
                  <p className="text-lg font-bold">Total: ₹{priceDetails.totalPrice}</p>
                  <p className="text-sm text-gray-600">For {priceDetails.nights} nights</p>
                </div>
              )}
            </div>
          )}
          
          <button
            onClick={initiatePayment}
            disabled={loading || !availability?.available}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Proceed to Payment (UPI/Card)'}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Secure payments via UPI, Credit/Debit Cards, NetBanking
          </p>
        </div>
      </div>
      
      {/* Payment Modal */}
      {orderDetails && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderDetails={orderDetails}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default BookingForm;