const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', inventoryController.getAllInventoryItems);
router.post('/', auth, requireRole('staff', 'admin'), inventoryController.createInventoryItem);
router.put('/:id', auth, requireRole('staff', 'admin'), inventoryController.updateInventoryItem);
router.delete('/:id', auth, requireRole('staff', 'admin'), inventoryController.deleteInventoryItem);
router.get('/expiring', auth, requireRole('staff', 'admin'), inventoryController.getExpiringItems);

module.exports = router; 