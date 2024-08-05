const express = require('express');
const router = express.Router();
const extractRegisterNumber = require('./middlewares/extractRegisterNumber')
module.exports = (pool) => {
  // Add a new question
  router.post('/add-question',extractRegisterNumber, async (req, res) => {
    const { companyName, year, round, question, solution, tags, externalLinks, additionalNotes } = req.body;
    const registerNumber = req.registerNumber;
    
    try {
      const [result] = await pool.query(
        'INSERT INTO CompanyQuestions (companyName, year, round, question, solution, tags, externalLinks, additionalNotes, registerNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [companyName, year, round, question, solution, tags, externalLinks, additionalNotes, registerNumber]
      );
      res.status(201).json({ message: 'Question added successfully', questionId: result.insertId });
    } catch (error) {
      console.error('Error adding question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Retrieve questions by company name
  router.get('/questions/:companyName', async (req, res) => {
    const { companyName } = req.params;

    try {
      const [rows] = await pool.query('SELECT * FROM CompanyQuestions WHERE companyName = ?', [companyName]);
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error retrieving questions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.get('/detail/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await pool.query('SELECT * FROM CompanyQuestions WHERE id = ?', [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Question not found' });
      }
  
      const question = {
        ...rows[0],
        tags: rows[0].tags.split(',').map(tag => tag.trim()),
      };
  
      res.json(question);
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Retrieves all questions
  router.get('/all', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM CompanyQuestions');
      const questions = rows.map(row => ({
        ...row,
        tags: row.tags.split(',').map(tag => tag.trim()),
      }));
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  // Update a question
  router.put('/update-question/:id', async (req, res) => {
    const { id } = req.params;
    const { companyName, year, round, question, solution, tags, externalLinks, additionalNotes, registerNumber } = req.body;

    try {
      await pool.query(
        'UPDATE CompanyQuestions SET companyName = ?, year = ?, round = ?, question = ?, solution = ?, tags = ?, externalLinks = ?, additionalNotes = ?, registerNumber = ? WHERE id = ?',
        [companyName, year, round, question, solution, tags, externalLinks, additionalNotes, registerNumber, id]
      );
      res.status(200).json({ message: 'Question updated successfully' });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete a question
  router.delete('/delete-question/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query('DELETE FROM CompanyQuestions WHERE id = ?', [id]);
      res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
