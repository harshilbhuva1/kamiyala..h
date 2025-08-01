const express = require('express');
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  handlePaymentFailure,
  getPaymentStatus,
  handleWebhook,
} = require('../controllers/razorpayController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Protected routes
router.post('/create-order', authenticateToken, createRazorpayOrder);
router.post('/verify-payment', authenticateToken, verifyRazorpayPayment);
router.post('/payment-failure', authenticateToken, handlePaymentFailure);
router.get('/payment-status/:orderId', authenticateToken, getPaymentStatus);

// Webhook route (no authentication needed)
router.post('/webhook', handleWebhook);

module.exports = router;