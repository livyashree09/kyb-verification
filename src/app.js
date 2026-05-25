const express = require('express');
const kybRoutes = require('./routes/kybRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// Routes
app.use('/api/kyb', kybRoutes);
app.use('/api/verify', verificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
