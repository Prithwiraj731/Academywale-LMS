const express = require('express');
const router = express.Router();
const Faculty = require('../model/Faculty.model');
const Testimonial = require('../model/Testimonial.model');

/**
 * GET /api/migration/missing-images
 * Returns all faculty and testimonials that have missing or broken images
 */
router.get('/missing-images', async (req, res) => {
    try {
        // Find faculty with missing images (empty public_id AND imageUrl pointing to /uploads)
        const facultiesWithMissingImages = await Faculty.find({
            $and: [
                { $or: [
                    { public_id: { $exists: false } },
                    { public_id: '' },
                    { public_id: null }
                ]},
                { $or: [
                    { image: { $exists: false } },
                    { image: '' },
                    { image: null }
                ]},
                { imageUrl: { $regex: /^\/uploads\// } }
            ]
        }).select('_id firstName lastName imageUrl slug');

        // Find testimonials with missing images
        const testimonialsWithMissingImages = await Testimonial.find({
            $and: [
                { $or: [
                    { public_id: { $exists: false } },
                    { public_id: '' },
                    { public_id: null }
                ]},
                { $or: [
                    { image: { $exists: false } },
                    { image: '' },
                    { image: null }
                ]},
                { imageUrl: { $regex: /^\/uploads\// } }
            ]
        }).select('_id name role imageUrl');

        console.log(`📊 Found ${facultiesWithMissingImages.length} faculty and ${testimonialsWithMissingImages.length} testimonials with missing images`);

        res.json({
            success: true,
            data: {
                faculties: facultiesWithMissingImages,
                testimonials: testimonialsWithMissingImages,
                totalCount: facultiesWithMissingImages.length + testimonialsWithMissingImages.length
            }
        });
    } catch (error) {
        console.error('❌ Error fetching missing images:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch missing images',
            error: error.message
        });
    }
});

/**
 * POST /api/migration/update-faculty-image/:id
 * Update a faculty member's image with proper Cloudinary data
 */
router.post('/update-faculty-image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl, public_id } = req.body;

        if (!imageUrl || !public_id) {
            return res.status(400).json({
                success: false,
                message: 'imageUrl and public_id are required'
            });
        }

        const updatedFaculty = await Faculty.findByIdAndUpdate(
            id,
            {
                $set: {
                    imageUrl: imageUrl,
                    image: public_id,
                    public_id: public_id
                }
            },
            { new: true }
        );

        if (!updatedFaculty) {
            return res.status(404).json({
                success: false,
                message: 'Faculty not found'
            });
        }

        console.log(`✅ Updated faculty ${updatedFaculty.firstName} with new image: ${imageUrl}`);

        res.json({
            success: true,
            message: 'Faculty image updated successfully',
            data: updatedFaculty
        });
    } catch (error) {
        console.error('❌ Error updating faculty image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update faculty image',
            error: error.message
        });
    }
});

/**
 * POST /api/migration/update-testimonial-image/:id
 * Update a testimonial's image with proper Cloudinary data
 */
router.post('/update-testimonial-image/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl, public_id } = req.body;

        if (!imageUrl || !public_id) {
            return res.status(400).json({
                success: false,
                message: 'imageUrl and public_id are required'
            });
        }

        const updatedTestimonial = await Testimonial.findByIdAndUpdate(
            id,
            {
                $set: {
                    imageUrl: imageUrl,
                    image: public_id,
                    public_id: public_id
                }
            },
            { new: true }
        );

        if (!updatedTestimonial) {
            return res.status(404).json({
                success: false,
                message: 'Testimonial not found'
            });
        }

        console.log(`✅ Updated testimonial ${updatedTestimonial.name} with new image: ${imageUrl}`);

        res.json({
            success: true,
            message: 'Testimonial image updated successfully',
            data: updatedTestimonial
        });
    } catch (error) {
        console.error('❌ Error updating testimonial image:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update testimonial image',
            error: error.message
        });
    }
});

module.exports = router;
