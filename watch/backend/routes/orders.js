const express = require('express');
const router = express.Router();

// Sample orders data (in a real app, this would be in a database)
let orders = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        productId: 1,
        name: "Classic Analog Watch",
        price: 299.99,
        quantity: 1
      }
    ],
    total: 299.99,
    status: "pending",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    createdAt: new Date()
  }
];

// GET all orders (admin only)
router.get('/', (req, res) => {
  res.json(orders);
});

// GET orders by user ID
router.get('/user/:userId', (req, res) => {
  const userOrders = orders.filter(order => order.userId === parseInt(req.params.userId));
  res.json(userOrders);
});

// GET single order by ID
router.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json(order);
});

// POST create new order
router.post('/', (req, res) => {
  const { userId, items, shippingAddress } = req.body;
  
  if (!userId || !items || !shippingAddress) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Calculate total
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const newOrder = {
    id: orders.length + 1,
    userId: parseInt(userId),
    items,
    total,
    status: "pending",
    shippingAddress,
    createdAt: new Date()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// PUT update order status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (!status) {
    return res.status(400).json({ message: 'Please provide status' });
  }

  orders[orderIndex].status = status;
  res.json(orders[orderIndex]);
});

// PUT update order
router.put('/:id', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const { items, shippingAddress, status } = req.body;
  
  if (items) {
    orders[orderIndex].items = items;
    orders[orderIndex].total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  if (shippingAddress) {
    orders[orderIndex].shippingAddress = shippingAddress;
  }
  
  if (status) {
    orders[orderIndex].status = status;
  }

  res.json(orders[orderIndex]);
});

// DELETE order
router.delete('/:id', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const deletedOrder = orders.splice(orderIndex, 1)[0];
  res.json({ message: 'Order deleted successfully', order: deletedOrder });
});

// GET orders by status
router.get('/status/:status', (req, res) => {
  const status = req.params.status;
  const filteredOrders = orders.filter(order => order.status === status);
  res.json(filteredOrders);
});

module.exports = router;