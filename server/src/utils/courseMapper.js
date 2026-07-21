/**
 * Maps Supabase snake_case course fields to camelCase for frontend compatibility.
 * This is the single source of truth for course field mapping.
 */
function mapCourseToFrontend(course) {
  if (!course) return course;
  return {
    ...course,
    // ID compatibility
    _id: course.id,
    displayOrder: course.display_order !== undefined && course.display_order !== null 
      ? Number(course.display_order) 
      : (course.sequence !== undefined && course.sequence !== null 
          ? Number(course.sequence) 
          : (course.displayOrder !== undefined && course.displayOrder !== null ? Number(course.displayOrder) : 9999)),
    // Core fields
    paperId: course.paper_id,
    paperName: course.paper_name,
    courseType: course.course_type,
    // Faculty
    facultyName: course.faculty_name,
    facultySlug: course.faculty_slug,
    facultyId: course.faculty_id,
    // Institute
    instituteName: course.institute_name,
    instituteId: course.institute_id,
    // Media
    posterUrl: course.poster_url,
    posterPublicId: course.poster_public_id,
    // Pricing
    modeAttemptPricing: course.mode_attempt_pricing,
    costPrice: course.cost_price,
    sellingPrice: course.selling_price,
    // Details
    noOfLecture: course.no_of_lecture,
    videoLanguage: course.video_language,
    videoRunOn: course.video_run_on,
    doubtSolving: course.doubt_solving,
    supportMail: course.support_mail,
    supportCall: course.support_call,
    validityStartFrom: course.validity_start_from,
    customDetails: course.custom_details || [],
    isActive: course.is_active,
    createdAt: course.created_at,
    updatedAt: course.updated_at,
    // Ensure subject is always present
    subject: course.subject || course.title,
  };
}

/**
 * Maps an array of Supabase courses to frontend format and sorts by displayOrder.
 */
function mapCoursesToFrontend(courses) {
  if (!Array.isArray(courses)) return [];
  const mapped = courses.map(mapCourseToFrontend);
  return mapped.sort((a, b) => {
    const orderA = Number(a.displayOrder ?? 9999);
    const orderB = Number(b.displayOrder ?? 9999);
    if (orderA !== orderB) return orderA - orderB;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

module.exports = { mapCourseToFrontend, mapCoursesToFrontend };

