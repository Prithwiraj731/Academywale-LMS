const Faculty = require('../model/Faculty.model');

// Search for courses with query parameters
exports.searchCourses = async (req, res) => {
  try {
    const { query, category, limit = 10 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Search query must be at least 2 characters long' 
      });
    }
    
    console.log(`🔍 Searching for courses with query: "${query}", category: "${category || 'any'}"`);
    
    // Find all faculties (excluding N/A faculty)
    const faculties = await Faculty.find({ firstName: { $ne: 'N/A' } });
    
    // Collect all courses from all faculties
    const allCourses = [];
    faculties.forEach(faculty => {
      if (!faculty.courses || faculty.courses.length === 0) return;
      
      const coursesWithFacultyInfo = faculty.courses.map(course => ({
        ...course.toObject(),
        facultyName: `${faculty.firstName} ${faculty.lastName || ''}`.trim(),
        facultySlug: faculty.slug,
        facultyId: faculty._id
      }));
      
      allCourses.push(...coursesWithFacultyInfo);
    });
    
    console.log(`📚 Found ${allCourses.length} total courses to search through`);
    
    // Convert query to lowercase for case-insensitive comparison
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    console.log(`🔤 Search terms:`, searchTerms);
    
    // Filter courses based on search criteria
    const matchedCourses = allCourses.filter(course => {
      // Skip courses without basic info
      if (!course.subject && !course.title) return false;
      
      // Apply category filter if provided
      if (category && course.courseType && 
          !course.courseType.toLowerCase().includes(category.toLowerCase())) {
        return false;
      }
      
      // Match based on searchable fields
      const subjectMatch = course.subject && searchTerms.some(term => 
        course.subject.toLowerCase().includes(term));
      
      const titleMatch = course.title && searchTerms.some(term => 
        course.title.toLowerCase().includes(term));
      
      const paperMatch = course.paperName && searchTerms.some(term => 
        course.paperName.toLowerCase().includes(term));
      
      const paperNumberMatch = course.paperNumber && searchTerms.some(term => 
        term.includes(course.paperNumber.toString()));
        
      const courseTypeMatch = course.courseType && searchTerms.some(term => 
        course.courseType.toLowerCase().includes(term));
      
      // Consider a course matched if any searchable field contains the query
      return subjectMatch || titleMatch || paperMatch || paperNumberMatch || courseTypeMatch;
    });
    
    console.log(`🎯 Found ${matchedCourses.length} matching courses`);
    
    // Sort by relevance and limit the results
    const sortedCourses = matchedCourses
      .sort((a, b) => {
        // Give priority to courses with exact matches in subject or title
        const aExactMatch = a.subject?.toLowerCase().includes(query.toLowerCase()) || 
                            a.title?.toLowerCase().includes(query.toLowerCase());
        
        const bExactMatch = b.subject?.toLowerCase().includes(query.toLowerCase()) || 
                            b.title?.toLowerCase().includes(query.toLowerCase());
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // If both have exact matches or neither has, sort by recency (assuming _id has timestamp)
        return b._id > a._id ? 1 : -1;
      })
      .slice(0, parseInt(limit));
    
    res.status(200).json({ 
      courses: sortedCourses,
      total: matchedCourses.length,
      query,
      category: category || 'any'
    });
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
