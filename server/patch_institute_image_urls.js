const mongoose = require('mongoose');
const Institute = require('./src/model/Institute.model');

const mapping = [
  'aaditya_jain_classes.png',
  'arjun_chhabra_tutorial.png',
  'avinash_lala_classes.jpg',
  'bb_virtuals.png',
  'bishnu_kedia_classes.png',
  'ca_buddy.png',
  'ca_praveen_jindal.png',
  'coc_education.png',
  'ekatvam.png',
  'gopal_bhoot_classes.gif',
  'harshad_jaju_classes.png',
  'navin_classes.jpg',
  'nitin_guru_classes.png',
  'ranjan_periwal_classes.jpg',
  'sjc_institute.jpg',
  'shivangi_agarwal.png',
  'siddharth_agarrwal_classes.jpg',
  'yashwant_mangal_classes.avif',
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