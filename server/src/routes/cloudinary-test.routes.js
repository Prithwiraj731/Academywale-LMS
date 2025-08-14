const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

// Test endpoint to check Cloudinary configuration
router.get('/api/test/cloudinary', (req, res) => {
    try {
        // Get current configuration
        const config = cloudinary.config();
        
        // Check if the API key matches the old problematic one
        const hasProblematicKey = config.api_key === '959547171781827';
        
        // Return sanitized configuration (no secrets)
        res.json({
            success: true,
            cloud_name: config.cloud_name,
            api_key_last_5: config.api_key ? config.api_key.slice(-5) : 'unknown',
            api_key_length: config.api_key ? config.api_key.length : 0,
            hasProblematicKey: hasProblematicKey,
            secure: config.secure,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error checking Cloudinary config:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Test endpoint to try a direct upload to Cloudinary
router.post('/api/test/cloudinary-upload', (req, res) => {
    try {
        // Get the current configuration info
        const config = cloudinary.config();
        
        // Create a test upload using Node.js Buffer
        // This is a simple 1x1 pixel transparent PNG
        const testImage = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
        
        cloudinary.uploader.upload_stream(
            {
                folder: 'test-uploads',
                public_id: `test-${Date.now()}`,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({
                        success: false,
                        error: error.message,
                        cloudName: config.cloud_name,
                        apiKeyLastDigits: config.api_key ? `...${config.api_key.slice(-5)}` : 'unknown'
                    });
                }
                
                res.json({
                    success: true,
                    result: {
                        public_id: result.public_id,
                        url: result.secure_url,
                        created_at: result.created_at
                    },
                    config: {
                        cloudName: config.cloud_name,
                        apiKeyLastDigits: `...${config.api_key.slice(-5)}`,
                        isCorrectKey: config.api_key === '367882575567196'
                    }
                });
            }
        ).end(testImage);
    } catch (error) {
        console.error('Error in Cloudinary test upload:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
