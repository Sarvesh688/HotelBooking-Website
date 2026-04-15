import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { BookingProvider } from './context/BookingContext';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/booking/:roomId" element={<Booking />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;