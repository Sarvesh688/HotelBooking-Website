import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Hotel Sachida Palace</h3>
            <p className="text-gray-400">Experience comfort and hospitality in the heart of Rudraprayag.</p>
            <div className="flex space-x-4 mt-4">
              <FaFacebook className="text-gray-400 hover:text-primary cursor-pointer" size={20} />
              <FaInstagram className="text-gray-400 hover:text-primary cursor-pointer" size={20} />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Info</h3>
            <div className="space-y-2">
              <p className="flex items-center"><FaPhone className="mr-2 text-primary" /> 9897468711 / 9997337702</p>
              <p className="flex items-center"><FaEnvelope className="mr-2 text-primary" /> sachidapalace@gmail.com</p>
              <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-primary" /> Gabni Gawn, Chandrapuri, Rudraprayag NH-107</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Owner</h3>
            <p>Rithik Nautiyal</p>
            <p>Smt Anju Nautiyal</p>
            <p className="mt-2 text-sm text-gray-400">All rooms with attached toilet and geyser</p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2024 Hotel Sachida Palace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;