/**
 * Course ID Parser Utility
 * Handles parsing of various course ID formats and extracts meaningful search terms
 */

class CourseIdParser {
  /**
   * Parse a slugified course ID and extract meaningful components
   * @param {string} courseId - The course ID to parse (e.g., "cma-final-test5mP")
   * @returns {Object} Parsed components
   */
  static parseSlugId(courseId) {
    if (!courseId || typeof courseId !== 'string') {
      return {
        original: courseId,
        parts: [],
        paperNumber: null,
        courseType: null,
        searchTerms: []
      };
    }

    // Split by hyphens and filter out empty parts
    const parts = courseId.toLowerCase().split('-').filter(part => part.length > 0);
    
    // Extract paper number from various patterns
    const paperNumber = this.extractPaperNumber(courseId);
    
    // Extract course type from the ID
    const courseType = this.extractCourseType(courseId);
    
    // Generate search terms
    const searchTerms = this.generateSearchTerms(courseId);

    return {
      original: courseId,
      parts,
      paperNumber,
      courseType,
      searchTerms,
      isSlugified: courseId.includes('-'),
      isObjectId: this.isValidObjectId(courseId)
    };
  }

  /**
   * Extract paper number from course ID
   * @param {string} courseId - The course ID
   * @returns {number|null} Paper number if found
   */
  static extractPaperNumber(courseId) {
    if (!courseId) return null;

    // Pattern 1: "paper-13" or "paper13"
    const paperMatch1 = courseId.match(/paper[-_]?(\d+)/i);
    if (paperMatch1) {
      return parseInt(paperMatch1[1]);
    }

    // Pattern 2: "test5mP" - number after "test"
    const testMatch = courseId.match(/test(\d+)/i);
    if (testMatch) {
      return parseInt(testMatch[1]);
    }

    // Pattern 3: "p13" or "p-13"
    const pMatch = courseId.match(/p[-_]?(\d+)/i);
    if (pMatch) {
      return parseInt(pMatch[1]);
    }

    // Pattern 4: Any standalone number in the ID
    const numberMatch = courseId.match(/(\d+)/);
    if (numberMatch) {
      return parseInt(numberMatch[1]);
    }

    return null;
  }

  /**
   * Extract course type from course ID
   * @param {string} courseId - The course ID
   * @returns {string|null} Course type if found
   */
  static extractCourseType(courseId) {
    if (!courseId) return null;

    const id = courseId.toLowerCase();
    
    // Common course type patterns
    const patterns = [
      { pattern: /cma[-_]?final/i, type: 'CMA Final' },
      { pattern: /cma[-_]?inter/i, type: 'CMA Inter' },
      { pattern: /cma[-_]?foundation/i, type: 'CMA Foundation' },
      { pattern: /ca[-_]?final/i, type: 'CA Final' },
      { pattern: /ca[-_]?inter/i, type: 'CA Inter' },
      { pattern: /ca[-_]?foundation/i, type: 'CA Foundation' },
      { pattern: /cma/i, type: 'CMA' },
      { pattern: /ca/i, type: 'CA' }
    ];

    for (const { pattern, type } of patterns) {
      if (pattern.test(id)) {
        return type;
      }
    }

    return null;
  }

  /**
   * Generate search terms from course ID
   * @param {string} courseId - The course ID
   * @returns {Array<string>} Array of search terms
   */
  static generateSearchTerms(courseId) {
    if (!courseId) return [];

    const terms = new Set();
    
    // Add original ID
    terms.add(courseId.toLowerCase());
    
    // Add parts split by various delimiters
    const parts = courseId.toLowerCase().split(/[-_\s]+/).filter(part => part.length > 1);
    parts.forEach(part => terms.add(part));
    
    // Add combinations of parts
    if (parts.length > 1) {
      for (let i = 0; i < parts.length - 1; i++) {
        terms.add(`${parts[i]} ${parts[i + 1]}`);
      }
    }
    
    // Add paper-specific terms
    const paperNumber = this.extractPaperNumber(courseId);
    if (paperNumber) {
      terms.add(`paper ${paperNumber}`);
      terms.add(`paper${paperNumber}`);
      terms.add(`p${paperNumber}`);
    }
    
    // Add course type terms
    const courseType = this.extractCourseType(courseId);
    if (courseType) {
      terms.add(courseType.toLowerCase());
      const typeWords = courseType.toLowerCase().split(' ');
      typeWords.forEach(word => terms.add(word));
    }

    return Array.from(terms).filter(term => term.length > 1);
  }

  /**
   * Check if a string is a valid MongoDB ObjectId
   * @param {string} id - The ID to check
   * @returns {boolean} True if valid ObjectId
   */
  static isValidObjectId(id) {
    if (!id || typeof id !== 'string') return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  }

  /**
   * Normalize course type string for comparison
   * @param {string} courseType - The course type to normalize
   * @returns {string} Normalized course type
   */
  static normalizeCourseType(courseType) {
    if (!courseType) return '';
    
    return courseType
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Create a slug from course information
   * @param {Object} courseInfo - Course information
   * @returns {string} Generated slug
   */
  static createSlug(courseInfo) {
    const parts = [];
    
    if (courseInfo.courseType) {
      parts.push(courseInfo.courseType.toLowerCase().replace(/\s+/g, '-'));
    }
    
    if (courseInfo.subject) {
      parts.push(courseInfo.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    }
    
    if (courseInfo.paperNumber) {
      parts.push(`paper-${courseInfo.paperNumber}`);
    }
    
    return parts.join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
}

module.exports = CourseIdParser;