const { registerUser, loginUser } = require('../services/authService');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const result = await registerUser({ name, email, password, role });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};