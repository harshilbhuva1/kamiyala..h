const Category = require('../models/Category');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      sortBy = 'sortOrder',
      sortOrder = 'asc',
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const categories = await Category.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Category.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        categories,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalCategories: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: Number(limit),
        },
      },
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      data: { category },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category',
      error: error.message,
    });
  }
};

// Create category (Admin only)
const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      layout,
      showOnHomepage,
      showOnCategoryPage,
      sortOrder,
    } = req.body;

    // Handle image uploads
    let icon = '';
    let image = '';

    if (req.files) {
      if (req.files.icon && req.files.icon[0]) {
        try {
          const iconResult = await uploadToCloudinary(req.files.icon[0].buffer, {
            folder: 'martok/categories/icons',
            transformation: [{ width: 100, height: 100, crop: 'fit' }],
          });
          icon = iconResult.secure_url;
        } catch (uploadError) {
          console.error('Icon upload error:', uploadError);
        }
      }

      if (req.files.image && req.files.image[0]) {
        try {
          const imageResult = await uploadToCloudinary(req.files.image[0].buffer, {
            folder: 'martok/categories/images',
            transformation: [{ width: 400, height: 300, crop: 'fit' }],
          });
          image = imageResult.secure_url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
    }

    const category = await Category.create({
      name,
      description,
      icon,
      image,
      layout: layout || 'both',
      showOnHomepage: showOnHomepage !== 'false',
      showOnCategoryPage: showOnCategoryPage !== 'false',
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category',
      error: error.message,
    });
  }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Find existing category
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Handle image uploads
    if (req.files) {
      if (req.files.icon && req.files.icon[0]) {
        try {
          const iconResult = await uploadToCloudinary(req.files.icon[0].buffer, {
            folder: 'martok/categories/icons',
            transformation: [{ width: 100, height: 100, crop: 'fit' }],
          });
          updateData.icon = iconResult.secure_url;
        } catch (uploadError) {
          console.error('Icon upload error:', uploadError);
        }
      }

      if (req.files.image && req.files.image[0]) {
        try {
          const imageResult = await uploadToCloudinary(req.files.image[0].buffer, {
            folder: 'martok/categories/images',
            transformation: [{ width: 400, height: 300, crop: 'fit' }],
          });
          updateData.image = imageResult.secure_url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
        }
      }
    }

    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category },
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category',
      error: error.message,
    });
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const Product = require('../models/Product');
    const productsCount = await Product.countDocuments({ category: id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products',
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
      error: error.message,
    });
  }
};

// Get active categories for public use
const getActiveCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      isActive: true,
      showOnHomepage: true,
    }).sort({ sortOrder: 1, name: 1 });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error('Get active categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getActiveCategories,
};