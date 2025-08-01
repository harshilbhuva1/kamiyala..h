const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

// Upload image/video to Cloudinary
const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Automatically detect file type
          folder: options.folder || 'martok',
          transformation: options.transformation || [],
          quality: options.quality || 'auto',
          format: options.format || 'auto',
          ...options,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const stream = Readable.from(fileBuffer);
      stream.pipe(uploadStream);
    });
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete image/video from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

// Upload multiple files
const uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, {
        ...options,
        original_filename: file.originalname,
      })
    );
    
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

// Generate optimized image transformations
const getImageTransformations = (type = 'product') => {
  const transformations = {
    product: [
      { width: 800, height: 800, crop: 'fit', quality: 'auto', format: 'auto' },
    ],
    thumbnail: [
      { width: 300, height: 300, crop: 'fill', quality: 'auto', format: 'auto' },
    ],
    banner: [
      { width: 1920, height: 600, crop: 'fill', quality: 'auto', format: 'auto' },
    ],
    mobile_banner: [
      { width: 768, height: 400, crop: 'fill', quality: 'auto', format: 'auto' },
    ],
    profile: [
      { width: 200, height: 200, crop: 'fill', quality: 'auto', format: 'auto', gravity: 'face' },
    ],
  };
  
  return transformations[type] || transformations.product;
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadMultipleToCloudinary,
  getImageTransformations,
};