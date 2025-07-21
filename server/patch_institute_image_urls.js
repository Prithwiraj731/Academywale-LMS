const mongoose = require('mongoose');
const Institute = require('./src/model/Institute.model');

const mapping = [
  'SJC Institute .jpg',
  'COC Education.png',
  'Navin Classes.jpg',
  'Arjun Chhabra Tutorial.png',
  'Ranjan Periwal Classes.jpg',
  'Avinash Lala Classes.jpg',
  'CA Buddy.png',
  'Bishnu Kedia Classes.png',
  'BB Virtuals.png',
  'Gopal Bhoot Classes.gif',
  'CA Praveen Jindal.png',
  'Siddharth Agarrwal Classes.jpg',
  'Harshad Jaju Classes.png',
  'AADITYA JAIN CLASSES.png',
  'Yashwant Mangal Classes.avif',
  'Nitin Guru Classes.png',
  'Ekatvam.png',
  'Shivangi Agarwal.png',
];

async function patch() {
  await mongoose.connect('mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/test?retryWrites=true&w=majority&appName=courses');
  for (const filename of mapping) {
    const name = filename.replace(/\.[^.]+$/, '').replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
    // Try to match by name (case-insensitive)
    const inst = await Institute.findOne({ name: new RegExp('^' + name + '$', 'i') });
    if (inst) {
      inst.imageUrl = `/institutes/${filename}`;
      await inst.save();
      console.log(`Updated: ${inst.name} -> ${inst.imageUrl}`);
    } else {
      console.log(`Not found: ${name}`);
    }
  }
  await mongoose.disconnect();
  console.log('Done patching image URLs.');
}

patch(); 