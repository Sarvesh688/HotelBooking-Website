import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaMapMarkerAlt, FaStar, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[500px] bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Hotel Sachida Palace</h1>
          <p className="text-xl mb-8">Your Home Away from Home in Rudraprayag</p>
          <Link to="/rooms" className="bg-primary px-8 py-3 rounded-lg text-lg hover:bg-secondary transition">
            View Rooms & Book Now
          </Link>
        </div>
      </div>
      
      {/* About Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About Hotel Sachida Palace</h2>
            <p className="text-gray-600 mb-4">
              Located in the serene beauty of Gabni Gawn, Chandrapuri, Rudraprayag on NH-107, 
              Hotel Sachida Palace offers comfortable accommodation with modern amenities.
            </p>
            <p className="text-gray-600 mb-4">
              All our rooms come with attached toilets and geysers, ensuring a comfortable stay 
              throughout the year. Our property is managed by Rithik Nautiyal and Smt Anju Nautiyal.
            </p>
            <div className="space-y-2">
              <p className="flex items-center"><FaCheckCircle className="text-primary mr-2" /> All rooms with attached bathroom</p>
              <p className="flex items-center"><FaCheckCircle className="text-primary mr-2" /> 24/7 Geyser facility</p>
              <p className="flex items-center"><FaCheckCircle className="text-primary mr-2" /> Free Wi-Fi</p>
              <p className="flex items-center"><FaCheckCircle className="text-primary mr-2" /> Room Service available</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400" alt="Room" className="rounded-lg shadow-md" />
            <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400" alt="Suite" className="rounded-lg shadow-md mt-8" />
          </div>
        </div>
      </div>
      
      {/* Room Types Summary */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Room Categories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold mb-2">Double Bed Room</h3>
              <p className="text-gray-600">2 Adults + 1 Child</p>
              <p className="text-2xl text-primary font-bold mt-2">₹2,000/night</p>
              <p className="text-sm text-gray-500 mt-2">Attached Toilet | Geyser</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold mb-2">Triple Bed Room</h3>
              <p className="text-gray-600">3 Adults + 1 Child</p>
              <p className="text-2xl text-primary font-bold mt-2">₹2,500/night</p>
              <p className="text-sm text-gray-500 mt-2">Attached Toilet | Geyser</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-bold mb-2">Six Bed Family Suite</h3>
              <p className="text-gray-600">6 Adults + 3 Children</p>
              <p className="text-2xl text-primary font-bold mt-2">₹4,500/night</p>
              <p className="text-sm text-gray-500 mt-2">Attached Toilet | Geyser</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Location & Contact */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Location</h2>
            <p className="text-gray-600 mb-4 flex items-start">
              <FaMapMarkerAlt className="text-primary mr-2 mt-1" />
              Gabni Gawn, Chandrapuri, Rudraprayag, Uttarakhand - NH-107
            </p>
            <p className="text-gray-600 mb-4">
              Conveniently located near major pilgrimage sites and tourist attractions.
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Contact Us</h3>
              <p className="flex items-center"><FaPhone className="text-primary mr-2" /> 9897468711 / 9997337702</p>
            </div>
          </div>
          <div className="rounded-lg h-64 overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3442.8577830234324!2d79.37046!3d30.47694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0b7b7b7b7b7b7%3A0x0!2sGabni%20Gawn%2C%20Chandrapuri%2C%20Rudraprayag%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1618000000000"
              allowFullScreen=""
              loading="lazy"
              title="Hotel Sachida Palace Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;