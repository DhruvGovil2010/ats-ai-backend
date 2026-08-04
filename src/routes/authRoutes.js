const express = require('express');
const router = express.Router();

const { signup, login, refresh, logout } = require('../controllers/authController.js');
const { signupValidator, loginValidator } = require('../validators/authValidator.js');
const { verifyJWT } = require('../middleware/authMiddleware.js');
const { createRateLimiter } = require('../middleware/rateLimiter.js');

const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again after 15 minutes',
});

const signupLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: 'Too many signup attempts, please try again after an hour',
});

router.post('/signup', signupLimiter, signupValidator, signup);
router.post('/login', loginLimiter, loginValidator, login);
router.post('/refresh', refresh);
router.get('/logout', verifyJWT, logout);

module.exports = router;