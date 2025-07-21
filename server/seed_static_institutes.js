const mongoose = require('mongoose');
const Institute = require('./src/model/Institute.model');

const institutes = [
  { name: 'SJC', imageUrl: '/institutes/sjc_institute.jpg' },
  { name: 'COC', imageUrl: '/institutes/coc_education.png' },
  { name: 'Navin Classes', imageUrl: '/institutes/navin_classes.jpg' },
  { name: 'Arjun Chhabra Tutorial', imageUrl: '/institutes/arjun_chhabra_tutorial.png' },
  { name: 'Ranjan Periwal Classes', imageUrl: '/institutes/ranjan_periwal_classes.jpg' },
  { name: 'Avinash Lala Classes', imageUrl: '/institutes/avinash_lala_classes.jpg' },
  { name: 'CA Buddy', imageUrl: '/institutes/ca_buddy.png' },
  { name: 'Bishnu Kedia Classes', imageUrl: '/institutes/bishnu_kedia_classes.png' },
  { name: 'BB Virtuals', imageUrl: '/institutes/bb_virtuals.png' },
  { name: 'Gopal Bhoot Classes', imageUrl: '/institutes/gopal_bhoot_classes.gif' },
  { name: 'CA Praveen Jindal', imageUrl: '/institutes/ca_praveen_jindal.png' },
  { name: 'Siddharth Agarrwal Classes', imageUrl: '/institutes/siddharth_agarrwal_classes.jpg' },
  { name: 'Harshad Jaju Classes', imageUrl: '/institutes/harshad_jaju_classes.png' },
  { name: 'AADITYA JAIN CLASSES', imageUrl: '/institutes/aaditya_jain_classes.png' },
  { name: 'Yashwant Mangal Classes', imageUrl: '/institutes/yashwant_mangal_classes.avif' },
  { name: 'Nitin Guru Classes', imageUrl: '/institutes/nitin_guru_classes.png' },
  { name: 'Ekatvam', imageUrl: '/institutes/ekatvam.png' },
  { name: 'Shivangi Agarwal', imageUrl: '/institutes/shivangi_agarwal.png' },
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