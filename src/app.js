const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes.js');
// Core middleware
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

module.exports = app;