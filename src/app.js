const express = require('express');

const authRoutes = require('./routes/authRoutes.js');
const { errorHandler } = require('./middleware/errorHandler.js');

const app = express();
// Core middleware
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;