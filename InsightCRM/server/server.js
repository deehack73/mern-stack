
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const customerRoutes = require('./routes/customerRoutes');
const connectDB = require('./config/db');
const leadRoutes = require('./routes/leadRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const activityRoutes = require('./routes/activityRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'InsightCRM API is running'
  });
});

// Customer API routes
app.use('/api/customers', customerRoutes);
// Lead API routes
app.use('/api/leads', leadRoutes);
// Oppurtunities API routes
app.use('/api/opportunities', opportunityRoutes);
// Activities API routes
app.use('/api/activities', activityRoutes);
// Dshboard API routes
app.use('/api/dashboard', dashboardRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server after database connection
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`InsightCRM server running on port ${PORT}`);
  });
};

startServer();
