const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redisClient = require('../config/redis.js');

exports.createRateLimiter = ({ windowMs, max, message }) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: message || 'Too many requests, please try again later',
        },
        store: new RedisStore({
            sendCommand: (...args) => redisClient.call(...args),
        }),
    });
};