const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

router.get('/', menuController.getAllMenuItems);
router.post('/', auth, requireRole('staff', 'admin'), menuController.createMenuItem);
router.put('/:id', auth, requireRole('staff', 'admin'), menuController.updateMenuItem);
router.delete('/:id', auth, requireRole('staff', 'admin'), menuController.deleteMenuItem);

module.exports = router; 