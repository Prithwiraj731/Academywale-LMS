/**
 * Simplified Course Lookup Service
 * Handles course lookup operations with basic strategies
 */

const Faculty = require('../model/Faculty.model');
const Course = require('../model/Course.model');
const mongoose = require('mongoose');

class CourseLookupService {
  constructor() {
    this.searchStrategies = [
      'objectId',
      'slug',
      'paperNumber'
    ];
  }

  /**
   * Find course by ID using multiple strategies
   */
  async findCourseById(courseId, courseType = null) {
    const startTime = Date.now();
    
    try {
      // Strategy 1: MongoDB ObjectId lookup
      if (this.isValidObjectId(courseId)) {
        const objectIdResult = await this.findByObjectId(courseId);
        if (objectIdResult.success) {
          return this.formatSuccessResponse(objectIdResult.course, 'objectId', startTime);
        }
      }

      // Strategy 2: Paper number extraction and matching
      const paperNumber = this.extractPaperNumber(courseId);
      if (paperNumber) {
        const paperResult = await this.findByPaperNumber(paperNumber, courseType);
        if (paperResult.success) {
          return this.formatSuccessResponse(paperResult.course, 'paperNumber', startTime);
        }
      }

      // Strategy 3: Basic slug matching
      const slugResult = await this.findBySlugPattern(courseId, courseType);
      if (slugResult.success) {
        return this.formatSuccessResponse(slugResult.course, 'slug', startTime);
      }

      // All strategies failed
      return this.formatErrorResponse(courseId, startTime);

    } catch (error) {
      return {
        success: false,
        error: 'Internal server error during course lookup',
        courseId,
        duration: Date.now() - startTime
      };
    }
  }

  isValidObjectId(id) {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  extractPaperNumber(courseId) {
    if (!courseId) return null;
    const testMatch = courseId.match(/test(\d+)/i);
    if (testMatch) return parseInt(testMatch[1]);
    const paperMatch = courseId.match(/paper[-_]?(\d+)/i);
    if (paperMatch) return parseInt(paperMatch[1]);
    const numberMatch = courseId.match(/(\d+)/);
    if (numberMatch) return parseInt(numberMatch[1]);
    return null;
  }

  async findByObjectId(courseId) {
    try {
      const faculties = await Faculty.find({ 'courses._id': new mongoose.Types.ObjectId(courseId) });
      for (const faculty of faculties) {
        const course = faculty.courses.find(c => c._id && c._id.toString() === courseId);
        if (course) {
          return {
            success: true,
            course: this.enrichCourseWithFacultyInfo(course, faculty)
          };
        }
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async findByPaperNumber(paperNumber, courseType) {
    try {
      const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
      for (const faculty of faculties) {
        if (!faculty.courses) continue;
        for (const course of faculty.courses) {
          if (course.paperNumber && parseInt(course.paperNumber) === parseInt(paperNumber)) {
            if (!courseType || this.matchesCourseType(course, courseType)) {
              return {
                success: true,
                course: this.enrichCourseWithFacultyInfo(course, faculty)
              };
            }
          }
        }
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  async findBySlugPattern(courseId, courseType) {
    try {
      const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
      const searchTerm = courseId.toLowerCase().replace(/-/g, ' ');
      for (const faculty of faculties) {
        if (!faculty.courses) continue;
        for (const course of faculty.courses) {
          if (course.subject && course.subject.toLowerCase().includes(searchTerm)) {
            if (!courseType || this.matchesCourseType(course, courseType)) {
              return {
                success: true,
                course: this.enrichCourseWithFacultyInfo(course, faculty)
              };
            }
          }
        }
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  }

  matchesCourseType(course, courseType) {
    if (!course.courseType || !courseType) return true;
    return course.courseType.toLowerCase().includes(courseType.toLowerCase());
  }

  enrichCourseWithFacultyInfo(course, faculty) {
    return {
      ...course.toObject(),
      facultyInfo: {
        name: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
        slug: faculty.slug,
        image: faculty.imageUrl || faculty.image
      }
    };
  }

  formatSuccessResponse(course, strategy, startTime) {
    return {
      success: true,
      course,
      strategy,
      duration: Date.now() - startTime
    };
  }

  formatErrorResponse(courseId, startTime) {
    return {
      success: false,
      courseId,
      error: 'Course not found',
      message: `No course found with ID: ${courseId}`,
      duration: Date.now() - startTime
    };
  }
}

module.exports = CourseLookupService;