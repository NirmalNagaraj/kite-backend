const express = require('express');
const router = express.Router();
const extractRegisterNumber = require('../middlewares/extractRegisterNumber'); // Adjust path as needed

module.exports = (pool) => {

  // Route to check whether the registerNumber has isMentor field set to true
  router.get('/check/isMentor', extractRegisterNumber, async (req, res) => {
    const { registerNumber } = req;

    try {
      // Query to check the value of isMentor
      const query = 'SELECT isMentor FROM details WHERE `Register Number` = ?';
      
      const [rows] = await pool.query(query, [registerNumber]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Register number not found' });
      }

      const isMentor = rows[0].isMentor === 1;
      
      res.status(200).json({ isMentor });
    } catch (error) {
      console.error('Error checking isMentor field:', error);
      res.status(500).json({ error: 'Failed to check isMentor field' });
    }
  });

  // Existing route to update isMentor field
  router.post('/update/isMentor', async (req, res) => {
    const { registerNumber, action } = req.body; 

    try {
      // Determine the value of `isMentor` based on the action
      const isMentor = action === 'add' ? 1 : 0;

      // Update query to set isMentor field
      const query = 'UPDATE details SET isMentor = ? WHERE `Register Number` = ?';
      
      const [result] = await pool.query(query, [isMentor, registerNumber]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Register number not found' });
      }

      res.status(200).json({ message: `isMentor field updated successfully to ${isMentor}` });
    } catch (error) {
      console.error('Error updating isMentor field:', error);
      res.status(500).json({ error: 'Failed to update isMentor field' });
    }
  });

  return router;
};
