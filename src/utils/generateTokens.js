const jwt = require('jsonwebtoken');
const env = require('../config/env.js');

exports.generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};