const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Signup with optional restaurantId
router.post('/signup', async (req, res) => {
  const { name, email, password, restaurantId } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });

    if (restaurantId) user.restaurantId = restaurantId;

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        restaurantId: user.restaurantId
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Update user role and assign restaurantId if making staff
router.put('/role/:id', auth, requireRole('admin'), async (req, res) => {
  const { role, restaurantId } = req.body;

  if (!['admin', 'staff', 'customer'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const updateFields = { role };
  // Only superadmin can assign any restaurantId; regular admin can only assign their own
  if (role === 'staff' && restaurantId) {
    if (req.user.role === 'superadmin') {
      updateFields.restaurantId = restaurantId;
    } else {
      if (restaurantId !== String(req.user.restaurantId)) {
        return res.status(403).json({ error: 'You can only assign users to your own restaurant.' });
      }
      updateFields.restaurantId = restaurantId;
    }
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Role updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get all users (excluding passwords)
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
