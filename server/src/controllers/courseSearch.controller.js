const { supabaseAdmin } = require('../config/supabase.config');
const { mapCoursesToFrontend } = require('../utils/courseMapper');

// @desc    Search for courses
// @route   GET /api/courses/search
// @access  Public
exports.searchCourses = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  try {
    const { query, category, limit = 10 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({ 
        error: 'Search query must be at least 2 characters long',
        success: false
      });
    }
    
    console.log(`🔍 Searching for courses in Supabase with query: "${query}", category: "${category || 'any'}"`);
    
    // Split the query into terms for matching
    const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
    
    let dbQuery = supabaseAdmin
      .from('courses')
      .select('*')
      .eq('is_active', true);
      
    // Apply category filter if specified
    if (category) {
      dbQuery = dbQuery.eq('category', category.toUpperCase().trim());
    }
    
    // Build OR filters for matching terms
    // We match against title, subject, description, paper_name, course_type
    const filterConditions = [];
    searchTerms.forEach(term => {
      filterConditions.push(
        `title.ilike.%${term}%`,
        `subject.ilike.%${term}%`,
        `description.ilike.%${term}%`,
        `paper_name.ilike.%${term}%`,
        `course_type.ilike.%${term}%`
      );
    });
    
    // Also support exact match for paper number (e.g., if user searches "paper 1")
    const paperNumberRegex = /\bpaper\s+(\d+)\b/i;
    const paperNumberMatch = query.match(paperNumberRegex);
    if (paperNumberMatch) {
      filterConditions.push(`paper_id.eq.${paperNumberMatch[1]}`);
    } else {
      // Check if query is just a number
      const numberOnlyMatch = /^(\d+)$/.exec(query.trim());
      if (numberOnlyMatch) {
        filterConditions.push(`paper_id.eq.${numberOnlyMatch[1]}`);
      }
    }
    
    if (filterConditions.length > 0) {
      dbQuery = dbQuery.or(filterConditions.join(','));
    }
    
    const { data: matchedCourses, error } = await dbQuery
      .limit(parseInt(limit));
      
    if (error) throw error;
    
    // Map response keys for frontend compatibility (snake_case -> camelCase)
    const mapped = mapCoursesToFrontend(matchedCourses);
    
    // Sort results to prioritize exact subject/title matches
    const sorted = mapped.sort((a, b) => {
      const aExact = (a.subject && a.subject.toLowerCase().includes(query.toLowerCase())) || 
                     (a.title && a.title.toLowerCase().includes(query.toLowerCase()));
      const bExact = (b.subject && b.subject.toLowerCase().includes(query.toLowerCase())) || 
                     (b.title && b.title.toLowerCase().includes(query.toLowerCase()));
                     
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
    
    return res.status(200).json({ 
      courses: sorted,
      total: sorted.length,
      query,
      category: category || 'any',
      success: true
    });
    
  } catch (error) {
    console.error('Error searching courses in Supabase:', error);
    return res.status(404).json({ 
      error: error.message || 'Error occurred during search',
      success: false,
      query: query || '',
      courses: []
    });
  }
};

module.exports = exports;
