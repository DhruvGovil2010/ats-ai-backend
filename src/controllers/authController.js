const authService = require('../services/authService.js');

exports.signup = async (req, res, next) => {
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
        return next(error);
    }
};

exports.login = async (req, res, next) => {
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
        return next(error);
    }
};

exports.refresh = async (req, res, next) => {
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
        return next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await authService.logoutUser(userId);

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        return next(error);
    }
};