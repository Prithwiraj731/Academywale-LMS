import { API_URL } from '../api';
import { hardcodedFaculties } from '../data/hardcodedFaculties';

/**
 * Get the full image URL for faculty images
 */
export const getFacultyImageUrl = (faculty) => {
  if (!faculty) return '/logo.svg';

  // 1. Direct string passed or raw url properties
  const rawUrl = typeof faculty === 'string' ? faculty : (faculty.imageUrl || faculty.image || faculty.image_url);

  if (rawUrl && typeof rawUrl === 'string') {
    const trimmed = rawUrl.trim();
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('data:') ||
      trimmed.startsWith('/assets/') ||
      trimmed.startsWith('/static/') ||
      trimmed.includes('/assets/')
    ) {
      return trimmed;
    }
    if (trimmed.startsWith('/uploads/')) {
      return `${API_URL}${trimmed}`;
    }
  }

  // 2. Check hardcodedFaculties by slug or name if available
  const facultySlug = faculty.slug || (typeof faculty.name === 'string' ? faculty.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '');
  if (facultySlug) {
    const matched = hardcodedFaculties.find(f => f.slug === facultySlug || f.name?.toLowerCase() === faculty.name?.toLowerCase());
    if (matched && matched.image) {
      return matched.image;
    }
  }

  // 3. Cloudinary public_id
  if (faculty.public_id && typeof faculty.public_id === 'string' && faculty.public_id.trim() !== '') {
    const pid = faculty.public_id.trim();
    if (pid.startsWith('http')) return pid;
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/faculty/${pid}`;
  }

  // 4. Short filename string (without slashes)
  if (typeof faculty.image === 'string' && faculty.image.trim() !== '' && !faculty.image.includes('/')) {
    return `https://res.cloudinary.com/drlqhsjgm/image/upload/v1/academywale/faculty/${faculty.image.trim()}`;
  }

  return '/logo.svg';
};

export const getFacultyCloudinaryId = (faculty) => {
  if (!faculty) return null;
  return faculty.image || faculty.public_id || null;
};

/**
 * Get the full image URL for course posters
 */
export const getCourseImageUrl = (course) => {
  if (!course) return '/logo.svg';
  const url = typeof course === 'string' 
    ? course 
    : (course.posterUrl || course.poster_url || course.poster || course.image || course.banner || '');

  if (!url || typeof url !== 'string') return '/logo.svg';
  const trimmed = url.trim();

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    return `${API_URL}${cleanPath}`;
  }
  if (trimmed.startsWith('/') || trimmed.startsWith('static/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
  return `${API_URL}/${trimmed}`;
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
