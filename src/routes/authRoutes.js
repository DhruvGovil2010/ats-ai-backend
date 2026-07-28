const express = require('express');
const router = express.Router();

const { signup, login } = require('../controllers/authController.js');
const { signupValidator, loginValidator } = require('../validators/authValidator.js');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);

module.exports = router;