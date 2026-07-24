export function normalizeModeAttemptPricing(modeAttemptPricing) {
  if (!Array.isArray(modeAttemptPricing)) return [];

  const grouped = new Map();

  modeAttemptPricing.forEach((option) => {
    if (!option || typeof option !== 'object') return;

    const mode = option.mode || 'Default';
    const modeLabel = option.modeLabel || 'Mode';
    const attempts = Array.isArray(option.attempts)
      ? option.attempts
      : [{
          attempt: option.attempt || option.validity || '',
          attemptLabel: option.attemptLabel || 'Exam Term / Attempt',
          validity: option.validity || '',
          validityLabel: option.validityLabel || 'Validity',
          costPrice: option.costPrice,
          sellingPrice: option.sellingPrice,
          description: option.description || '',
        }];

    if (!grouped.has(mode)) {
      grouped.set(mode, { mode, modeLabel, attempts: [] });
    }

    attempts.forEach((attempt) => {
      const sellingPrice = Number(attempt.sellingPrice) || 0;
      if (sellingPrice > 0) {
        grouped.get(mode).attempts.push({
          ...attempt,
          attemptLabel: attempt.attemptLabel || 'Exam Term / Attempt',
          validityLabel: attempt.validityLabel || 'Validity',
          description: attempt.description || '',
          costPrice: Number(attempt.costPrice) || 0,
          sellingPrice: sellingPrice,
        });
      }
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
