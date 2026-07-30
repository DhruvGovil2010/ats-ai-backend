const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const redisClient = require('../config/redis.js');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens.js');

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days, matches JWT refresh expiry

const storeRefreshToken = async (userId, refreshToken) => {
    // Redis stores in key value format, Ex - { a : b }
    await redisClient.set(
        `refreshToken:${userId}`,
        refreshToken,
        'EX', // Redis command which stores 'expire this key after N seconds'.
        REFRESH_TOKEN_TTL_SECONDS
    );
};

exports.registerUser = async ({ name, email, password, role }) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error('Email is already registered');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    const accessToken = generateAccessToken(newUser._id, newUser.role);
    const refreshToken = generateRefreshToken(newUser._id);

    await storeRefreshToken(newUser._id, refreshToken);

    return {
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        accessToken,
        refreshToken,
    };
};

exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    await storeRefreshToken(user._id, refreshToken);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

exports.refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('Refresh token is required');
        error.statusCode = 401;
        throw error;
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } 
    catch (err) {
        const error = new Error('Invalid or expired refresh token');
        error.statusCode = 401;
        throw error;
    }

    const storedToken = await redisClient.get(`refreshToken:${decoded.id}`);

    if (!storedToken || storedToken !== refreshToken) {
        const error = new Error('Refresh token not recognized, please log in again');
        error.statusCode = 401;
        throw error;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        const error = new Error('User no longer exists');
        error.statusCode = 401;
        throw error;
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id);

    await storeRefreshToken(user._id, newRefreshToken);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

exports.logoutUser = async (userId) => {
    await redisClient.del(`refreshToken:${userId}`);
};