const express = require('express');
const router = express.Router();
const extractRegisterNumber = require('./middlewares/extractRegisterNumber');

module.exports = (pool) => {
  router.get('/', extractRegisterNumber, async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM details WHERE `Register Number` = ?', [req.registerNumber]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

  return router;
};
