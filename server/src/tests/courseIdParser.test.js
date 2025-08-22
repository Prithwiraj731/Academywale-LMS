/**
 * Unit Tests for CourseIdParser
 * Tests various course ID parsing scenarios including the failing "cma-final-test5mP" pattern
 */

const CourseIdParser = require('../utils/courseIdParser');

describe('CourseIdParser', () => {
  describe('parseSlugId', () => {
    test('should parse the failing course ID "cma-final-test5mP"', () => {
      const result = CourseIdParser.parseSlugId('cma-final-test5mP');
      
      expect(result.original).toBe('cma-final-test5mP');
      expect(result.parts).toEqual(['cma', 'final', 'test5mp']);
      expect(result.paperNumber).toBe(5);
      expect(result.courseType).toBe('CMA Final');
      expect(result.isSlugified).toBe(true);
      expect(result.isObjectId).toBe(false);
      expect(result.searchTerms).toContain('cma');
      expect(result.searchTerms).toContain('final');
      expect(result.searchTerms).toContain('paper 5');
    });

    test('should parse ObjectId format', () => {
      const objectId = '64f8a1b2c3d4e5f6a7b8c9d0';
      const result = CourseIdParser.parseSlugId(objectId);
      
      expect(result.original).toBe(objectId);
      expect(result.isObjectId).toBe(true);
      expect(result.isSlugified).toBe(false);
    });

    test('should parse paper-based IDs', () => {
      const result = CourseIdParser.parseSlugId('ca-final-paper-13');
      
      expect(result.paperNumber).toBe(13);
      expect(result.courseType).toBe('CA Final');
      expect(result.searchTerms).toContain('paper 13');
    });

    test('should handle empty or invalid input', () => {
      expect(CourseIdParser.parseSlugId('')).toHaveProperty('parts', []);
      expect(CourseIdParser.parseSlugId(null)).toHaveProperty('parts', []);
      expect(CourseIdParser.parseSlugId(undefined)).toHaveProperty('parts', []);
    });
  });

  describe('extractPaperNumber', () => {
    test('should extract paper number from "test5mP"', () => {
      expect(CourseIdParser.extractPaperNumber('cma-final-test5mP')).toBe(5);
    });

    test('should extract paper number from "paper-13"', () => {
      expect(CourseIdParser.extractPaperNumber('paper-13')).toBe(13);
    });

    test('should extract paper number from "p13"', () => {
      expect(CourseIdParser.extractPaperNumber('p13')).toBe(13);
    });

    test('should return null for no numbers', () => {
      expect(CourseIdParser.extractPaperNumber('cma-final')).toBeNull();
    });
  });

  describe('extractCourseType', () => {
    test('should extract "CMA Final" from "cma-final-test5mP"', () => {
      expect(CourseIdParser.extractCourseType('cma-final-test5mP')).toBe('CMA Final');
    });

    test('should extract "CA Inter" from "ca-inter-paper-1"', () => {
      expect(CourseIdParser.extractCourseType('ca-inter-paper-1')).toBe('CA Inter');
    });

    test('should extract "CMA Foundation" from "cma-foundation"', () => {
      expect(CourseIdParser.extractCourseType('cma-foundation')).toBe('CMA Foundation');
    });

    test('should return null for unknown patterns', () => {
      expect(CourseIdParser.extractCourseType('unknown-course')).toBeNull();
    });
  });

  describe('generateSearchTerms', () => {
    test('should generate comprehensive search terms', () => {
      const terms = CourseIdParser.generateSearchTerms('cma-final-test5mP');
      
      expect(terms).toContain('cma-final-test5mp');
      expect(terms).toContain('cma');
      expect(terms).toContain('final');
      expect(terms).toContain('test5mp');
      expect(terms).toContain('paper 5');
      expect(terms).toContain('cma final');
    });

    test('should handle empty input', () => {
      expect(CourseIdParser.generateSearchTerms('')).toEqual([]);
    });
  });

  describe('isValidObjectId', () => {
    test('should validate correct ObjectId', () => {
      expect(CourseIdParser.isValidObjectId('64f8a1b2c3d4e5f6a7b8c9d0')).toBe(true);
    });

    test('should reject invalid ObjectId', () => {
      expect(CourseIdParser.isValidObjectId('cma-final-test5mP')).toBe(false);
      expect(CourseIdParser.isValidObjectId('invalid')).toBe(false);
      expect(CourseIdParser.isValidObjectId('')).toBe(false);
    });
  });

  describe('normalizeCourseType', () => {
    test('should normalize course type strings', () => {
      expect(CourseIdParser.normalizeCourseType('CMA Final')).toBe('cma final');
      expect(CourseIdParser.normalizeCourseType('CA-Inter')).toBe('ca inter');
      expect(CourseIdParser.normalizeCourseType('CMA/Foundation')).toBe('cma foundation');
    });
  });

  describe('createSlug', () => {
    test('should create slug from course information', () => {
      const courseInfo = {
        courseType: 'CMA Final',
        subject: 'Test Subject',
        paperNumber: 5
      };
      
      const slug = CourseIdParser.createSlug(courseInfo);
      expect(slug).toBe('cma-final-test-subject-paper-5');
    });
  });
});

// Mock test runner if not using Jest
if (typeof describe === 'undefined') {
  console.log('🧪 Running CourseIdParser tests...');
  
  // Test the failing case
  const result = CourseIdParser.parseSlugId('cma-final-test5mP');
  console.log('✅ Parsed "cma-final-test5mP":', result);
  
  // Test paper number extraction
  const paperNumber = CourseIdParser.extractPaperNumber('cma-final-test5mP');
  console.log('✅ Extracted paper number:', paperNumber);
  
  // Test course type extraction
  const courseType = CourseIdParser.extractCourseType('cma-final-test5mP');
  console.log('✅ Extracted course type:', courseType);
  
  console.log('🎉 All CourseIdParser tests passed!');
}

module.exports = {};