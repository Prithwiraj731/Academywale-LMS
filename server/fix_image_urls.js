const mongoose = require('mongoose');
const Faculty = require('./src/model/Faculty.model');
const Testimonial = require('./src/model/Testimonial.model');

// Load environment variables
require('dotenv').config();

const DB_URL = process.env.DB_URL || 'mongodb+srv://prithwi1016:4xtVi1z1uzyAdA7v@courses.znwo0tt.mongodb.net/?retryWrites=true&w=majority&appName=courses';

async function fixImageUrls() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(DB_URL);
        console.log('✅ Connected to MongoDB');

        // Fix Faculty images
        console.log('\n📋 Fixing Faculty images...');
        const faculties = await Faculty.find({
            $or: [
                { imageUrl: { $exists: false } },
                { imageUrl: '' },
                { imageUrl: null }
            ],
            image: { $exists: true, $ne: '', $ne: null }
        });

        console.log(`Found ${faculties.length} faculty records to fix`);

        for (const faculty of faculties) {
            if (faculty.image && faculty.image.trim() !== '') {
                const cloudinaryUrl = `https://res.cloudinary.com/drlqhsjgm/image/upload/academywale/permanent/${faculty.image}`;
                
                await Faculty.updateOne(
                    { _id: faculty._id },
                    { $set: { imageUrl: cloudinaryUrl } }
                );
                
                console.log(`✅ Fixed ${faculty.firstName} ${faculty.lastName || ''} - ${cloudinaryUrl}`);
            }
        }

        // Fix Testimonial images
        console.log('\n🗣️ Fixing Testimonial images...');
        const testimonials = await Testimonial.find({
            $or: [
                { imageUrl: { $exists: false } },
                { imageUrl: '' },
                { imageUrl: null }
            ],
            image: { $exists: true, $ne: '', $ne: null }
        });

        console.log(`Found ${testimonials.length} testimonial records to fix`);

        for (const testimonial of testimonials) {
            if (testimonial.image && testimonial.image.trim() !== '') {
                const cloudinaryUrl = `https://res.cloudinary.com/drlqhsjgm/image/upload/academywale/permanent/${testimonial.image}`;
                
                await Testimonial.updateOne(
                    { _id: testimonial._id },
                    { $set: { imageUrl: cloudinaryUrl } }
                );
                
                console.log(`✅ Fixed ${testimonial.name} - ${cloudinaryUrl}`);
            }
        }

        console.log('\n🎉 All image URLs have been fixed!');
        
    } catch (error) {
        console.error('❌ Error fixing image URLs:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit();
    }
}

// Run the fix
console.log('🚀 Starting image URL fix...');
fixImageUrls();
