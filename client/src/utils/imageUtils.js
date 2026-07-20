import { API_URL } from '../api';

/**
 * Get the full image URL for faculty images
 */
export const getFacultyImageUrl = (faculty) => {
  if (!faculty) return '/logo.svg';

  if (faculty.imageUrl && faculty.imageUrl.startsWith('https://res.cloudinary.com/')) {
    return faculty.imageUrl;
  }

  if (faculty.public_id && faculty.public_id.trim() !== '') {
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/faculty/${faculty.public_id}`;
  }

  if (faculty.image && faculty.image.trim() !== '') {
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/faculty/${faculty.image}`;
  }

  if (faculty.imageUrl && faculty.imageUrl.startsWith('http')) {
    return faculty.imageUrl;
  }

  if (faculty.imageUrl && faculty.imageUrl.startsWith('/uploads')) {
    return `${API_URL}${faculty.imageUrl}`;
  }

  if (faculty.imageUrl && faculty.imageUrl.startsWith('/static')) {
    return faculty.imageUrl;
  }

  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMDAgMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+PGNpcmNsZSBjeD0iMTAwIiBjeT0iODAiIHI9IjMwIiBmaWxsPSIjOUNBM0FGIi8+PHBhdGggZD0iTTYwIDE3MEM2MCAxMzcuOTA5IDg3LjkwOSAxMTAgMTIwIDExMEMxNTIuMDkxIDExMCAxODAgOTkuOTA5IDE4MCAxMzBMMTgwIDE3MEg2MFoiIGZpbGw9IiM5Q0EzQUYiLz48L3N2Zz4K';
};

export const getFacultyCloudinaryId = (faculty) => {
  if (!faculty) return null;
  return faculty.image || faculty.public_id || null;
};

/**
 * Get the full image URL for course posters
 */
export const getCourseImageUrl = (course) => {
  if (!course || !course.posterUrl) return '/logo.svg';

  if (course.posterUrl.startsWith('http')) {
    return course.posterUrl;
  }

  if (course.posterUrl.startsWith('/uploads')) {
    return `${API_URL}${course.posterUrl}`;
  }

  if (course.posterUrl.startsWith('/static')) {
    return course.posterUrl;
  }

  return '/logo.svg';
};

/**
 * Get the full image URL for testimonial images
 */
export const getTestimonialImageUrl = (testimonial) => {
  if (!testimonial) return '/logo.svg';
  
  if (testimonial.public_id && testimonial.public_id.trim() !== '') {
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/permanent/${testimonial.public_id}`;
  }

  if (testimonial.image && testimonial.image.trim() !== '') {
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/permanent/${testimonial.image}`;
  }
  
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('http')) {
    return testimonial.imageUrl;
  }
  
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/uploads')) {
    return '/logo.svg';
  }
  
  if (testimonial.imageUrl && testimonial.imageUrl.startsWith('/static')) {
    return testimonial.imageUrl;
  }
  
  return '/logo.svg';
};

export const getTestimonialCloudinaryId = (testimonial) => {
  if (!testimonial) return null;
  return testimonial.image || null;
};

/**
 * Get the full image URL for institute images
 */
export const getInstituteImageUrl = (institute) => {
  if (!institute) return '/logo.svg';

  const rawUrl = institute.imageUrl || institute.image_url || institute.image || institute.logo;
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    if (rawUrl.startsWith('http')) return rawUrl;
    if (rawUrl.startsWith('/uploads')) return `${API_URL}${rawUrl}`;
    if (rawUrl.startsWith('/static') || rawUrl.startsWith('/institutes') || rawUrl.startsWith('/')) return rawUrl;
    return `${API_URL}/uploads/${rawUrl}`;
  }

  // Fallback map based on institute name
  const nameLower = (institute.name || institute.title || '').toLowerCase().replace(/_/g, ' ');

  if (nameLower.includes('aaditya jain')) return '/institutes/aaditya_jain_classes.png';
  if (nameLower.includes('arjun chhabra')) return '/institutes/arjun_chhabra_tutorial.png';
  if (nameLower.includes('avinash lala')) return '/institutes/avinash_lala_classes.jpg';
  if (nameLower.includes('bb virtual')) return '/institutes/bb_virtuals.png';
  if (nameLower.includes('bishnu kedia')) return '/institutes/bishnu_kedia_classes.png';
  if (nameLower.includes('ca buddy')) return '/institutes/ca_buddy.png';
  if (nameLower.includes('praveen jindal')) return '/institutes/ca_praveen_jindal.png';
  if (nameLower.includes('coc')) return '/institutes/coc_education.png';
  if (nameLower.includes('ekatvam')) return '/institutes/ekatvam.png';
  if (nameLower.includes('gopal bhoot')) return '/institutes/gopal_bhoot_classes.gif';
  if (nameLower.includes('harshad jaju')) return '/institutes/harshad_jaju_classes.png';
  if (nameLower.includes('navin')) return '/institutes/navin_classes.jpg';
  if (nameLower.includes('nitin guru')) return '/institutes/nitin_guru_classes.png';
  if (nameLower.includes('ranjan periwal')) return '/institutes/ranjan_periwal_classes.jpg';
  if (nameLower.includes('shivangi agarwal')) return '/institutes/shivangi_agarwal.png';
  if (nameLower.includes('siddharth agar')) return '/institutes/siddharth_agarrwal_classes.jpg';
  if (nameLower.includes('sjc')) return '/institutes/sjc_institute.jpg';
  if (nameLower.includes('yashvant') || nameLower.includes('yashwant')) return '/institutes/yashwant_mangal_classes.avif';

  return '/logo.svg';
};
