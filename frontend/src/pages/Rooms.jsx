import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import RoomCard from '../components/RoomCard';
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

  if (loading) return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Our Rooms</h1>
      <p className="text-center text-gray-600 mb-12">Choose the perfect room for your stay</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-56 bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-8 bg-gray-200 rounded w-1/3 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Premium Rooms at Best Hotel in Chandrapuri, Rudraprayag</title>
        <meta name="description" content="Discover our luxury double and family rooms at Hotel Sachida Palace, the best hotel in Chandrapuri, Rudraprayag. Book online for the best rates and premium service." />
        <link rel="canonical" href="https://hotelsachidapalace.com/rooms" />
      </Helmet>
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
