const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dataRouter = require('./routes/data');
const filterRouter = require('./routes/filter');
const authRouter = require('./routes/auth/login');
const detailsRouter = require('./routes/details');
const authenticateToken = require('./routes/middlewares/authenticationToken');
const adminAuth = require('./routes/auth/adminLogin');
const profileRouter = require('./routes/profile');
const companyData = require('./routes/company');
const configRouter = require('./routes/config'); 
const adminAuthConfig = require('./routes/auth/adminPassword');
const questionRouter = require('./routes/questions');
const userAuthConfig = require('./routes/auth/userPassword');
const analyticsRouter = require('./routes/analytics');
const isMentorRouter = require('./routes/auth/isMentor');
const problemRouter = require('./routes/problem');
const compilerRouter = require('./routes/compiler')
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config;
 
// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 1000, 
  connectTimeout: 60000, 
  host: process.env.DB_HOST,
  user: process.env.DB_USER,  
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,  
  queueLimit: 0
}); 


// Handle MySQL connection queue full 
pool.on('enqueue', () => {
  console.warn('Warning: MySQL connection pool queue is filling up. Consider increasing the connection limit.');
});

const corsOptions = {
  origin: process.env.DOMAIN, // Use the environment variable
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies or HTTP Auth headers if needed
};

// Apply CORS middleware with the configured options
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser()); 

// Middleware to handle MySQL disconnections and acquire a connection
app.use(async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    req.connection = connection;
    next();
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    res.status(500).send('Database connection error');
  }
});

// Middleware to release connection after response
app.use((req, res, next) => {
  res.on('finish', () => {
    if (req.connection) req.connection.release();
  });
  next();
});

// Routes
app.use('/auth', authRouter);
app.use('/data', authenticateToken, dataRouter(pool)); 
app.use('/query', filterRouter(pool));
app.use('/info', authenticateToken, detailsRouter(pool));
app.use('/profile', profileRouter(pool)); 
app.use('/auth', adminAuth(pool));
app.use('/company', companyData(pool)); 
app.use('/config', configRouter(pool));
app.use('/auth', adminAuthConfig(pool)); 
app.use('/questions', questionRouter(pool));
app.use('/user', userAuthConfig(pool));  
app.use('/analytics', analyticsRouter(pool));
app.use('/mentor',isMentorRouter(pool));
app.use('/problems',problemRouter(pool));
app.use('/',compilerRouter(pool)); 
// app.use('/',decodeToken(pool));
// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).send('Internal Server Error');
});

// Start the server 
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
