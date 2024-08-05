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
  router.post('/update-profile', extractRegisterNumber, async (req, res) => {
    const { cgpa, historyOfArrears, currentBacklogs, skillset, otherDomain, resumeLink, githubLink, linkedinLink } = req.body;
    const registerNumber = req.registerNumber;
  
    try {
      await pool.query(
        'UPDATE details SET CGPA = ?, `History of Arrears` = ?, `Current Backlogs` = ?, `Skill Set` = ?, `Other Interested Domain` = ?, Resume = ?, Github = ?, Linkedin = ? WHERE `Register Number` = ?',
        [cgpa, historyOfArrears, currentBacklogs, skillset, otherDomain, resumeLink, githubLink, linkedinLink, registerNumber]
      );
      res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
