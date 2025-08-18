const express = require('express');
const router = express.Router();
const courseDetailController = require('../controllers/courseDetail.controller');

// Get course details by ID
router.get('/api/courses/details/:courseId', courseDetailController.getCourseDetails);

module.exports = router;
