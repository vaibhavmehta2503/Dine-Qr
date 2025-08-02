const MenuItem = require('../models/MenuItem');

exports.getAllMenuItems = async (req, res) => {
  try {
    let restaurantId = req.user?.restaurantId || req.query.restaurantId;
    if (!restaurantId) return res.status(400).json({ error: 'restaurantId required' });
    const items = await MenuItem.find({ restaurantId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, price, available, description, image } = req.body;
    const restaurantId = req.user.restaurantId;
    if (!restaurantId) return res.status(400).json({ error: 'restaurantId required' });
    const newItem = new MenuItem({ name, price, available, description, image, restaurantId });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create menu item' });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;
    const updated = await MenuItem.findOneAndUpdate({ _id: id, restaurantId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Menu item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update menu item' });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user.restaurantId;
    const deleted = await MenuItem.findOneAndDelete({ _id: id, restaurantId });
    if (!deleted) return res.status(404).json({ error: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete menu item' });
  }
}; 