const express = require('express');
const router = express.Router();

module.exports = (pool) => {

  router.post('/filter', async (req, res) => {
    try {
      const { tenthPercentage, diplomaOr12thPercentage, cgpa, historyOfArrears, currentBacklogs } = req.body;

      const connection = await pool.getConnection();

      let sql = `
        SELECT * FROM details 
        WHERE 
          \`10 Percent\` >= ? AND 
          \`Diploma / 12th Percentage\` >= ? AND 
          CGPA >= ? 
      `;
      const values = [tenthPercentage, diplomaOr12thPercentage, cgpa];

      if (historyOfArrears) {
        sql += 'AND `History of Arrears` != \'N/A\' AND `History of Arrears` <= ? ';
        values.push(historyOfArrears);
      }

      if (currentBacklogs) {
        sql += 'AND `Current Backlogs` != \'N/A\' AND `Current Backlogs` <= ? ';
        values.push(currentBacklogs);
      }

      const [results] = await connection.query(sql, values);

      connection.release();
      res.status(200).json(results);
    } catch (error) {
      console.error('Error filtering data:', error);
      res.status(500).json({ error: 'Error filtering data' });
    }
  });

  return router;
};
