const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const optionalAuth = require('../middleware/optionalAuth');

// Anyone can get all orders for a restaurant
router.get('/', optionalAuth, orderController.getAllOrders);

// Customer or guest creates an order (no auth required)
router.post('/', orderController.createOrder);

// Staff or Admin updates an order
router.put('/:id', auth, requireRole('staff', 'admin'), orderController.updateOrder);

// Staff or Admin deletes an order
router.delete('/:id', auth, requireRole('staff', 'admin'), orderController.deleteOrder);

// Authenticated user gets their own orders
router.get('/my', auth, orderController.getMyOrders);

module.exports = router;
