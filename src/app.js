const express = require('express');

const app = express();

// Core middleware
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;