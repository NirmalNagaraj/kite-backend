require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

module.exports = (pool) => {
  // Route to authenticate user and generate JWT
  router.post('/login', async (req, res) => {
    const { registernumber, password } = req.body;
    const user = await authenticateUser(registernumber, password);

    if (user) {
      const accessToken = jwt.sign({ registerNumber: user.RegisterNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token: accessToken });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

  // Function to authenticate user
  async function authenticateUser(registernumber, password) {
    try {
      const [rows] = await pool.query('SELECT * FROM login WHERE RegisterNumber = ? AND Password = ?', [registernumber, password]);
      if (rows.length > 0) {
        return rows[0]; // User found
      } else {
        return null; // User not found or incorrect password
      }
    } catch (err) {
      console.error('Error querying database:', err);
      return null;
    }
  }

  return router;
};
