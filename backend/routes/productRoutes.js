const express = require('express');
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getFeaturedProducts,
  addProductReview,
} = require('../controllers/productController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middlewares/auth');
const { upload, handleMulterError } = require('../middlewares/upload');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', optionalAuth, getProductById);

// Protected routes (user)
router.post('/:id/review', authenticateToken, addProductReview);

// Admin routes
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  upload.array('images', 10),
  handleMulterError,
  createProduct
);

router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  upload.array('images', 10),
  handleMulterError,
  updateProduct
);

router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);
router.delete('/:id/images/:imageId', authenticateToken, requireAdmin, deleteProductImage);

module.exports = router;