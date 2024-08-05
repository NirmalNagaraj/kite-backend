const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Route to get the CGPA edit configuration
  router.get('/allow-cgpa-edit', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT isAllow FROM config WHERE id = 1');
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Configuration not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Route to update the CGPA edit configuration
  router.put('/allow-cgpa-edit', async (req, res) => {
    const { isAllow } = req.body;

    try {
      await pool.query('UPDATE config SET isAllow = ? WHERE id = 1', [isAllow]);
      res.status(200).json({ message: 'Configuration updated successfully' });
    } catch (err) {
      console.error('Error updating database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/check-cgpa-editable', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT isAllow FROM config WHERE id = 1');
      const isAllow = rows[0].isAllow;
      res.json({ isAllow });
    } catch (error) {
      console.error('Error checking CGPA edit permission:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
