import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState(null);

  return (
    <BookingContext.Provider value={{ currentBooking, setCurrentBooking }}>
      {children}
    </BookingContext.Provider>
  );
};