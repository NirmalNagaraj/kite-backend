const express = require('express');
const router = express.Router();

module.exports = (pool) => {

  router.get('/missing-fields', async (req, res) => {
    try {
      const { field } = req.query;

      const validFields = ['Resume', 'Linkedin', 'Github', 'History of Arrears', 'Current Backlogs'];
      if (!validFields.includes(field)) {
        return res.status(400).json({ error: 'Invalid field' });
      }

      const sql = `
        SELECT \`Name\`, \`Register Number\` 
        FROM details 
        WHERE \`${field}\` IN ('N/A', 'NIL')
      `;

      const connection = await pool.getConnection();
      const [results] = await connection.query(sql);
      connection.release();

      res.status(200).json(results);
    } catch (error) {
      console.error('Error retrieving missing fields data:', error);
      res.status(500).json({ error: 'Error retrieving missing fields data' });
    }
  });

  return router;
};
