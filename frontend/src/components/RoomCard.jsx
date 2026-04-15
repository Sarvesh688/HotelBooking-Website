import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaChild, FaBed, FaWifi, FaHotTub } from 'react-icons/fa';
import fallbackRoom from '../assets/images/rooms/Hotel8.jpeg';

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
      <img
        src={room.imageUrl || fallbackRoom}
        alt={room.name}
        className="w-full h-56 object-cover"
        onError={(e) => { e.target.src = fallbackRoom; }}
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{room.description.substring(0, 100)}...</p>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-gray-600">
            <FaUsers className="mr-1" />
            <span className="text-sm">{room.maxAdults} Adults</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaChild className="mr-1" />
            <span className="text-sm">{room.maxChildren} Child</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaBed className="mr-1" />
            <span className="text-sm">{room.type === 'double' ? 'Double' : room.type === 'triple' ? 'Triple' : '6 Beds'}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Attached Toilet</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Geyser</span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Wi-Fi</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary">₹{room.price}</span>
            <span className="text-gray-500">/night</span>
          </div>
          <button 
            onClick={() => navigate(`/booking/${room._id}`)}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;