const Restaurant = require('../models/Restaurant');
const User = require('../models/User');

exports.createRestaurant = async (req, res) => {
  try {
    const { name, address, adminId } = req.body;
    if (!name || !adminId) return res.status(400).json({ error: 'Name and adminId are required' });
    // Create restaurant
    const restaurant = new Restaurant({ name, address });
    await restaurant.save();
    // Update admin user
    const user = await User.findByIdAndUpdate(adminId, { restaurantId: restaurant._id }, { new: true });
    if (!user) return res.status(404).json({ error: 'Admin user not found' });
    res.status(201).json({ restaurant, user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create restaurant', details: err.message });
  }
}; 