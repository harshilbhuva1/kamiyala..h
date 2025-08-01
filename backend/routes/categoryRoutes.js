const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getActiveCategories,
} = require('../controllers/categoryController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');
const { upload, handleMulterError } = require('../middlewares/upload');

const router = express.Router();

// Public routes
router.get('/active', getActiveCategories);
router.get('/:id', getCategoryById);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getCategories);
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  handleMulterError,
  createCategory
);
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  handleMulterError,
  updateCategory
);
router.delete('/:id', authenticateToken, requireAdmin, deleteCategory);

module.exports = router;