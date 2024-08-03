const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  // Route to check current password
  router.post('/check-password', async (req, res) => {
    const { currentPassword } = req.body;

    try {
      const [user] = await pool.query('SELECT password FROM Admin WHERE id = 1');
      if (user.length > 0 && user[0].password === currentPassword) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error('Error checking password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Route to update password
  router.post('/update-password', async (req, res) => {
    const { newPassword } = req.body;

    try {
      await pool.query('UPDATE Admin SET password = ? WHERE id = 1', [newPassword]);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
