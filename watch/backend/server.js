const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Import routes
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Sample watch products data
const watchProducts = [
  {
    id: 1,
    name: "Classic Analog Watch",
    brand: "TimeMaster",
    price: 299.99,
    category: "Analog",
    image: "/images/watch1.jpg",
    description: "Elegant classic analog watch with leather strap",
    features: ["Water resistant", "Leather strap", "Japanese movement"],
    inStock: true
  },
  {
    id: 2,
    name: "Digital Sports Watch",
    brand: "SportTech",
    price: 199.99,
    category: "Digital",
    image: "/images/watch2.jpg",
    description: "High-performance digital sports watch",
    features: ["GPS tracking", "Heart rate monitor", "Water resistant"],
    inStock: true
  },
  {
    id: 3,
    name: "Luxury Chronograph",
    brand: "LuxTime",
    price: 899.99,
    category: "Luxury",
    image: "/images/watch3.jpg",
    description: "Premium chronograph watch with premium materials",
    features: ["Swiss movement", "Sapphire crystal", "Stainless steel"],
    inStock: true
  },
  {
    id: 4,
    name: "Smart Watch Pro",
    brand: "TechWear",
    price: 399.99,
    category: "Smart",
    image: "/images/watch4.jpg",
    description: "Advanced smartwatch with health monitoring",
    features: ["Bluetooth", "Fitness tracking", "Notifications"],
    inStock: true
  }
];

// Basic routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Watch Store API' });
});

app.get('/api/products', (req, res) => {
  res.json(watchProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = watchProducts.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});