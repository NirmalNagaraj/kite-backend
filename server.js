const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dataRouter = require('./routes/data');
const filterRouter = require('./routes/filter');
const authRouter = require('./routes/auth/login');
const detailsRouter = require('./routes/details');
const authenticateToken = require('./routes/middlewares/authenticationToken');

const app = express();
const port = process.env.PORT || 5000;

// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 500,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Handle MySQL connection queue full
pool.on('enqueue', () => {
  console.warn('Warning: MySQL connection pool queue is filling up. Consider increasing the connection limit.');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', authRouter(pool));
app.use('/data', authenticateToken, dataRouter(pool)); 
app.use('/query', authenticateToken, filterRouter(pool));
app.use('/info', authenticateToken, detailsRouter(pool));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
