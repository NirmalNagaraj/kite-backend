const express = require('express');
const router = express.Router();
const extractRegisterNumber = require('../middlewares/extractRegisterNumber'); // Adjust path as needed

module.exports = (pool) => {
  // Route to check current password
  router.post('/check-password', extractRegisterNumber, async (req, res) => {
    const { currentPassword } = req.body;
    const { registerNumber } = req;
    console.log(registerNumber);
    

    try {
      const [user] = await pool.query('SELECT password FROM login WHERE RegisterNumber = ?', [registerNumber]);
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
  router.post('/update-password', extractRegisterNumber, async (req, res) => {
    const { newPassword } = req.body;
    const { registerNumber } = req;

    try {
      await pool.query('UPDATE login SET password = ? WHERE RegisterNumber = ?', [newPassword, registerNumber]);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
