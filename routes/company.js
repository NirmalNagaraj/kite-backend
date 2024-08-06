const express = require('express');
const router = express.Router();
const moment = require('moment');
const extractRegisterNumber = require('./middlewares/extractRegisterNumber');

module.exports = (pool) => {
  // Route to get upcoming company data
  router.get('/upcoming', extractRegisterNumber, async (req, res) => {
    const { registerNumber } = req;
    

    try {
      // Fetch student CGPA using register number
      const [studentRows] = await pool.query('SELECT CGPA FROM details WHERE `Register Number` = ?', [registerNumber]);

      if (studentRows.length === 0) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const studentCGPA = studentRows[0].CGPA;
  
      

      // Query to get upcoming companies with criteria filtering
      const [companyRows] = await pool.query(
        'SELECT * FROM Company WHERE date >= CURDATE() AND criteria <= ?',
        [studentCGPA]
      );

      res.json(companyRows);
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/upcoming-companies', async (req, res) => {
    try {
      // Query to get companies with date >= CURDATE()
      const [rows] = await pool.query('SELECT * FROM Company WHERE date >= CURDATE()');
      
      res.status(200).json(rows);
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  // Route to get previous company data
  router.get('/previous', async (req, res) => {
    try {
      const currentDate = moment().format('YYYY-MM-DD');
      const [rows] = await pool.query('SELECT * FROM Company WHERE date < ?', [currentDate]);

      res.status(200).json(rows);
    } catch (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/add', async (req, res) => {
    const { name, date, ctc, criteria,type, role, link } = req.body;

    try {
      const query = 'INSERT INTO Company (name, date, ctc, criteria,type, role, link) VALUES (?, ?, ?, ?, ?, ?, ?)';
      await pool.query(query, [name, date, ctc, criteria,type, role, link]);
      res.status(201).json({ success: true, message: 'Company added successfully!' });
    } catch (error) {
      console.error('Error adding company:', error);
      res.status(500).json({ success: false, message: 'Error adding company' });
    }
  });

  return router;
};
