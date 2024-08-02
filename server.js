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
const profileRouter = require('./routes/profile');
const app = express();
const port = process.env.PORT || 5000;

// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 50,
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
app.use(cors({
  origin: process.env.DOMAIN, // Replace with your frontend domain
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Enable to include credentials (cookies, authorization headers, etc.) with requests
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/auth', authRouter(pool));
app.use('/data', authenticateToken, dataRouter(pool)); 
app.use('/query', filterRouter(pool));
app.use('/info', authenticateToken, detailsRouter(pool));
app.use('/profile', profileRouter(pool));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
