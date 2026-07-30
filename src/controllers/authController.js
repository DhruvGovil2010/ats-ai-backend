const authService = require('../services/authService');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const result = await authService.registerUser({ name, email, password, role });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    }
    catch (error) {
        const errorStatus = error.statusCode || 500;
        return res.status(errorStatus).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authService.loginUser({ email, password });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    }
    catch (error) {
        const errorStatus = error.statusCode || 500;
        return res.status(errorStatus).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const result = await authService.refreshAccessToken(refreshToken);

        return res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully',
            data: result,
        });
    } 
    catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const userId = req.user.id;

        await authService.logoutUser(userId);

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } 
    catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Something went wrong',
        });
    }
};