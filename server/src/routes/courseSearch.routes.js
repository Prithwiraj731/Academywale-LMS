const express = require('express');
const router = express.Router();
const courseSearchController = require('../controllers/courseSearch.controller');

// Search for courses with query parameters
router.get('/api/courses/search', courseSearchController.searchCourses);

module.exports = router;
