const express = require('express');

const cors = require('cors');

const cookieParser = require(
  'cookie-parser',
);

const path = require('path');

const dotenv = require('dotenv');

dotenv.config();

// ROUTES
const authRoutes = require(
  './routes/authRoutes',
);

const plotRoutes = require(
  './routes/plotRoutes',
);

const enquiryRoutes = require(
  './routes/enquiryRoutes',
);

const userRoutes = require(
  './routes/userRoutes',
);

const {
  getDashboardStats,
} = require('./controllers/dashboardController');


const app = express();

// MIDDLEWARES
app.use(
  cors({
    origin: '*',

    methods: [
      'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
    ],

    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(cookieParser());

// STATIC UPLOAD FOLDER
app.use(
  '/uploads',
  express.static(
    path.join(
      __dirname,
      'uploads',
    ),
  ),
);

// ROUTES
app.use('/api', authRoutes);

app.use('/api', userRoutes);

app.use(
  '/api/plots', plotRoutes);

app.use(
  '/api/enquiries', enquiryRoutes);

app.get('/api/dashboard/stats', getDashboardStats);

// TEST ROUTE
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GreenView API running',
  });
});

// 404 ROUTE
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route Not Found',
  });
});

module.exports = app;
