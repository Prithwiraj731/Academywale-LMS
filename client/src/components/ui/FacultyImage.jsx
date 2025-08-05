import React, { useState } from 'react';

const FacultyImage = ({ 
  faculty, 
  className = "", 
  alt = "Faculty", 
  showPlaceholder = true,
  onError,
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Get the best available image URL
  const getImageUrl = () => {
    if (!faculty) return null;
    
    // Priority 1: Cloudinary URL (starts with https://res.cloudinary.com)
    if (faculty.imageUrl && faculty.imageUrl.includes('cloudinary.com')) {
      return faculty.imageUrl;
    }
    
    // Priority 2: Direct HTTP URLs
    if (faculty.imageUrl && faculty.imageUrl.startsWith('http')) {
      return faculty.imageUrl;
    }
    
    // Priority 3: Static assets
    if (faculty.imageUrl && faculty.imageUrl.startsWith('/static')) {
      return faculty.imageUrl;
    }
    
    // Priority 4: Legacy uploads (try via API)
    if (faculty.imageUrl && faculty.imageUrl.startsWith('/uploads')) {
      const API_URL = import.meta.env.VITE_API_URL;
      return `${API_URL}${faculty.imageUrl}`;
    }
    
    return null;
  };

  const imageUrl = getImageUrl();
  
  const handleImageError = (e) => {
    console.log('🖼️ Image failed to load:', imageUrl);
    setImageError(true);
    setLoading(false);
    if (onError) onError(e);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setImageError(false);
  };

  // If no image URL or error occurred, show placeholder
  if (!imageUrl || imageError) {
    if (!showPlaceholder) return null;
    
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-gray-300 ${className}`}
        {...props}
      >
        <div className="text-center p-2">
          <div className="text-2xl mb-1">👤</div>
          <div className="text-xs text-gray-500 leading-tight">
            {faculty?.firstName || 'Faculty'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse ${className}`}
          {...props}
        >
          <div className="text-gray-400">📷</div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={alt || faculty?.firstName || 'Faculty'}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ display: loading ? 'none' : 'block' }}
        {...props}
      />
    </div>
  );
};

export default FacultyImage;
