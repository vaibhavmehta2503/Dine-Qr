const Order = require('../models/Order');

// ✅ Staff/Admin - Get all orders for their restaurant
exports.getAllOrders = async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId;
    if (!restaurantId) {
      return res.status(400).json({ error: 'restaurantId required' });
    }
    let orders = [];
    // If logged in and staff/admin, show all orders for the restaurant
    if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
      orders = await Order.find({ restaurantId }).populate('items.menuItem');
    } else {
      // If logged in as customer, show only their orders
      if (req.user && req.user.email) {
        orders = await Order.find({ restaurantId, customerEmail: req.user.email }).populate('items.menuItem');
      } else {
        // If guest, try to filter by tableNumber if provided
        const tableNumber = req.query.tableNumber;
        if (tableNumber) {
          orders = await Order.find({ restaurantId, tableNumber }).populate('items.menuItem');
        } else {
          // No way to identify guest's order
          return res.status(403).json({ error: 'Not authorized to view all orders.' });
        }
      }
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// ✅ Anyone - Create order (QR user or logged in customer/staff)
exports.createOrder = async (req, res) => {
  try {
    const {
      items,
      status,
      total,
      customerName,
      tableNumber,
      orderType,
      deliveryAddress,
      restaurantId: bodyRestaurantId
    } = req.body;

    const restaurantId = req.user?.restaurantId || bodyRestaurantId;
    if (!restaurantId) {
      return res.status(400).json({ error: 'restaurantId is required' });
    }

    const newOrder = new Order({
      items,
      status: status || 'pending',
      total,
      customerName,
      tableNumber,
      orderType,
      deliveryAddress,
      customerId: req.user?.id || null,
      customerEmail: req.user?.email || null,
      restaurantId
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(400).json({ error: 'Failed to create order' });
  }
};

// ✅ Staff/Admin - Update order within their restaurant
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      return res.status(403).json({ error: 'Unauthorized: restaurantId missing' });
    }

    const updated = await Order.findOneAndUpdate(
      { _id: id, restaurantId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Order not found or not yours' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Order update error:', err);
    res.status(400).json({ error: 'Failed to update order' });
  }
};

// ✅ Staff/Admin - Delete order within their restaurant
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId) {
      return res.status(403).json({ error: 'Unauthorized: restaurantId missing' });
    }

    const deleted = await Order.findOneAndDelete({ _id: id, restaurantId });

    if (!deleted) {
      return res.status(404).json({ error: 'Order not found or not yours' });
    }

    res.json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Order delete error:', err);
    res.status(400).json({ error: 'Failed to delete order' });
  }
};

// ✅ Customers (logged-in or QR) - Get their own orders for the restaurant
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userEmail = req.user?.email;
    const restaurantId = req.user?.restaurantId || req.query.restaurantId;

    if (!restaurantId) {
      return res.status(400).json({ error: 'restaurantId is required' });
    }

    let orders = [];

    if (userId) {
      orders = await Order.find({ customerId: userId, restaurantId }).populate('items.menuItem');
    } else if (userEmail) {
      orders = await Order.find({ customerEmail: userEmail, restaurantId }).populate('items.menuItem');
    }

    res.json(orders);
  } catch (err) {
    console.error('getMyOrders error:', err);
    res.status(500).json({ error: 'Failed to fetch your orders' });
  }
};
