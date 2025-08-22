/**
 * Centralized Course Lookup Service
 * Handles all course lookup operations with multiple fallback strategies
 */

const Faculty = require('../model/Faculty.model');
const Course = require('../model/Course.model');
const mongoose = require('mongoose');
const CourseIdParser = require('../utils/courseIdParser');
const CourseMatchers = require('../utils/courseMatchers');
const logger = require('../utils/logger');

class CourseLookupService {
  constructor() {
    this.searchStrategies = [
      'objectId',
      'slug',
      'paperNumber',
      'fuzzy',
      'standalone'
    ];
  }

  /**
   * Find course by ID using multiple strategies
   * @param {string} courseId - Course ID to search for
   * @param {string} courseType - Optional course type filter
   * @param {boolean} debugMode - Enable debug information
   * @returns {Object} Search result with course data or error information
   */
  async findCourseById(courseId, courseType = null, debugMode = false) {
    const startTime = Date.now();
    const searchAttempts = [];
    
    logger.info(`Starting course lookup for ID: ${courseId}, Type: ${courseType || 'none'}`);

    try {
      // Parse the course ID to extract useful information
      const parsedId = CourseIdParser.parseSlugId(courseId);
      logger.logIdParsing(courseId, parsedId);

      // Strategy 1: MongoDB ObjectId lookup
      if (parsedId.isObjectId) {
        logger.logLookupAttempt(courseId, 'objectId');
        const objectIdResult = await this.findByObjectId(courseId);
        searchAttempts.push({
          strategy: 'objectId',
          success: objectIdResult.success,
          reason: objectIdResult.reason,
          duration: objectIdResult.duration
        });

        if (objectIdResult.success) {
          logger.logLookupSuccess(courseId, 'objectId', objectIdResult.course, objectIdResult.duration);
          return this.formatSuccessResponse(objectIdResult.course, 'objectId', searchAttempts, startTime, debugMode);
        } else {
          logger.logLookupFailure(courseId, 'objectId', objectIdResult.reason, objectIdResult.duration);
        }
      }

      // Strategy 2: Enhanced slug-based matching
      console.log(`🎯 Attempting slug-based lookup...`);
      const slugResult = await this.findBySlugPattern(courseId, courseType, parsedId);
      searchAttempts.push({
        strategy: 'slug',
        success: slugResult.success,
        reason: slugResult.reason,
        duration: slugResult.duration
      });

      if (slugResult.success) {
        console.log(`✅ Found course via slug-based lookup`);
        return this.formatSuccessResponse(slugResult.course, 'slug', searchAttempts, startTime, debugMode);
      }

      // Strategy 3: Paper number extraction and matching
      if (parsedId.paperNumber) {
        console.log(`🎯 Attempting paper number lookup for paper ${parsedId.paperNumber}...`);
        const paperResult = await this.findByPaperNumber(parsedId.paperNumber, courseType);
        searchAttempts.push({
          strategy: 'paperNumber',
          success: paperResult.success,
          reason: paperResult.reason,
          duration: paperResult.duration
        });

        if (paperResult.success) {
          console.log(`✅ Found course via paper number lookup`);
          return this.formatSuccessResponse(paperResult.course, 'paperNumber', searchAttempts, startTime, debugMode);
        }
      }

      // Strategy 4: Fuzzy text matching
      console.log(`🎯 Attempting fuzzy matching...`);
      const fuzzyResult = await this.findByFuzzyMatch(courseId, courseType, parsedId);
      searchAttempts.push({
        strategy: 'fuzzy',
        success: fuzzyResult.success,
        reason: fuzzyResult.reason,
        duration: fuzzyResult.duration
      });

      if (fuzzyResult.success) {
        console.log(`✅ Found course via fuzzy matching`);
        return this.formatSuccessResponse(fuzzyResult.course, 'fuzzy', searchAttempts, startTime, debugMode);
      }

      // Strategy 5: Standalone Course collection lookup
      console.log(`🎯 Attempting standalone collection lookup...`);
      const standaloneResult = await this.findInStandaloneCollection(courseId);
      searchAttempts.push({
        strategy: 'standalone',
        success: standaloneResult.success,
        reason: standaloneResult.reason,
        duration: standaloneResult.duration
      });

      if (standaloneResult.success) {
        console.log(`✅ Found course via standalone collection lookup`);
        return this.formatSuccessResponse(standaloneResult.course, 'standalone', searchAttempts, startTime, debugMode);
      }

      // All strategies failed - return comprehensive error with suggestions
      logger.logLookupSummary(courseId, false, searchAttempts, Date.now() - startTime);
      return this.formatErrorResponse(courseId, searchAttempts, startTime, debugMode);

    } catch (error) {
      logger.logError(error, { courseId, courseType, debugMode });
      return {
        success: false,
        error: 'Internal server error during course lookup',
        courseId,
        searchAttempts,
        duration: Date.now() - startTime,
        debugInfo: debugMode ? { error: error.message, stack: error.stack } : undefined
      };
    }
  }

  /**
   * Find course by MongoDB ObjectId
   * @param {string} courseId - ObjectId string
   * @returns {Object} Search result
   */
  async findByObjectId(courseId) {
    const startTime = Date.now();
    
    try {
      if (!CourseIdParser.isValidObjectId(courseId)) {
        return {
          success: false,
          reason: 'Invalid ObjectId format',
          duration: Date.now() - startTime
        };
      }

      // Search in Faculty courses
      const faculties = await Faculty.find({ 'courses._id': new mongoose.Types.ObjectId(courseId) });
      
      for (const faculty of faculties) {
        const course = faculty.courses.find(c => c._id && c._id.toString() === courseId);
        if (course) {
          return {
            success: true,
            course: this.enrichCourseWithFacultyInfo(course, faculty),
            reason: 'Found by ObjectId in Faculty collection',
            duration: Date.now() - startTime
          };
        }
      }

      return {
        success: false,
        reason: 'ObjectId not found in any Faculty courses',
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        reason: `ObjectId lookup error: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Find course by slug pattern
   * @param {string} courseId - Course ID
   * @param {string} courseType - Course type filter
   * @param {Object} parsedId - Parsed course ID information
   * @returns {Object} Search result
   */
  async findBySlugPattern(courseId, courseType, parsedId) {
    const startTime = Date.now();
    
    try {
      // Get all faculties (excluding N/A faculty)
      const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
      
      let bestMatch = null;
      let bestScore = 0;
      let bestFaculty = null;

      for (const faculty of faculties) {
        if (!faculty.courses || faculty.courses.length === 0) continue;

        for (const course of faculty.courses) {
          const searchCriteria = {
            slugParts: parsedId.parts,
            courseType: courseType,
            faculty: faculty
          };

          const matchResult = CourseMatchers.calculateMatchScore(course, searchCriteria);
          
          if (matchResult.matches && matchResult.score > bestScore) {
            bestMatch = course;
            bestScore = matchResult.score;
            bestFaculty = faculty;
          }
        }
      }

      if (bestMatch && bestScore > 20) { // Minimum threshold for slug matching
        return {
          success: true,
          course: this.enrichCourseWithFacultyInfo(bestMatch, bestFaculty),
          reason: `Found by slug pattern matching (score: ${bestScore})`,
          duration: Date.now() - startTime
        };
      }

      return {
        success: false,
        reason: `No courses found matching slug pattern (best score: ${bestScore})`,
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        reason: `Slug pattern lookup error: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Find course by paper number
   * @param {number} paperNumber - Paper number to search for
   * @param {string} courseType - Course type filter
   * @returns {Object} Search result
   */
  async findByPaperNumber(paperNumber, courseType) {
    const startTime = Date.now();
    
    try {
      // Get all faculties (excluding N/A faculty)
      const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
      
      let bestMatch = null;
      let bestScore = 0;
      let bestFaculty = null;

      for (const faculty of faculties) {
        if (!faculty.courses || faculty.courses.length === 0) continue;

        for (const course of faculty.courses) {
          const matchResult = CourseMatchers.matchByPaperNumber(course, paperNumber, courseType);
          
          if (matchResult.matches && matchResult.score > bestScore) {
            bestMatch = course;
            bestScore = matchResult.score;
            bestFaculty = faculty;
          }
        }
      }

      if (bestMatch && bestScore > 30) { // Minimum threshold for paper number matching
        return {
          success: true,
          course: this.enrichCourseWithFacultyInfo(bestMatch, bestFaculty),
          reason: `Found by paper number ${paperNumber} (score: ${bestScore})`,
          duration: Date.now() - startTime
        };
      }

      return {
        success: false,
        reason: `No courses found for paper number ${paperNumber} (best score: ${bestScore})`,
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        reason: `Paper number lookup error: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Find course by fuzzy matching
   * @param {string} courseId - Course ID
   * @param {string} courseType - Course type filter
   * @param {Object} parsedId - Parsed course ID information
   * @returns {Object} Search result
   */
  async findByFuzzyMatch(courseId, courseType, parsedId) {
    const startTime = Date.now();
    
    try {
      // Get all faculties (excluding N/A faculty)
      const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
      
      const allCourses = [];
      
      // Collect all courses with their faculty information
      for (const faculty of faculties) {
        if (!faculty.courses || faculty.courses.length === 0) continue;
        
        faculty.courses.forEach(course => {
          allCourses.push({
            course,
            faculty
          });
        });
      }

      // Use search terms for fuzzy matching
      const searchCriteria = {
        slugParts: parsedId.searchTerms,
        courseType: courseType,
        paperNumber: parsedId.paperNumber
      };

      const matches = [];
      
      for (const { course, faculty } of allCourses) {
        const matchResult = CourseMatchers.calculateMatchScore(course, {
          ...searchCriteria,
          faculty
        });
        
        if (matchResult.matches) {
          matches.push({
            course,
            faculty,
            score: matchResult.score,
            reason: matchResult.reason
          });
        }
      }

      // Sort by score and get the best match
      matches.sort((a, b) => b.score - a.score);
      
      if (matches.length > 0 && matches[0].score > 15) { // Minimum threshold for fuzzy matching
        const bestMatch = matches[0];
        return {
          success: true,
          course: this.enrichCourseWithFacultyInfo(bestMatch.course, bestMatch.faculty),
          reason: `Found by fuzzy matching (score: ${bestMatch.score})`,
          duration: Date.now() - startTime
        };
      }

      return {
        success: false,
        reason: `No courses found by fuzzy matching (${matches.length} candidates, best score: ${matches[0]?.score || 0})`,
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        reason: `Fuzzy matching error: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Find course in standalone Course collection
   * @param {string} courseId - Course ID
   * @returns {Object} Search result
   */
  async findInStandaloneCollection(courseId) {
    const startTime = Date.now();
    
    try {
      let course = null;

      // Try ObjectId lookup first
      if (CourseIdParser.isValidObjectId(courseId)) {
        course = await Course.findById(courseId);
        if (course) {
          return {
            success: true,
            course: course.toObject(),
            reason: 'Found by ObjectId in standalone Course collection',
            duration: Date.now() - startTime
          };
        }
      }

      // Try text search
      const parsedId = CourseIdParser.parseSlugId(courseId);
      
      if (parsedId.searchTerms.length > 0) {
        const searchQuery = {
          $or: [
            { title: { $regex: parsedId.searchTerms.join('|'), $options: 'i' } },
            { subject: { $regex: parsedId.searchTerms.join('|'), $options: 'i' } },
            { description: { $regex: parsedId.searchTerms.join('|'), $options: 'i' } }
          ]
        };

        course = await Course.findOne(searchQuery);
        
        if (course) {
          return {
            success: true,
            course: course.toObject(),
            reason: 'Found by text search in standalone Course collection',
            duration: Date.now() - startTime
          };
        }
      }

      return {
        success: false,
        reason: 'Not found in standalone Course collection',
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        reason: `Standalone collection lookup error: ${error.message}`,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Enrich course object with faculty information
   * @param {Object} course - Course object
   * @param {Object} faculty - Faculty object
   * @returns {Object} Enriched course object
   */
  enrichCourseWithFacultyInfo(course, faculty) {
    const enrichedCourse = course.toObject ? course.toObject() : { ...course };
    
    if (faculty) {
      enrichedCourse.facultyName = `${faculty.firstName} ${faculty.lastName || ''}`.trim();
      enrichedCourse.facultySlug = faculty.slug;
      enrichedCourse.facultyId = faculty._id;
      enrichedCourse.facultyBio = faculty.bio;
      enrichedCourse.facultyImageUrl = faculty.imageUrl;
    }
    
    return enrichedCourse;
  }

  /**
   * Format successful response
   * @param {Object} course - Found course
   * @param {string} strategy - Successful strategy
   * @param {Array} searchAttempts - All search attempts
   * @param {number} startTime - Start time
   * @param {boolean} debugMode - Debug mode flag
   * @returns {Object} Formatted response
   */
  formatSuccessResponse(course, strategy, searchAttempts, startTime, debugMode) {
    const response = {
      success: true,
      course,
      matchStrategy: strategy,
      duration: Date.now() - startTime
    };

    if (debugMode) {
      response.searchAttempts = searchAttempts;
      response.debugInfo = {
        totalStrategies: this.searchStrategies.length,
        strategiesAttempted: searchAttempts.length,
        successfulStrategy: strategy
      };
    }

    return response;
  }

  /**
   * Format error response with suggestions
   * @param {string} courseId - Original course ID
   * @param {Array} searchAttempts - All search attempts
   * @param {number} startTime - Start time
   * @param {boolean} debugMode - Debug mode flag
   * @returns {Object} Formatted error response
   */
  async formatErrorResponse(courseId, searchAttempts, startTime, debugMode) {
    const response = {
      success: false,
      error: 'Course not found',
      courseId,
      duration: Date.now() - startTime
    };

    if (debugMode) {
      response.searchAttempts = searchAttempts;
      
      // Get database statistics
      try {
        const facultyCount = await Faculty.countDocuments({ firstName: { $ne: 'N/A' } });
        const totalCourses = await Faculty.aggregate([
          { $match: { firstName: { $ne: 'N/A' } } },
          { $project: { courseCount: { $size: '$courses' } } },
          { $group: { _id: null, total: { $sum: '$courseCount' } } }
        ]);

        response.debugInfo = {
          totalFaculties: facultyCount,
          totalCourses: totalCourses[0]?.total || 0,
          strategiesAttempted: searchAttempts.length,
          totalStrategies: this.searchStrategies.length
        };
      } catch (error) {
        response.debugInfo = {
          error: 'Could not retrieve database statistics'
        };
      }
    }

    // Try to find similar courses as suggestions
    try {
      const suggestions = await this.findSimilarCourses(courseId, 3);
      if (suggestions.length > 0) {
        response.suggestions = suggestions;
      }
    } catch (error) {
      console.error('Error finding course suggestions:', error);
    }

    return response;
  }

  /**
   * Find similar courses for suggestions
   * @param {string} courseId - Original course ID
   * @param {number} limit - Maximum suggestions to return
   * @returns {Array} Array of similar courses
   */
  async findSimilarCourses(courseId, limit = 3) {
    try {
      const parsedId = CourseIdParser.parseSlugId(courseId);
      const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } }).limit(10); // Limit for performance
      
      const suggestions = [];
      
      for (const faculty of faculties) {
        if (!faculty.courses || faculty.courses.length === 0) continue;
        
        for (const course of faculty.courses.slice(0, 5)) { // Limit courses per faculty
          if (parsedId.searchTerms.length > 0) {
            const courseText = `${course.subject || ''} ${course.title || ''} ${course.courseType || ''}`.toLowerCase();
            
            // Simple similarity check
            const matchingTerms = parsedId.searchTerms.filter(term => 
              courseText.includes(term.toLowerCase())
            );
            
            if (matchingTerms.length > 0) {
              suggestions.push({
                courseId: course._id,
                title: course.subject || course.title,
                courseType: course.courseType,
                facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
                matchScore: matchingTerms.length / parsedId.searchTerms.length
              });
            }
          }
        }
      }
      
      // Sort by match score and return top suggestions
      return suggestions
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error in findSimilarCourses:', error);
      return [];
    }
  }
}

module.exports = CourseLookupService;