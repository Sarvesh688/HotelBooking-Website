import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomCard from '../components/RoomCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
      setRooms(response.data);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Our Rooms</h1>
      <p className="text-center text-gray-600 mb-12">Choose the perfect room for your stay</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;