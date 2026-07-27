/**
 * Maps Supabase snake_case course fields to camelCase for frontend compatibility.
 * This is the single source of truth for course field mapping.
 */
function mapCourseToFrontend(course) {
  if (!course) return course;

  // Extract real paper number from paper_name if available (e.g. "Paper 3: Cost ..." -> "3")
  let derivedPaperId = course.paper_id;
  if (!derivedPaperId && course.paper_name) {
    const match = String(course.paper_name).match(/Paper\s*(\d+)/i);
    if (match) {
      derivedPaperId = match[1];
    }
  }

  let customOrder;
  let isExclusive = false;
  let details = course.custom_details;
  if (typeof details === 'string') {
    try {
      details = JSON.parse(details);
    } catch (e) {
      details = [];
    }
  }

  if (Array.isArray(details)) {
    const orderObj = details.find(i => i && (i.fieldType === '__DISPLAY_ORDER__' || i.label === '__DISPLAY_ORDER__'));
    if (orderObj && orderObj.value !== undefined && orderObj.value !== null && !isNaN(Number(orderObj.value))) {
      customOrder = Number(orderObj.value);
    }
    const exclObj = details.find(i => i && (i.fieldType === 'boolean' && i.label === 'is_exclusive'));
    if (exclObj) {
      isExclusive = exclObj.value === true || exclObj.value === 'true';
    }
  } else if (typeof details === 'object' && details !== null) {
    if (details.display_order !== undefined && !isNaN(Number(details.display_order))) {
      customOrder = Number(details.display_order);
    }
  }

  const rawOrder = customOrder !== undefined && customOrder !== null
    ? customOrder
    : (course.display_order !== undefined && course.display_order !== null
        ? course.display_order
        : (course.sequence !== undefined && course.sequence !== null 
            ? course.sequence 
            : course.displayOrder));

  const displayOrder = (rawOrder !== undefined && rawOrder !== null && !isNaN(Number(rawOrder)))
    ? Number(rawOrder)
    : 9999;

  return {
    ...course,
    // ID compatibility
    _id: course.id,
    displayOrder,
    isExclusive,
    // Core fields
    paperId: derivedPaperId || course.paper_id,
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

