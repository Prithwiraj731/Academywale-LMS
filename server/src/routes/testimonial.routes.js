const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');

// Public read-only testimonials; mutations disabled (hardcoded on client)
router.get('/', testimonialController.getAllTestimonials);
router.get('/:id', testimonialController.getTestimonialById);

module.exports = router;