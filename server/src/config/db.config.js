const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnection() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = dbConnection;
