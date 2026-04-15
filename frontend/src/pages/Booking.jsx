import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookingForm from '../components/BookingForm';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Booking = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms/${roomId}`);
      setRoom(response.data);
    } catch (error) {
      toast.error('Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (bookingId) => {
    navigate(`/payment-success?bookingId=${bookingId}`);
  };

  if (loading) return <Loader />;
  if (!room) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={room.imageUrl} alt={room.name} className="w-full rounded-xl shadow-lg" />
          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
            <p className="text-gray-600">{room.description}</p>
            <div className="mt-4">
              <h3 className="font-bold mb-2">Amenities:</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((item, idx) => (
                  <span key={idx} className="bg-gray-100 px-3 py-1 rounded-full text-sm">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <BookingForm room={room} onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Booking;