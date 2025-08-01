const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addAddress,
  updateAddress,
  deleteAddress,
  getUserAddresses,
} = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Admin routes
router.get('/', authenticateToken, requireAdmin, getAllUsers);
router.get('/:id', authenticateToken, requireAdmin, getUserById);
router.put('/:id', authenticateToken, requireAdmin, updateUser);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

// User address routes
router.get('/addresses/me', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.put('/addresses/:addressId', authenticateToken, updateAddress);
router.delete('/addresses/:addressId', authenticateToken, deleteAddress);

module.exports = router;