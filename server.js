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
const adminAuth = require('./routes/auth/adminLogin');
const profileRouter = require('./routes/profile');
const companyData = require('./routes/company');
const configRouter = require('./routes/config');
const adminAuthConfig = require('./routes/auth/adminPassword');
const questionRouter = require('./routes/questions');
const userAuthConfig = require('./routes/auth/userPassword');
const app = express();
const port = process.env.PORT || 5000;

// MySQL database configuration
const pool = mysql.createPool({
  connectionLimit: 10,
  connectTimeout:10000,
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
app.use('/query', filterRouter(pool));
app.use('/info', authenticateToken, detailsRouter(pool));
app.use('/profile', profileRouter(pool));
app.use('/auth',adminAuth(pool))
app.use('/company',companyData(pool)); 
app.use('/config',configRouter(pool));
app.use('/auth',adminAuthConfig(pool));
app.use('/questions',questionRouter(pool));
app.use('/user',userAuthConfig(pool)); 
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);  
});
