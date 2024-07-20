const express = require('express');
const router = express.Router();
const authenticateToken = require('./middlewares/authenticationToken');

module.exports = (pool) => {
  router.get('/', authenticateToken, async (req, res) => {
    const { registerNumber } = req.user;
    try {
      const [rows] = await pool.query('SELECT * FROM details WHERE `Register Number` = ?', [registerNumber]);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ message: 'User details not found' });
      }
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'An error occurred while fetching user details' });
    }
  });

  return router;
};
