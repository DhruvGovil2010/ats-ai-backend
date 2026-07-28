const app = require('./app.js');
const env = require('./config/env.js');
const connectDB = require('./config/db.js');

const PORT = env.PORT;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();