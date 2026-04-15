import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import { FaSignOutAlt, FaCheck, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchBookings(token);
  }, []);

  const fetchBookings = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
      }
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, status) => {
    const token = localStorage.getItem('adminToken');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/bookings/${bookingId}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated');
      fetchBookings(token);
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard - Bookings</h1>
        <button onClick={handleLogout} className="btn-outline flex items-center">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Booking ID</th>
              <th className="py-3 px-4 text-left">Guest</th>
              <th className="py-3 px-4 text-left">Room</th>
              <th className="py-3 px-4 text-left">Dates</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm">{booking._id.slice(-8)}</td>
                <td className="py-3 px-4">
                  <div>{booking.guestName}</div>
                  <div className="text-xs text-gray-500">{booking.guestPhone}</div>
                </td>
                <td className="py-3 px-4">{booking.roomName}</td>
                <td className="py-3 px-4 text-sm">
                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">₹{booking.totalPrice}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(booking._id, 'confirmed')}
                      className="text-green-600 hover:text-green-800 mr-2"
                      title="Confirm"
                    >
                      <FaCheck />
                    </button>
                  )}
                  {booking.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(booking._id, 'cancelled')}
                      className="text-red-600 hover:text-red-800"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;