// server.js

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
  host: 'bthtaa9yfsrz9p5amwtm-mysql.services.clever-cloud.com',
  user: 'uzkyjw7rnkq4xkkp',
  password: 'wSS7B2RxWvRMPkeR4HLD',
  database: 'bthtaa9yfsrz9p5amwtm'
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
