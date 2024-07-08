// routes/data.js

const express = require('express');
const router = express.Router();

// Define routes that require MySQL pool
module.exports = (pool) => {

  router.post('/insert', async (req, res) => {
    try {
      const { RegisterNumber, Name, Email, Age } = req.body;

      // Get a connection from the pool
      const connection = await pool.getConnection();

      // SQL query to insert data into a table
      const sql = 'INSERT INTO data (RegisterNumber, Name, Email, Age) VALUES (?, ?, ?, ?)';
      const values = [RegisterNumber, Name, Email, Age];

      // Execute the query
      const result = await connection.query(sql, values);

      // Release the connection
      connection.release();

      console.log('Inserted:', result);

      res.status(200).json({ message: 'Data inserted successfully' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Error inserting data' });
    }
  });

  return router;
};
