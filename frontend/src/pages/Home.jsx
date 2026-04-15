import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaMapMarkerAlt, FaCheckCircle, FaTimes } from 'react-icons/fa';

// Hotel images
import hotelImg1 from '../assets/images/hotel/hotel.jpeg';
import hotelImg2 from '../assets/images/hotel/hotel2.jpeg';
import ownerImg from '../assets/images/hotel/Owner.jpeg';

// Room images
import roomImg1 from '../assets/images/rooms/Hotel8.jpeg';
import roomImg2 from '../assets/images/rooms/image2.png';
import roomImg3 from '../assets/images/rooms/image3.png';
import roomImg4 from '../assets/images/rooms/image4.png';
import roomImg5 from '../assets/images/rooms/image5.png';
import roomImg6 from '../assets/images/rooms/image6.png';
import roomImg7 from '../assets/images/rooms/image7.png';
import roomImg9 from '../assets/images/rooms/image9.png';

// Washroom image
import washroomImg from '../assets/images/washrooms/washroom.jpeg';

const galleryImages = [
  { src: hotelImg1, label: 'Hotel Exterior' },
  { src: hotelImg2, label: 'Hotel View' },
  { src: roomImg1, label: 'Room' },
  { src: roomImg2, label: 'Room' },
  { src: roomImg3, label: 'Room' },
  { src: roomImg4, label: 'Room' },
  { src: roomImg5, label: 'Room' },
  { src: roomImg6, label: 'Room' },
  { src: roomImg7, label: 'Room' },
  { src: roomImg9, label: 'Room' },
  { src: washroomImg, label: 'Washroom' },
];

const Home = () => {
  const [lightbox, setLightbox] = useState(null); // index of open image

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img
          src={hotelImg1}
          alt="Hotel Sachida Palace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Hotel Sachida Palace</h1>
          <p className="text-xl mb-8">Your Home Away from Home in Rudraprayag</p>
          <Link to="/rooms" className="bg-primary px-8 py-3 rounded-lg text-lg hover:bg-secondary transition">
            View Rooms &amp; Book Now
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
            <img src={roomImg1} alt="Room" className="rounded-lg shadow-md w-full h-48 object-cover" />
            <img src={hotelImg2} alt="Hotel" className="rounded-lg shadow-md w-full h-48 object-cover mt-8" />
          </div>
        </div>
      </div>

      {/* Meet the Owner Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Owner</h2>
          <div className="flex flex-col md:flex-row items-center gap-10 max-w-3xl mx-auto">
            <div className="flex-shrink-0">
              <img
                src={ownerImg}
                alt="Smt Anju Nautiyal"
                className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-primary"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">Smt Anju Nautiyal</h3>
              <p className="text-primary font-medium mb-3">Co-Owner, Hotel Sachida Palace</p>
              <p className="text-gray-600 leading-relaxed">
                With warmth and dedication, Smt Anju Nautiyal along with Rithik Nautiyal has been
                the heart of Hotel Sachida Palace. Her commitment to hospitality ensures every guest
                feels at home in the serene surroundings of Rudraprayag, Uttarakhand.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Photo Gallery</h2>
          <p className="text-center text-gray-600 mb-10">A glimpse of our hotel, rooms &amp; facilities</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg shadow-md cursor-pointer group"
                onClick={() => setLightbox(index)}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-end">
                  <span className="text-white text-sm font-medium px-3 py-2 opacity-0 group-hover:opacity-100 transition duration-300">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            <FaTimes />
          </button>
          <button
            className="absolute left-4 text-white text-4xl hover:text-gray-300 px-4"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + galleryImages.length) % galleryImages.length); }}
          >
            &#8249;
          </button>
          <img
            src={galleryImages[lightbox].src}
            alt={galleryImages[lightbox].label}
            className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white text-4xl hover:text-gray-300 px-4"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % galleryImages.length); }}
          >
            &#8250;
          </button>
          <p className="absolute bottom-6 text-white text-sm">
            {galleryImages[lightbox].label} &nbsp;·&nbsp; {lightbox + 1} / {galleryImages.length}
          </p>
        </div>
      )}

      {/* Room Types Summary */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Room Categories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <img src={roomImg2} alt="Double Bed Room" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">Double Bed Room</h3>
              <p className="text-gray-600">2 Adults + 1 Child</p>
              <p className="text-2xl text-primary font-bold mt-2">₹2,000/night</p>
              <p className="text-sm text-gray-500 mt-2">Attached Toilet | Geyser</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <img src={roomImg4} alt="Triple Bed Room" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">Triple Bed Room</h3>
              <p className="text-gray-600">3 Adults + 1 Child</p>
              <p className="text-2xl text-primary font-bold mt-2">₹2,500/night</p>
              <p className="text-sm text-gray-500 mt-2">Attached Toilet | Geyser</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <img src={roomImg6} alt="Family Suite" className="w-full h-40 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">Six Bed Family Suite</h3>
              <p className="text-gray-600">6 Adults + 3 Children</p>
              <p className="text-2xl text-primary font-bold mt-2">₹4,500/night</p>
              <p className="text-sm text-gray-500 mt-2">Attached Toilet | Geyser</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
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
    </div>
  );
};

export default Home;
