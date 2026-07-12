// Utility functions for handling image URLs

import { API_URL } from '../api';

/**
 * Get the full image URL for faculty images
 * Handles both Cloudinary URLs and local/static images
 */
export const getFacultyImageUrl = (faculty) => {
  console.log('🖼️ Getting faculty image URL for:', faculty?.firstName);
  console.log('📊 Faculty data:', {
    imageUrl: faculty?.imageUrl,
    image: faculty?.image,
    public_id: faculty?.public_id
  });
  
  if (!faculty) {
    console.log('❌ No faculty data provided');
    return '/logo.svg';
  }

  // Priority 1: If imageUrl is already a Cloudinary URL, use it directly
  if (faculty.imageUrl && faculty.imageUrl.startsWith('https://res.cloudinary.com/')) {
    console.log('✅ Using direct Cloudinary URL from imageUrl:', faculty.imageUrl);
    return faculty.imageUrl;
  }

  // Priority 2: If we have a public_id, construct Cloudinary URL
  if (faculty.public_id && faculty.public_id.trim() !== '') {
    const cloudinaryUrl = `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/faculty/${faculty.public_id}`;
    console.log('✅ Constructed Cloudinary URL from public_id:', cloudinaryUrl);
    return cloudinaryUrl;
  }

  // Priority 3: If we have an 'image' field with content, use it for Cloudinary
  if (faculty.image && faculty.image.trim() !== '') {
    const cloudinaryUrl = `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/faculty/${faculty.image}`;
    console.log('✅ Constructed Cloudinary URL from image field:', cloudinaryUrl);
    return cloudinaryUrl;
  }

  // Priority 4: If imageUrl exists and is a full URL (starts with http), use it directly
  if (faculty.imageUrl && faculty.imageUrl.startsWith('http')) {
    console.log('✅ Using direct HTTP URL:', faculty.imageUrl);
    return faculty.imageUrl;
  }

  // Priority 5: For legacy /uploads paths, try to access via API_URL first
  if (faculty.imageUrl && faculty.imageUrl.startsWith('/uploads')) {
    console.log('⚠️ Legacy /uploads path detected:', faculty.imageUrl);
    console.log('🔄 Attempting to load from server:', `${API_URL}${faculty.imageUrl}`);
    return `${API_URL}${faculty.imageUrl}`;
  }

  // Priority 6: If imageUrl exists and starts with /static, use it directly
  if (faculty.imageUrl && faculty.imageUrl.startsWith('/static')) {
    console.log('✅ Using static URL:', faculty.imageUrl);
    return faculty.imageUrl;
  }

  // Final fallback - use a proper placeholder instead of logo
  console.log('❌ No valid image found, using default placeholder');
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSIzMCIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNNjAgMTcwQzYwIDEzNy45MDkgODcuOTA5IDExMCAxMjAgMTEwQzE1Mi4wOTEgMTEwIDE4MCA5OS45MDkgMTgwIDEzMEwxODAgMTcwSDYwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
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
  
  // Priority 1: If we have a public_id, construct Cloudinary URL
  if (testimonial.public_id && testimonial.public_id.trim() !== '') {
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/permanent/${testimonial.public_id}`;
  }

  // Priority 2: If we have an 'image' field with content, use it for Cloudinary
  if (testimonial.image && testimonial.image.trim() !== '') {
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/permanent/${testimonial.image}`;
  }
  
  // Priority 3: If imageUrl exists and is a full URL, use it directly
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('http')) {
    return testimonial.imageUrl;
  }
  
  // Priority 4: For legacy /uploads paths, fallback to placeholder since files are missing
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/uploads')) {
    return '/logo.svg'; // Fallback for missing local files
  }
  
  // Priority 5: If imageUrl exists and starts with /static, use it directly
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/static')) {
    return testimonial.imageUrl;
  }
  
  // Final fallback
  return '/logo.svg';
};/**
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
