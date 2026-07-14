export function normalizeModeAttemptPricing(modeAttemptPricing) {
  if (!Array.isArray(modeAttemptPricing)) return [];

  const grouped = new Map();

  modeAttemptPricing.forEach((option) => {
    if (!option || typeof option !== 'object') return;

    const mode = option.mode || 'Default';
    const attempts = Array.isArray(option.attempts)
      ? option.attempts
      : [{
          attempt: option.attempt || option.validity || '',
          validity: option.validity || '',
          costPrice: option.costPrice,
          sellingPrice: option.sellingPrice,
        }];

    if (!grouped.has(mode)) {
      grouped.set(mode, { mode, attempts: [] });
    }

    attempts.forEach((attempt) => {
      grouped.get(mode).attempts.push({
        ...attempt,
        costPrice: Number(attempt.costPrice) || 0,
        sellingPrice: Number(attempt.sellingPrice) || 0,
      });
    });
  });

  return Array.from(grouped.values()).filter((option) => option.attempts.length > 0);
}

export function normalizeCoursePricing(course) {
  if (!course) return course;

  return {
    ...course,
    modeAttemptPricing: normalizeModeAttemptPricing(course.modeAttemptPricing),
  };
}

export function normalizeCoursesPricing(courses) {
  if (!Array.isArray(courses)) return [];
  return courses.map(normalizeCoursePricing);
}
