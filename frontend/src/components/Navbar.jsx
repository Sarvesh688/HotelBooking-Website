import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHotel, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <FaHotel className="text-primary text-2xl" />
            <span className="text-xl font-bold text-gray-800">Hotel Sachida Palace</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary transition">Home</Link>
            <Link to="/rooms" className="text-gray-700 hover:text-primary transition">Rooms</Link>
            <Link to="/admin" className="text-gray-700 hover:text-primary transition">Admin</Link>
          </div>
          
          <div className="hidden md:flex space-x-4">
            <div className="text-sm text-gray-600">
              📞 9897468711 | 9997337702
            </div>
          </div>
          
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/rooms" className="block py-2 text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>Rooms</Link>
            <Link to="/admin" className="block py-2 text-gray-700 hover:text-primary" onClick={() => setIsOpen(false)}>Admin</Link>
            <div className="pt-2 text-sm text-gray-600">
              📞 9897468711 / 9997337702
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;