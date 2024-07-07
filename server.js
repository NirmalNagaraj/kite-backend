// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataRouter = require('./routes/data');

const app = express();
const port = 3000;

// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 50, // Limit the number of simultaneous connections
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/data', dataRouter(pool)); // Pass pool to dataRouter

// Start the server
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
