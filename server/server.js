const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS for cross-origin requests
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'vaccination',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Registration endpoint
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], (checkUserError, results) => {
    if (checkUserError) {
      console.error('Error checking user:', checkUserError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        res.status(409).json({ error: 'Username already exists' });
      } else {
        const insertUserQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        db.query(insertUserQuery, [username, password], (insertUserError) => {
          if (insertUserError) {
            console.error('Error inserting user:', insertUserError);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(201).json({ message: 'Registration successful' });
          }
        });
      }
    }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const loginUserQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(loginUserQuery, [username, password], (loginUserError, results) => {
    if (loginUserError) {
      console.error('Error logging in user:', loginUserError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        const userType = results[0].userType; // Assuming user type is stored in the 'userType' column
        res.status(200).json({ message: 'Login successful', userType });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    }
  });
});
app.get('/getSlots', (req, res) => {
  const getSlotsQuery = 'SELECT id, location, availableSlots FROM slots'; // Include 'id' in the SELECT statement
  db.query(getSlotsQuery, (error, results) => {
    if (error) {
      console.error('Error fetching slots:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ slots: results });
    }
  });
});
app.post('/bookSlot', (req, res) => {
  const { selectedSlot } = req.body;

  // Implement logic to update the database (reduce available slots count)
  const bookSlotQuery = 'UPDATE slots SET availableSlots = availableSlots - 1 WHERE location = ? AND availableSlots > 0';
  db.query(bookSlotQuery, [selectedSlot], (bookSlotError, results) => {
    if (bookSlotError) {
      console.error('Error booking slot:', bookSlotError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Slot booked successfully' });
      } else {
        res.status(400).json({ error: 'Selected slot not available' });
      }
    }
  });
});

app.post('/addSlot', (req, res) => {
  const { location } = req.body;
  const addSlotQuery = 'INSERT INTO slots (location, availableSlots) VALUES (?, 10)';
  db.query(addSlotQuery, [location], (addSlotError) => {
    if (addSlotError) {
      console.error('Error adding slot:', addSlotError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(201).json({ message: 'Slot added successfully' });
    }
  });
});

// Delete slot endpoint
app.delete('/deleteSlot/:id', (req, res) => {
  const slotId = req.params.id;

  const deleteSlotQuery = 'DELETE FROM slots WHERE id = ?';
  db.query(deleteSlotQuery, [slotId], (deleteError, results) => {
    if (deleteError) {
      console.error('Error deleting slot:', deleteError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.affectedRows > 0) {
        res.status(200).json({ message: 'Slot deleted successfully' });
      } else {
        res.status(404).json({ error: 'Slot not found' });
      }
    }
  });
});

app.put('/increaseSlots/:id', (req, res) => {
  const slotId = req.params.id;

  const increaseSlotsQuery = 'UPDATE slots SET availableSlots = availableSlots + 1 WHERE id = ?';
  db.query(increaseSlotsQuery, [slotId], (increaseSlotsError) => {
    if (increaseSlotsError) {
      console.error('Error increasing slots:', increaseSlotsError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Slots increased successfully' });
    }
  });
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
