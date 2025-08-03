const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary.config');
const upload = multer({ storage });
const testimonialController = require('../controllers/testimonial.controller');

router.post('/', upload.single('image'), testimonialController.createTestimonial);

// I am assuming your other testimonial routes look something like this
router.get('/', testimonialController.getAllTestimonials);
router.get('/:id', testimonialController.getTestimonialById);
router.put('/:id', upload.single('image'), testimonialController.updateTestimonial);
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;