const express = require('express');
const router = express.Router();

const { signup, login, refresh, logout } = require('../controllers/authController.js');
const { signupValidator, loginValidator } = require('../validators/authValidator.js');
const { verifyJWT } = require('../middleware/authMiddleware.js');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/refresh', refresh);
router.post('/logout', verifyJWT, logout);

module.exports = router;