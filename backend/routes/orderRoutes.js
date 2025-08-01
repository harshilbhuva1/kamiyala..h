const express = require('express');
const {
  createWhatsAppOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// User routes
router.post('/whatsapp', authenticateToken, createWhatsAppOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id/cancel', authenticateToken, cancelOrder);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);

module.exports = router;