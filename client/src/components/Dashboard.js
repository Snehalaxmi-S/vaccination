// client/src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import './styles.css';

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [newLocation, setNewLocation] = useState('');
  const [newAvailableSlots, setNewAvailableSlots] = useState('');

  useEffect(() => {
    // Fetch slots data from the server
    fetch('http://localhost:5000/getSlots')
      .then((response) => response.json())
      .then((data) => {
        setSlots(data.slots);
      })
      .catch((error) => {
        console.error('Error fetching slots:', error);
      });
  }, []); // Empty dependency array to run the effect only once on component mount

  const handleDelete = (id) => {
    // Check if the id is available
    if (id !== undefined) {
      // Implement logic to delete a slot
      fetch(`http://localhost:5000/deleteSlot/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.message);
          // Update the state to reflect the changes
          setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting slot:', error);
        });
    } else {
      console.error('Invalid id for deletion:', id);
    }
  };

  const handleAddSlot = () => {
    // Implement logic to add a new slot
    fetch('http://localhost:5000/addSlot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location: newLocation, availableSlots: newAvailableSlots }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Update the state to reflect the changes
        setSlots([...slots, { id: data.id, location: newLocation, availableSlots: newAvailableSlots }]);
        // Clear the input fields after adding a new slot
        setNewLocation('');
        setNewAvailableSlots('');
      })
      .catch((error) => {
        console.error('Error adding slot:', error);
      });
  };

  const handleIncreaseSlots = (id) => {
    // Implement logic to increase slots for a location
    fetch(`http://localhost:5000/increaseSlots/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Update the state or fetch slots again if needed
        setSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot.id === id ? { ...slot, availableSlots: slot.availableSlots + 1 } : slot
          )
        );
      })
      .catch((error) => {
        console.error('Error increasing slots:', error);
      });
  };

  return (
    <div className="dash">
      <h1>Dashboard</h1>
      <div>
        <label>
          New Location:
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
        </label>
        <label>
          New Available Slots:
          <input
            type="text"
            value={newAvailableSlots}
            onChange={(e) => setNewAvailableSlots(e.target.value)}
          />
        </label>
        <button onClick={handleAddSlot}>Add Slot</button>
      </div>
      <table className="table tb">
        <thead>
          <tr>
            <th>Location</th>
            <th>Available Slots</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, index) => (
            <tr key={slot.id || index}>
              <td>{slot.location}</td>
              <td>{slot.availableSlots}</td>
              <td>
                <button onClick={() => handleDelete(slot.id)}>Delete</button>
                <button onClick={() => handleIncreaseSlots(slot.id)}>Increase Slots</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
