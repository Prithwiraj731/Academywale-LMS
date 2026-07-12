const { supabaseAdmin } = require('../config/supabase.config');
const { mapCourseToFrontend } = require('../utils/courseMapper');

// Get course details by ID/slug/mongo_id
exports.getCourseDetails = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  const startTime = Date.now();
  const { courseId } = req.params;
  const courseType = req.query.courseType || null;
  const debugMode = req.query.debug === 'true';
  
  console.log(`🌐 Course details request: ID=${courseId}, Type=${courseType || 'none'}, Debug=${debugMode}`);
  
  if (!courseId) {
    return res.status(400).json({
      success: false,
      error: 'Course ID is required',
      duration: Date.now() - startTime
    });
  }

  try {
    // 1. Check if courseId is a valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(courseId);
    if (isUuid) {
      const { data: course, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle();

      if (error) throw error;
      if (course) {
        console.log('✅ Found course by UUID:', course.id);
        return res.status(200).json({ course: mapCourseToFrontend(course), success: true });
      }
    }

    // 2. Check if courseId is a MongoDB ObjectId
    const isMongoId = /^[0-9a-f]{24}$/i.test(courseId);
    if (isMongoId || courseId.includes('_')) {
      const { data: course, error } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('mongo_id', courseId)
        .maybeSingle();

      if (error) throw error;
      if (course) {
        console.log('✅ Found course by mongo_id:', course.mongo_id);
        return res.status(200).json({ course: mapCourseToFrontend(course), success: true });
      }
    }

    // 3. Fallback: Slug matching / flexible matching
    console.log('🔄 Attempting fallback slug matching for:', courseId);

    // Optimized Step 3a: Check paper number matching directly via Supabase query
    const paperMatch = /paper-?(\d+)/i.exec(courseId);
    const testMatch = /test(\d+)/i.exec(courseId);
    const numberMatch = /(\d+)/.exec(courseId);
    const paperNumber = paperMatch ? paperMatch[1] : (testMatch ? testMatch[1] : (numberMatch ? numberMatch[1] : null));

    if (paperNumber) {
      let paperQuery = supabaseAdmin
        .from('courses')
        .select('*')
        .eq('paper_id', paperNumber)
        .eq('is_active', true);

      if (courseType) {
        const typeWords = courseType.replace('/', ' ').toLowerCase().split(' ');
        typeWords.forEach(word => {
          paperQuery = paperQuery.ilike('course_type', `%${word}%`);
        });
      }

      const { data: paperCourses, error: paperErr } = await paperQuery;
      if (!paperErr && paperCourses && paperCourses.length > 0) {
        console.log('✅ Found course directly via optimized paper query:', paperCourses[0].subject);
        return res.status(200).json({ course: mapCourseToFrontend(paperCourses[0]), success: true });
      }
    }

    // Optimized Step 3b: Query Supabase directly by slug title/subject match
    const cleanTerm = courseId.replace(/-/g, ' ');
    if (cleanTerm && cleanTerm.length > 2) {
      const { data: directSlugMatch, error: directSlugErr } = await supabaseAdmin
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .or(`subject.ilike.%${cleanTerm}%,title.ilike.%${cleanTerm}%`)
        .limit(5);

      if (!directSlugErr && directSlugMatch && directSlugMatch.length > 0) {
        // Fine-tune match in-memory from the small matching set
        const matchedCourse = directSlugMatch.find(course => {
          const subjectSlug = course.subject ? course.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          const titleSlug = course.title ? course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          const courseTypeSlug = course.course_type ? course.course_type.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
          
          return courseId === subjectSlug || 
                 courseId === titleSlug || 
                 courseId === courseTypeSlug ||
                 courseId === `${courseTypeSlug}-${subjectSlug}`;
        }) || directSlugMatch[0];

        console.log('✅ Found course directly via optimized slug query:', matchedCourse.subject);
        return res.status(200).json({ course: mapCourseToFrontend(matchedCourse), success: true });
      }
    }

    // Fallback: Retrieve all active courses as a last resort
    console.log('🔄 Performing fallback database scan...');
    const { data: allCourses, error: fetchErr } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('is_active', true);

    if (fetchErr) throw fetchErr;

    // Find match in memory using legacy slugifying matching rules
    const matchedCourse = (allCourses || []).find(course => {
      const subjectSlug = course.subject ? 
        course.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
      const titleSlug = course.title ? 
        course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
      const courseTypeSlug = course.course_type ? 
        course.course_type.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';
        
      if (courseId === subjectSlug || 
          courseId === titleSlug || 
          courseId === courseTypeSlug ||
          courseId === `${courseTypeSlug}-${subjectSlug}`) {
        return true;
      }

      if (paperNumber && course.paper_id && String(course.paper_id) === String(paperNumber)) {
        if (courseType) {
          const typeWords = courseType.replace('/', ' ').toLowerCase().split(' ');
          const typeMatch = course.course_type && typeWords.every(word => course.course_type.toLowerCase().includes(word));
          if (typeMatch) return true;
        } else {
          return true;
        }
      }

      return false;
    });

    if (matchedCourse) {
      console.log('✅ Found course via fallback database scan:', matchedCourse.subject);
      return res.status(200).json({ course: mapCourseToFrontend(matchedCourse), success: true });
    }

    // Still not found
    console.log('❌ Course not found anywhere:', courseId);
    return res.status(404).json({
      success: false,
      error: 'Course not found',
      courseId,
      duration: Date.now() - startTime
    });

  } catch (error) {
    console.error('❌ Error in getCourseDetails:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch course details',
      message: error.message,
      duration: Date.now() - startTime
    });
  }
};
