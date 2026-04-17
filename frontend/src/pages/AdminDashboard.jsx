import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
// Remove unused imports - FaCheck, FaTimes not needed since we only have delete now
import { FaSignOutAlt, FaRupeeSign, FaCalendarAlt, FaBed, FaEdit, FaSave, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editingRoom, setEditingRoom] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editTotalRooms, setEditTotalRooms] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) { navigate('/admin'); return; }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [bookingsRes, roomsRes, statsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/admin/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/rooms`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setBookings(bookingsRes.data);
      setRooms(roomsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      if (error.response?.status === 401) { localStorage.removeItem('adminToken'); navigate('/admin'); }
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (bookingId, guestName) => {
    if (!window.confirm(`Delete booking for "${guestName}"? This cannot be undone.`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/admin/bookings/${bookingId}`,
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Booking deleted');
      fetchAll();
    } catch { toast.error('Failed to delete booking'); }
  };

  const saveRoomPrice = async (roomId) => {
    if (!editPrice || isNaN(editPrice) || editPrice <= 0) {
      toast.error('Enter a valid price'); return;
    }
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/rooms/${roomId}`,
        { price: Number(editPrice), totalRooms: Number(editTotalRooms) || undefined },
        { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Room updated');
      setEditingRoom(null);
      fetchAll();
    } catch { toast.error('Failed to update room'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🏨 Hotel Sachida Palace — Admin</h1>
        <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-white">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <FaCalendarAlt className="text-blue-500 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
              <p className="text-gray-500 text-sm">Total Bookings</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <FaRupeeSign className="text-green-500 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Total Revenue</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <FaCalendarAlt className="text-purple-500 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.todayBookings}</p>
              <p className="text-gray-500 text-sm">Today's Bookings</p>
            </div>
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <FaBed className="text-yellow-500 text-2xl mx-auto mb-2" />
              <p className="text-2xl font-bold">{stats.pendingBookings}</p>
              <p className="text-gray-500 text-sm">Pending</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-2 rounded-lg font-medium transition ${activeTab === 'bookings' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-5 py-2 rounded-lg font-medium transition ${activeTab === 'rooms' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Manage Rooms
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm">Booking ID</th>
                    <th className="py-3 px-4 text-left text-sm">Guest</th>
                    <th className="py-3 px-4 text-left text-sm">Room</th>
                    <th className="py-3 px-4 text-left text-sm">Dates</th>
                    <th className="py-3 px-4 text-left text-sm">Nights</th>
                    <th className="py-3 px-4 text-left text-sm">Amount</th>
                    <th className="py-3 px-4 text-left text-sm">Status</th>
                    <th className="py-3 px-4 text-left text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 && (
                    <tr><td colSpan="8" className="text-center py-8 text-gray-500">No bookings yet</td></tr>
                  )}
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono text-xs text-gray-500">{booking._id.slice(-8)}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-xs text-gray-500">{booking.guestPhone}</div>
                        <div className="text-xs text-gray-400">{booking.guestEmail}</div>
                      </td>
                      <td className="py-3 px-4 text-sm">{booking.roomName}</td>
                      <td className="py-3 px-4 text-sm">
                        <div>{new Date(booking.checkIn).toLocaleDateString('en-IN')}</div>
                        <div className="text-gray-500">to {new Date(booking.checkOut).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-center">{booking.nights}</td>
                      <td className="py-3 px-4 font-medium">₹{booking.totalPrice.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteBooking(booking._id, booking.guestName)}
                          className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-800 px-3 py-1 rounded-lg text-sm transition"
                          title="Delete booking"
                        >
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="grid md:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-1">{room.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{room.type} · Max {room.maxAdults} adults, {room.maxChildren} children</p>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Price per night</p>
                  {editingRoom === room._id ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">Price per night (₹)</label>
                        <input
                          type="number"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="border rounded-lg px-3 py-2 w-full font-bold"
                          placeholder="Enter price"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Total rooms available</label>
                        <input
                          type="number"
                          value={editTotalRooms}
                          onChange={(e) => setEditTotalRooms(e.target.value)}
                          className="border rounded-lg px-3 py-2 w-full font-bold"
                          placeholder="e.g. 6"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => saveRoomPrice(room._id)}
                          className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-1">
                          <FaSave /> Save
                        </button>
                        <button onClick={() => setEditingRoom(null)}
                          className="flex-1 bg-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-300">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">₹{room.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{room.totalRooms || '?'} rooms</span>
                      </div>
                      <button
                        onClick={() => { setEditingRoom(room._id); setEditPrice(room.price); setEditTotalRooms(room.totalRooms || ''); }}
                        className="w-full flex items-center justify-center gap-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg py-1"
                      >
                        <FaEdit /> Edit Price & Rooms
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {room.amenities?.map((a, i) => (
                    <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
