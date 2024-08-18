const express = require('express');
const router = express.Router();

module.exports = (pool) => {

  router.post('/add', async (req, res) => {
    const {
      problemName,
      problemDescription,
      sampleInput,
      sampleOutput,
      link,
      hint,
      input1,
      input2,
      output1,
      output2
    } = req.body;

    try {
      // Insert query
      const query = `
        INSERT INTO Problems (
          ProblemName,
          ProblemDescription,
          SampleInput,
          SampleOutput,
          Link,
          Hint,
          Input1,
          Input2,
          Output1,
          Output2
        ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      const [result] = await pool.query(query, [
        problemName,
        problemDescription,
        sampleInput,
        sampleOutput,
        link,
        hint,
        input1,
        input2,
        output1,
        output2
      ]);

      res.status(201).json({ message: 'Problem added successfully', id: result.insertId });
    } catch (error) {
      console.error('Error inserting problem:', error);
      res.status(500).json({ error: 'Failed to add problem' });
    }
  });
  router.get('/all', async (req, res) => {
    try {
      const query = 'SELECT ProblemID,ProblemName FROM Problems'; // Adjust field name as needed
      const [rows] = await pool.query(query);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No problems found' });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching problems:', error);
      res.status(500).json({ error: 'Failed to fetch problems' });
    }
  });

  return router;
};
