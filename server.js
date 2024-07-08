require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataRouter = require('./routes/data');
const filterRouter = require('./routes/filter');

const app = express();
const port = process.env.PORT || 5000;

// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 500, // Limit the number of simultaneous connections
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Handle MySQL connection queue full
pool.on('enqueue', () => {
  console.warn('Warning: MySQL connection pool queue is filling up. Consider increasing the connection limit.');
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Custom middleware to check connection pool status
app.use((req, res, next) => {
  if (pool._enqueueCallbackLength > 10) { // Adjust the threshold as needed
    const message = 'Server is currently at capacity. Please try again later.';
    res.status(503).json({ error: message }); // Send an alert message as JSON response
  } else {
    next();
  }
});

// Routes
app.use('/data', dataRouter(pool)); // Pass pool to dataRouter
app.use('/query', filterRouter(pool)); // Pass pool to dataRouter

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
