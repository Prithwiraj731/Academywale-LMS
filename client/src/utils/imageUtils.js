// Utility functions for handling image URLs

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Get the full image URL for faculty images
 * Handles both Cloudinary URLs and local/static images
 */
export const getFacultyImageUrl = (faculty) => {
  if (!faculty) return '/logo.svg';
  
  // If imageUrl exists and is a full URL (starts with http), use it directly
  if (faculty.imageUrl && faculty.imageUrl.startsWith('http')) {
    return faculty.imageUrl;
  }
  
  // If imageUrl exists and starts with /uploads, prepend API_URL
  if (faculty.imageUrl && faculty.imageUrl.startsWith('/uploads')) {
    return `${API_URL}${faculty.imageUrl}`;
  }
  
  // If imageUrl exists and starts with /static, use it directly (served by server)
  if (faculty.imageUrl && faculty.imageUrl.startsWith('/static')) {
    return faculty.imageUrl;
  }
  
  // Fallback to logo
  return '/logo.svg';
};

/**
 * Get the Cloudinary public_id for faculty images
 * Used for Cloudinary transformations
 */
export const getFacultyCloudinaryId = (faculty) => {
  if (!faculty) return null;
  
  // Return the public_id stored in either 'image' or 'public_id' field
  return faculty.image || faculty.public_id || null;
};

/**
 * Get the full image URL for course posters
 * Handles both Cloudinary URLs and local/static images
 */
export const getCourseImageUrl = (course) => {
  if (!course || !course.posterUrl) return '/logo.svg';
  
  // If posterUrl is a full URL (starts with http), use it directly
  if (course.posterUrl.startsWith('http')) {
    return course.posterUrl;
  }
  
  // If posterUrl starts with /uploads, prepend API_URL
  if (course.posterUrl.startsWith('/uploads')) {
    return `${API_URL}${course.posterUrl}`;
  }
  
  // If posterUrl starts with /static, use it directly
  if (course.posterUrl.startsWith('/static')) {
    return course.posterUrl;
  }
  
  // Fallback to logo
  return '/logo.svg';
};

/**
 * Get the full image URL for testimonial images
 * Handles both Cloudinary URLs and local/static images
 */
export const getTestimonialImageUrl = (testimonial) => {
  if (!testimonial) return '/logo.svg';
  
  // If imageUrl exists and is a full URL, use it directly
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('http')) {
    return testimonial.imageUrl;
  }
  
  // If imageUrl exists and starts with /uploads, prepend API_URL
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/uploads')) {
    return `${API_URL}${testimonial.imageUrl}`;
  }
  
  // If imageUrl exists and starts with /static, use it directly
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/static')) {
    return testimonial.imageUrl;
  }
  
  // Fallback to logo
  return '/logo.svg';
};

/**
 * Get the Cloudinary public_id for testimonial images
 * Used for Cloudinary transformations
 */
export const getTestimonialCloudinaryId = (testimonial) => {
  if (!testimonial) return null;
  
  // Return the public_id stored in 'image' field
  return testimonial.image || null;
};

/**
 * Get the full image URL for institute images
 * Handles both Cloudinary URLs and local/static images
 */
export const getInstituteImageUrl = (institute) => {
  if (!institute || !institute.imageUrl) return '/logo.svg';
  
  // If imageUrl is a full URL (starts with http), use it directly
  if (institute.imageUrl.startsWith('http')) {
    return institute.imageUrl;
  }
  
  // If imageUrl starts with /uploads, prepend API_URL
  if (institute.imageUrl.startsWith('/uploads')) {
    return `${API_URL}${institute.imageUrl}`;
  }
  
  // If imageUrl starts with /static or /institutes, use it directly
  if (institute.imageUrl.startsWith('/static') || institute.imageUrl.startsWith('/institutes')) {
    return institute.imageUrl;
  }
  
  // Fallback to logo
  return '/logo.svg';
};
