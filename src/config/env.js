require('dotenv').config();

const env = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

module.exports = env;
