const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function testDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('DB_URL:', process.env.DB_URL);
    
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test a simple query
    const Faculty = require('./src/model/Faculty.model');
    const faculties = await Faculty.find({}).limit(1);
    console.log(`✅ Found ${faculties.length} faculties`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testDBConnection();