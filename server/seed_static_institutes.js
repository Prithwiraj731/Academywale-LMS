const mongoose = require('mongoose');
const Institute = require('./src/model/Institute.model');

const institutes = [
  { name: 'SJC', imageUrl: '/src/assets/institues/SJC Institute .jpg' },
  { name: 'COC', imageUrl: '/src/assets/institues/COC Education.png' },
  { name: 'Navin Classes', imageUrl: '/src/assets/institues/Navin Classes.jpg' },
  { name: 'Arjun Chhabra Tutorial', imageUrl: '/src/assets/institues/Arjun Chhabra Tutorial.png' },
  { name: 'Ranjan Periwal Classes', imageUrl: '/src/assets/institues/Ranjan Periwal Classes.jpg' },
  { name: 'Avinash Lala Classes', imageUrl: '/src/assets/institues/Avinash Lala Classes.jpg' },
  { name: 'CA Buddy', imageUrl: '/src/assets/institues/CA Buddy.png' },
  { name: 'Bishnu Kedia Classes', imageUrl: '/src/assets/institues/Bishnu Kedia Classes.png' },
  { name: 'BB Virtuals', imageUrl: '/src/assets/institues/BB Virtuals.png' },
  { name: 'Gopal Bhoot Classes', imageUrl: '/src/assets/institues/Gopal Bhoot Classes.gif' },
  { name: 'CA Praveen Jindal', imageUrl: '/src/assets/institues/CA Praveen Jindal.png' },
  { name: 'Siddharth Agarrwal Classes', imageUrl: '/src/assets/institues/Siddharth Agarrwal Classes.jpg' },
  { name: 'Harshad Jaju Classes', imageUrl: '/src/assets/institues/Harshad Jaju Classes.png' },
  { name: 'AADITYA JAIN CLASSES', imageUrl: '/src/assets/institues/AADITYA JAIN CLASSES.png' },
  { name: 'Yashwant Mangal Classes', imageUrl: '/src/assets/institues/Yashwant Mangal Classes.avif' },
  { name: 'Nitin Guru Classes', imageUrl: '/src/assets/institues/Nitin Guru Classes.png' },
  { name: 'Ekatvam', imageUrl: '/src/assets/institues/Ekatvam.png' },
  { name: 'Shivangi Agarwal', imageUrl: '/src/assets/institues/Shivangi Agarwal.png' },
];

async function seed() {
  await mongoose.connect('mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/test?retryWrites=true&w=majority&appName=courses');
  for (const inst of institutes) {
    await Institute.updateOne(
      { name: inst.name },
      { $set: inst },
      { upsert: true }
    );
  }
  console.log('Institutes seeded!');
  await mongoose.disconnect();
}

seed(); 