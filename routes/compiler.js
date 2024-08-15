const express = require('express');
const axios = require('axios');
const router = express.Router();

module.exports = (pool) => {
  router.post('/compile', async (req, res) => {
    try {
      const { script, stdin, language, versionIndex } = req.body;

      const clientId = '579d9bba7c7757b6bfe20593854ffc13';
      const clientSecret = '636d206ce9f5c97f9dad46d6ce6a2b32b1b8475b42605096d272f88701c19fda';

      const response = await axios.post('https://api.jdoodle.com/v1/execute', {
        clientId,
        clientSecret,
        script,
        stdin,
        language,
        versionIndex,
        compileOnly: false, // Include if required
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error compiling code:', error);
      res.status(500).json({ error: 'Error compiling code' });
    }
  });

  return router;
};
