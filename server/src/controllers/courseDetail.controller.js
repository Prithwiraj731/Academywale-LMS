const Faculty = require('../model/Faculty.model');
const mongoose = require('mongoose');
const CourseLookupService = require('../services/courseLookupService');

// Initialize the course lookup service
const courseLookupService = new CourseLookupService();

// Get course details by ID - Enhanced with comprehensive lookup strategies
exports.getCourseDetails = async (req, res) => {
  // Always set content type to JSON to ensure consistent responses
  res.setHeader('Content-Type', 'application/json');
  
  const startTime = Date.now();
  const { courseId } = req.params;
  const courseType = req.query.courseType || null;
  const debugMode = req.query.debug === 'true';
  
  // Log the incoming request
  console.log(`🌐 Course details request: ID=${courseId}, Type=${courseType || 'none'}, Debug=${debugMode}`);
  
  try {
    // Validate courseId parameter
    if (!courseId) {
      console.error('❌ No courseId provided in request parameters');
      return res.status(400).json({
        success: false,
        error: 'Course ID is required',
        courseId: 'missing',
        duration: Date.now() - startTime
      });
    }

    // Use the enhanced course lookup service
    const lookupResult = await courseLookupService.findCourseById(courseId, courseType, debugMode);
    
    if (lookupResult.success) {
      console.log(`✅ Course found successfully using strategy: ${lookupResult.matchStrategy}`);
      
      // Return successful response
      const response = {
        success: true,
        course: lookupResult.course,
        duration: Date.now() - startTime
      };

      // Add debug information if requested
      if (debugMode) {
        response.matchStrategy = lookupResult.matchStrategy;
        response.searchAttempts = lookupResult.searchAttempts;
        response.debugInfo = lookupResult.debugInfo;
      }

      return res.status(200).json(response);
    } else {
      console.log(`❌ Course not found after trying all strategies`);
      
      // Return comprehensive error response
      const errorResponse = {
        success: false,
        error: lookupResult.error || 'Course not found',
        courseId: courseId,
        duration: Date.now() - startTime
      };

      // Add debug information if requested
      if (debugMode) {
        errorResponse.searchAttempts = lookupResult.searchAttempts;
        errorResponse.debugInfo = lookupResult.debugInfo;
      }

      // Add suggestions if available
      if (lookupResult.suggestions && lookupResult.suggestions.length > 0) {
        errorResponse.suggestions = lookupResult.suggestions;
        errorResponse.message = 'Course not found, but here are some similar courses you might be looking for:';
      }

      return res.status(404).json(errorResponse);
    }

  } catch (error) {
    console.error('💥 Unexpected error in getCourseDetails:', error);
    
    // Return comprehensive error response
    const errorResponse = {
      success: false,
      error: 'Internal server error while fetching course details',
      courseId: courseId || 'unknown',
      duration: Date.now() - startTime
    };

    // Add debug information if requested
    if (debugMode) {
      errorResponse.debugInfo = {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      };
    }

    return res.status(500).json(errorResponse);
  }
};

module.exports = exports;
