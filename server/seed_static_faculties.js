// Migration script: Insert static faculties into MongoDB
// Usage: node server/seed_static_faculties.js

const mongoose = require('mongoose');
const path = require('path');
const Faculty = require('./src/model/Faculty.model.js');

// List of static faculties (copy-paste from facultyList.js, but as plain JS array)
const facultyList = [
  { name: 'VIJAY SARDA', img: 'VIJAY SARDA.png' },
  { name: 'AADITYA JAIN', img: 'AADITYA JAIN.png' },
  { name: 'AVINASH LALA', img: 'AVINASH LALA.png' },
  { name: 'BISHNU KEDIA', img: 'BISHNU KEDIA.png' },
  { name: 'MAYANK SARAF', img: 'MAYANK SARAF.png' },
  { name: 'DARSHAN KHARE', img: 'DARSHAN KHARE.png' },
  { name: 'DIVYA AGARWAL', img: 'DIVYA AGARWAL.png' },
  { name: 'SANTOSH KUMAR', img: 'SANTOSH KUMAR.png' },
  { name: 'RANJAN PERIWAL', img: 'RANJAN PERIWAL.png' },
  { name: 'VISHAL BHATTAD', img: 'VISHAL BHATTAD.png' },
  { name: 'SHIVANGI AGARWAL', img: 'SHIVANGI AGARWAL.png' },
];

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/test'; // Change DB name if needed

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  for (const fac of facultyList) {
    const [firstName, ...rest] = fac.name.split(' ');
    const lastName = rest.join(' ');
    const imageUrl = `/static/facultyProfiles/${fac.img}`;
    await Faculty.updateOne(
      { firstName: firstName.toUpperCase() },
      {
        $set: {
          firstName: firstName.toUpperCase(),
          lastName,
          imageUrl,
        }
      },
      { upsert: true }
    );
    console.log(`Seeded: ${fac.name}`);
  }
  await mongoose.disconnect();
  console.log('Seeding done!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 