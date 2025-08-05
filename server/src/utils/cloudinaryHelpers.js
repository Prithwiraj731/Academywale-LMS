const { cloudinary } = require('../config/cloudinary.config');

/**
 * Upload image to Cloudinary with permanent storage settings
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - Original filename
 * @param {string} folder - Cloudinary folder (default: academywale/permanent)
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadToCloudinaryPermanent = async (fileBuffer, fileName, folder = 'academywale/permanent') => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          public_id: `${fileName}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          overwrite: false,
          unique_filename: true,
          use_filename: false,
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" }
          ],
          // Ensure permanent storage
          type: 'upload', // Not 'private' or 'authenticated'
          access_mode: 'public',
          format: 'auto',
          secure: true
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', {
              public_id: result.public_id,
              secure_url: result.secure_url,
              resource_type: result.resource_type,
              folder: result.folder
            });
            resolve(result);
          }
        }
      );
    });

    return result;
  } catch (error) {
    console.error('Upload to Cloudinary failed:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Cloudinary delete result:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Get Cloudinary image URL with transformations
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} transformations - Optional transformations
 * @returns {string} - Optimized image URL
 */
const getOptimizedImageUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: 'auto:good',
    fetch_format: 'auto'
  };

  const finalTransformations = { ...defaultTransformations, ...transformations };
  
  return cloudinary.url(publicId, {
    secure: true,
    ...finalTransformations
  });
};

module.exports = {
  uploadToCloudinaryPermanent,
  deleteFromCloudinary,
  getOptimizedImageUrl
};
