// client/src/components/BookSlot.js

import React, { useState, useEffect } from 'react';
import './styles.css';

const BookSlot = () => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch available slots from the server
    const fetchSlots = async () => {
      try {
        const response = await fetch('http://localhost:5000/getSlots');
        if (response.status === 200) {
          const data = await response.json();
          setSlots(data.slots);
        } else {
          setErrorMessage('Failed to fetch available slots');
        }
      } catch (error) {
        console.error('Error fetching slots:', error);
        setErrorMessage('Network error. Please try again later.');
      }
    };

    fetchSlots();
  }, []);

  const handleBookSlot = async (location) => {
    try {
      const response = await fetch('http://localhost:5000/bookSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedSlot: location }),
      });

      if (response.status === 200) {
        // Booking successful, update local state or fetch slots again
        // depending on your application flow
        alert(`Slot booked successfully at ${location}`);
        
        window.location.reload();
      } else {
        const data = await response.json();
        setErrorMessage(data.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error booking slot:', error);
      setErrorMessage('Network error. Please try again later.');
    }
  };

  return (
    <div className="table">
      <h1>Book a Slot</h1>
      <table className='tb'>
        <thead>
          <tr>
            <th>Location</th>
            <th>Available Slots</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.location}>
              <td onClick={() => setSelectedSlot(slot.location)}>
                {slot.location}
              </td>
              <td>{slot.availableSlots}</td>
              <td>
                <button onClick={() => handleBookSlot(slot.location)}>
                  Add Slot
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default BookSlot;
