require('dotenv').config();
const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Route to authenticate user
  router.post('/adminLogin', async (req, res) => {
    const { username, password } = req.body;

    try {
      // Authenticate user
      const [rows] = await pool.query('SELECT * FROM Admin WHERE UserName = ? AND Password = ?', [username, password]);

      if (rows.length > 0) {
        // User authenticated successfully
        res.status(200).json({ message: 'Login successful' });
      } else {
        // User not found or incorrect password
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  return router;
};
