# Design Document

## Overview

The course details lookup system is failing because of a mismatch between the course ID format being requested (`cma-final-test5mP`) and the actual course storage structure in the database. The system currently stores courses within Faculty documents as embedded subdocuments, but the lookup logic has several issues:

1. **ID Format Mismatch**: The frontend is generating slugified course IDs (like `cma-final-test5mP`) but the backend is only looking for MongoDB ObjectIds or basic string matches
2. **Incomplete Search Logic**: The current search algorithm doesn't properly handle the complex course ID patterns being generated
3. **Missing Fallback Mechanisms**: When the primary lookup fails, there's no robust fallback to alternative search methods
4. **Data Structure Inconsistency**: Courses are stored in Faculty documents but the lookup doesn't properly traverse this nested structure

## Architecture

### Current System Flow
```
Frontend Request: /api/courses/details/cma-final-test5mP?courseType=CMA Final
    ↓
Course Detail Controller: getCourseDetails()
    ↓
Search Faculty.courses arrays for matching course
    ↓
Return 404 if no match found
```

### Proposed Enhanced Flow
```
Frontend Request: /api/courses/details/cma-final-test5mP?courseType=CMA Final
    ↓
Course Detail Controller: getCourseDetails()
    ↓
1. Try MongoDB ObjectId lookup (existing)
    ↓
2. Try enhanced slug-based matching (NEW)
    ↓
3. Try paper number extraction and matching (NEW)
    ↓
4. Try fuzzy text matching (NEW)
    ↓
5. Try standalone Course collection lookup (NEW)
    ↓
Return comprehensive error with debug info if all fail
```

## Components and Interfaces

### 1. Enhanced Course Lookup Service

**Location**: `server/src/services/courseLookupService.js`

**Purpose**: Centralized service for all course lookup operations with multiple fallback strategies

**Interface**:
```javascript
class CourseLookupService {
  async findCourseById(courseId, courseType = null)
  async findByObjectId(courseId)
  async findBySlugPattern(courseId, courseType)
  async findByPaperNumber(courseId, courseType)
  async findByFuzzyMatch(courseId, courseType)
  async findInStandaloneCollection(courseId)
}
```

### 2. Course ID Parser Utility

**Location**: `server/src/utils/courseIdParser.js`

**Purpose**: Parse and extract meaningful information from various course ID formats

**Interface**:
```javascript
class CourseIdParser {
  static parseSlugId(courseId)
  static extractPaperNumber(courseId)
  static extractCourseType(courseId)
  static generateSearchTerms(courseId)
}
```

### 3. Enhanced Course Detail Controller

**Location**: `server/src/controllers/courseDetail.controller.js` (existing, to be enhanced)

**Purpose**: Main controller that orchestrates the lookup process using the new service

**Interface**:
```javascript
exports.getCourseDetails = async (req, res) => {
  // Enhanced with comprehensive error handling and logging
}
```

### 4. Course Matching Algorithms

**Location**: `server/src/utils/courseMatchers.js`

**Purpose**: Various matching algorithms for different course ID patterns

**Interface**:
```javascript
class CourseMatchers {
  static matchByPaperNumber(course, paperNumber, courseType)
  static matchBySubjectSlug(course, slugParts)
  static matchByFacultyName(course, faculty, slugParts)
  static calculateMatchScore(course, searchCriteria)
}
```

## Data Models

### Course Lookup Request
```javascript
{
  courseId: "cma-final-test5mP",
  courseType: "CMA Final", // Optional query parameter
  searchStrategies: ["objectId", "slug", "paperNumber", "fuzzy"],
  debugMode: false
}
```

### Course Lookup Response
```javascript
{
  success: true,
  course: {
    // Full course object with faculty information
  },
  matchStrategy: "paperNumber", // Which strategy found the match
  searchAttempts: [
    { strategy: "objectId", success: false, reason: "Invalid ObjectId format" },
    { strategy: "slug", success: false, reason: "No slug match found" },
    { strategy: "paperNumber", success: true, matchedOn: "Paper 5" }
  ]
}
```

### Enhanced Error Response
```javascript
{
  success: false,
  error: "Course not found",
  courseId: "cma-final-test5mP",
  searchAttempts: [/* detailed search attempts */],
  suggestions: [
    { courseId: "64f8a1b2c3d4e5f6a7b8c9d0", title: "CMA Final Paper 5", matchScore: 0.85 }
  ],
  debugInfo: {
    totalFaculties: 15,
    totalCourses: 127,
    searchDuration: "45ms"
  }
}
```

## Error Handling

### 1. Graceful Degradation
- If primary lookup fails, try alternative methods
- Always return meaningful error messages
- Include suggestions for similar courses

### 2. Comprehensive Logging
```javascript
// Log structure for debugging
{
  timestamp: "2024-01-15T10:30:00Z",
  requestId: "req_123456",
  courseId: "cma-final-test5mP",
  courseType: "CMA Final",
  searchStrategy: "paperNumber",
  success: false,
  duration: "45ms",
  errorDetails: {
    strategy: "paperNumber",
    extractedPaperNumber: "5",
    coursesSearched: 127,
    facultiesSearched: 15,
    reason: "No course found with Paper 5 in CMA Final category"
  }
}
```

### 3. Error Recovery Strategies
- **Invalid ObjectId**: Fall back to slug-based search
- **No slug match**: Try paper number extraction
- **No paper match**: Try fuzzy text matching
- **All faculty searches fail**: Check standalone Course collection
- **Complete failure**: Return similar courses as suggestions

## Testing Strategy

### 1. Unit Tests
- Test each lookup strategy independently
- Test course ID parsing utilities
- Test matching algorithms with various input formats

### 2. Integration Tests
- Test complete lookup flow with real database data
- Test error handling and fallback mechanisms
- Test performance with large datasets

### 3. End-to-End Tests
- Test frontend to backend course detail requests
- Test various course ID formats from actual URLs
- Test error scenarios and user experience

### 4. Performance Tests
- Measure lookup performance with different strategies
- Test with large numbers of faculties and courses
- Optimize database queries and indexing

## Implementation Phases

### Phase 1: Core Service Implementation
- Create CourseLookupService with basic strategies
- Implement CourseIdParser utility
- Add comprehensive logging

### Phase 2: Enhanced Matching
- Implement advanced matching algorithms
- Add fuzzy search capabilities
- Create course suggestion system

### Phase 3: Controller Integration
- Update courseDetail.controller to use new service
- Add comprehensive error responses
- Implement debug mode for troubleshooting

### Phase 4: Testing and Optimization
- Add comprehensive test suite
- Performance optimization
- Database indexing improvements

## Database Considerations

### Current Structure Issues
- Courses stored as embedded documents in Faculty collection
- No direct indexing on course fields within Faculty documents
- Inconsistent course ID generation and storage

### Proposed Improvements
- Add compound indexes on Faculty.courses fields
- Consider denormalized course lookup table for performance
- Standardize course ID generation and storage format

### Index Recommendations
```javascript
// Faculty collection indexes
db.faculties.createIndex({ "courses.subject": "text", "courses.title": "text" })
db.faculties.createIndex({ "courses.paperNumber": 1, "courses.courseType": 1 })
db.faculties.createIndex({ "courses._id": 1 })

// Standalone Course collection indexes (if used)
db.courses.createIndex({ "subject": "text", "title": "text" })
db.courses.createIndex({ "paperNumber": 1, "courseType": 1 })
```