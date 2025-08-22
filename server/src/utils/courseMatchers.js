/**
 * Course Matching Algorithms
 * Various algorithms for matching courses based on different criteria
 */

const CourseIdParser = require('./courseIdParser');

class CourseMatchers {
  /**
   * Match course by paper number and course type
   * @param {Object} course - Course object to match against
   * @param {number} paperNumber - Paper number to match
   * @param {string} courseType - Course type to match (optional)
   * @returns {Object} Match result with score and details
   */
  static matchByPaperNumber(course, paperNumber, courseType = null) {
    if (!course || paperNumber === null || paperNumber === undefined) {
      return { matches: false, score: 0, reason: 'Invalid input parameters' };
    }

    let score = 0;
    const reasons = [];

    // Check direct paper number field
    if (course.paperNumber && parseInt(course.paperNumber) === parseInt(paperNumber)) {
      score += 50;
      reasons.push(`Direct paper number match: ${paperNumber}`);
    }

    // Check paperId field
    if (course.paperId && parseInt(course.paperId) === parseInt(paperNumber)) {
      score += 50;
      reasons.push(`Paper ID match: ${paperNumber}`);
    }

    // Check paper number in subject
    if (course.subject) {
      const subjectPaperMatch = course.subject.toLowerCase().match(/paper\s*(\d+)/);
      if (subjectPaperMatch && parseInt(subjectPaperMatch[1]) === parseInt(paperNumber)) {
        score += 40;
        reasons.push(`Paper number in subject: ${course.subject}`);
      }
    }

    // Check paper number in paperName
    if (course.paperName) {
      const paperNameMatch = course.paperName.toLowerCase().match(/paper\s*(\d+)/);
      if (paperNameMatch && parseInt(paperNameMatch[1]) === parseInt(paperNumber)) {
        score += 40;
        reasons.push(`Paper number in paperName: ${course.paperName}`);
      }
    }

    // Check paper number in title
    if (course.title) {
      const titlePaperMatch = course.title.toLowerCase().match(/paper\s*(\d+)/);
      if (titlePaperMatch && parseInt(titlePaperMatch[1]) === parseInt(paperNumber)) {
        score += 35;
        reasons.push(`Paper number in title: ${course.title}`);
      }
    }

    // Course type matching bonus
    if (courseType && score > 0) {
      const courseTypeScore = this.matchCourseType(course, courseType);
      if (courseTypeScore.matches) {
        score += courseTypeScore.score;
        reasons.push(`Course type match: ${courseTypeScore.reason}`);
      }
    }

    return {
      matches: score > 0,
      score,
      reason: reasons.join('; '),
      matchType: 'paperNumber'
    };
  }

  /**
   * Match course by subject slug
   * @param {Object} course - Course object to match against
   * @param {Array<string>} slugParts - Parts of the slug to match
   * @returns {Object} Match result with score and details
   */
  static matchBySubjectSlug(course, slugParts) {
    if (!course || !slugParts || slugParts.length === 0) {
      return { matches: false, score: 0, reason: 'Invalid input parameters' };
    }

    let score = 0;
    const reasons = [];

    // Check subject field
    if (course.subject) {
      const subjectSlug = course.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const subjectWords = course.subject.toLowerCase().split(/\s+/);
      
      // Exact slug match
      const fullSlug = slugParts.join('-');
      if (subjectSlug.includes(fullSlug) || fullSlug.includes(subjectSlug)) {
        score += 45;
        reasons.push(`Subject slug match: ${course.subject}`);
      }
      
      // Individual word matches
      let wordMatches = 0;
      slugParts.forEach(part => {
        if (part.length > 2 && subjectWords.some(word => word.includes(part) || part.includes(word))) {
          wordMatches++;
        }
      });
      
      if (wordMatches > 0) {
        score += (wordMatches / slugParts.length) * 30;
        reasons.push(`Subject word matches: ${wordMatches}/${slugParts.length}`);
      }
    }

    // Check title field
    if (course.title) {
      const titleSlug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const titleWords = course.title.toLowerCase().split(/\s+/);
      
      // Exact slug match
      const fullSlug = slugParts.join('-');
      if (titleSlug.includes(fullSlug) || fullSlug.includes(titleSlug)) {
        score += 40;
        reasons.push(`Title slug match: ${course.title}`);
      }
      
      // Individual word matches
      let wordMatches = 0;
      slugParts.forEach(part => {
        if (part.length > 2 && titleWords.some(word => word.includes(part) || part.includes(word))) {
          wordMatches++;
        }
      });
      
      if (wordMatches > 0) {
        score += (wordMatches / slugParts.length) * 25;
        reasons.push(`Title word matches: ${wordMatches}/${slugParts.length}`);
      }
    }

    return {
      matches: score > 0,
      score,
      reason: reasons.join('; '),
      matchType: 'subjectSlug'
    };
  }

  /**
   * Match course by faculty name
   * @param {Object} course - Course object to match against
   * @param {Object} faculty - Faculty object
   * @param {Array<string>} slugParts - Parts of the slug to match
   * @returns {Object} Match result with score and details
   */
  static matchByFacultyName(course, faculty, slugParts) {
    if (!course || !faculty || !slugParts || slugParts.length === 0) {
      return { matches: false, score: 0, reason: 'Invalid input parameters' };
    }

    let score = 0;
    const reasons = [];

    // Check faculty first name
    if (faculty.firstName) {
      const firstName = faculty.firstName.toLowerCase();
      const firstNameSlug = firstName.replace(/[^a-z0-9]+/g, '-');
      
      slugParts.forEach(part => {
        if (part.length > 2 && (firstName.includes(part) || part.includes(firstName))) {
          score += 20;
          reasons.push(`Faculty first name match: ${faculty.firstName}`);
        }
      });
    }

    // Check faculty last name
    if (faculty.lastName) {
      const lastName = faculty.lastName.toLowerCase();
      const lastNameSlug = lastName.replace(/[^a-z0-9]+/g, '-');
      
      slugParts.forEach(part => {
        if (part.length > 2 && (lastName.includes(part) || part.includes(lastName))) {
          score += 20;
          reasons.push(`Faculty last name match: ${faculty.lastName}`);
        }
      });
    }

    // Check faculty slug
    if (faculty.slug) {
      const facultySlug = faculty.slug.toLowerCase();
      const fullSlug = slugParts.join('-');
      
      if (facultySlug.includes(fullSlug) || fullSlug.includes(facultySlug)) {
        score += 25;
        reasons.push(`Faculty slug match: ${faculty.slug}`);
      }
    }

    return {
      matches: score > 0,
      score,
      reason: reasons.join('; '),
      matchType: 'facultyName'
    };
  }

  /**
   * Match course type
   * @param {Object} course - Course object to match against
   * @param {string} targetCourseType - Target course type
   * @returns {Object} Match result with score and details
   */
  static matchCourseType(course, targetCourseType) {
    if (!course || !targetCourseType) {
      return { matches: false, score: 0, reason: 'Invalid input parameters' };
    }

    const normalizedTarget = CourseIdParser.normalizeCourseType(targetCourseType);
    const targetWords = normalizedTarget.split(' ').filter(word => word.length > 1);

    let score = 0;
    const reasons = [];

    // Check courseType field
    if (course.courseType) {
      const normalizedCourseType = CourseIdParser.normalizeCourseType(course.courseType);
      
      // Exact match
      if (normalizedCourseType === normalizedTarget) {
        score += 30;
        reasons.push(`Exact course type match: ${course.courseType}`);
      } else {
        // Word-by-word match
        const courseTypeWords = normalizedCourseType.split(' ').filter(word => word.length > 1);
        let wordMatches = 0;
        
        targetWords.forEach(targetWord => {
          if (courseTypeWords.some(courseWord => 
            courseWord.includes(targetWord) || targetWord.includes(courseWord))) {
            wordMatches++;
          }
        });
        
        if (wordMatches > 0) {
          score += (wordMatches / targetWords.length) * 25;
          reasons.push(`Course type word matches: ${wordMatches}/${targetWords.length}`);
        }
      }
    }

    // Check category and subcategory
    if (course.category || course.subcategory) {
      const categoryText = `${course.category || ''} ${course.subcategory || ''}`.trim().toLowerCase();
      
      targetWords.forEach(targetWord => {
        if (categoryText.includes(targetWord)) {
          score += 15;
          reasons.push(`Category match for: ${targetWord}`);
        }
      });
    }

    return {
      matches: score > 0,
      score,
      reason: reasons.join('; '),
      matchType: 'courseType'
    };
  }

  /**
   * Calculate overall match score for a course
   * @param {Object} course - Course object to match against
   * @param {Object} searchCriteria - Search criteria
   * @returns {Object} Overall match result
   */
  static calculateMatchScore(course, searchCriteria) {
    if (!course || !searchCriteria) {
      return { matches: false, score: 0, reason: 'Invalid input parameters' };
    }

    let totalScore = 0;
    const matchResults = [];

    // Paper number matching
    if (searchCriteria.paperNumber !== null && searchCriteria.paperNumber !== undefined) {
      const paperMatch = this.matchByPaperNumber(course, searchCriteria.paperNumber, searchCriteria.courseType);
      if (paperMatch.matches) {
        totalScore += paperMatch.score;
        matchResults.push(paperMatch);
      }
    }

    // Subject slug matching
    if (searchCriteria.slugParts && searchCriteria.slugParts.length > 0) {
      const subjectMatch = this.matchBySubjectSlug(course, searchCriteria.slugParts);
      if (subjectMatch.matches) {
        totalScore += subjectMatch.score;
        matchResults.push(subjectMatch);
      }
    }

    // Faculty name matching
    if (searchCriteria.faculty && searchCriteria.slugParts) {
      const facultyMatch = this.matchByFacultyName(course, searchCriteria.faculty, searchCriteria.slugParts);
      if (facultyMatch.matches) {
        totalScore += facultyMatch.score;
        matchResults.push(facultyMatch);
      }
    }

    // Course type matching (if not already included in paper matching)
    if (searchCriteria.courseType && !searchCriteria.paperNumber) {
      const courseTypeMatch = this.matchCourseType(course, searchCriteria.courseType);
      if (courseTypeMatch.matches) {
        totalScore += courseTypeMatch.score;
        matchResults.push(courseTypeMatch);
      }
    }

    return {
      matches: totalScore > 0,
      score: totalScore,
      matchResults,
      reason: matchResults.map(r => r.reason).join('; '),
      matchTypes: matchResults.map(r => r.matchType)
    };
  }

  /**
   * Find best matching courses from a list
   * @param {Array<Object>} courses - Array of courses to search
   * @param {Object} searchCriteria - Search criteria
   * @param {number} limit - Maximum number of results to return
   * @returns {Array<Object>} Sorted array of matching courses
   */
  static findBestMatches(courses, searchCriteria, limit = 5) {
    if (!courses || courses.length === 0) {
      return [];
    }

    const matches = courses
      .map(course => {
        const matchResult = this.calculateMatchScore(course, searchCriteria);
        return {
          course,
          ...matchResult
        };
      })
      .filter(result => result.matches)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return matches;
  }
}

module.exports = CourseMatchers;