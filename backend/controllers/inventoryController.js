const InventoryItem = require('../models/InventoryItem');

exports.getAllInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
};

exports.createInventoryItem = async (req, res) => {
  try {
    const { name, quantity, expiryDate } = req.body;
    const newItem = new InventoryItem({ name, quantity, expiryDate });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create inventory item' });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await InventoryItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Inventory item not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update inventory item' });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InventoryItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Inventory item not found' });
    res.json({ message: 'Inventory item deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete inventory item' });
  }
};

// Get expiring items (within 2 days)
exports.getExpiringItems = async (req, res) => {
  try {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    const expiringItems = await InventoryItem.find({
      expiryDate: { $lte: twoDaysFromNow },
      quantity: { $gt: 0 }
    }).sort({ expiryDate: 1 });
    
    res.json(expiringItems);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}; 