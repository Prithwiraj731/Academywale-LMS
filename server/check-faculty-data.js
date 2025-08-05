const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.DB_URL || 'mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/?retryWrites=true&w=majority&appName=courses')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    
    // Import Faculty model
    const Faculty = require('./src/model/Faculty.model');
    
    // Get the most recent 5 faculty entries
    Faculty.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .then(faculties => {
        console.log('\n📋 Most recent 5 faculty entries:');
        faculties.forEach((faculty, index) => {
          console.log(`\n${index + 1}. ${faculty.firstName} ${faculty.lastName || ''}`);
          console.log(`   - imageUrl: "${faculty.imageUrl}"`);
          console.log(`   - image: "${faculty.image}"`);
          console.log(`   - public_id: "${faculty.public_id}"`);
          console.log(`   - created: ${faculty.createdAt}`);
        });
        
        process.exit(0);
      })
      .catch(err => {
        console.error('❌ Error fetching faculties:', err);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
