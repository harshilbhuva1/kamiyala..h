const express = require('express');
const router = express.Router();

// Sample watch products data
let watchProducts = [
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

// GET all products
router.get('/', (req, res) => {
  res.json(watchProducts);
});

// GET single product by ID
router.get('/:id', (req, res) => {
  const product = watchProducts.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST new product
router.post('/', (req, res) => {
  const { name, brand, price, category, image, description, features } = req.body;
  
  if (!name || !brand || !price || !category) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  const newProduct = {
    id: watchProducts.length + 1,
    name,
    brand,
    price: parseFloat(price),
    category,
    image: image || '/images/default-watch.jpg',
    description: description || '',
    features: features || [],
    inStock: true
  };

  watchProducts.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
router.put('/:id', (req, res) => {
  const productIndex = watchProducts.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const { name, brand, price, category, image, description, features, inStock } = req.body;
  
  watchProducts[productIndex] = {
    ...watchProducts[productIndex],
    name: name || watchProducts[productIndex].name,
    brand: brand || watchProducts[productIndex].brand,
    price: price ? parseFloat(price) : watchProducts[productIndex].price,
    category: category || watchProducts[productIndex].category,
    image: image || watchProducts[productIndex].image,
    description: description || watchProducts[productIndex].description,
    features: features || watchProducts[productIndex].features,
    inStock: inStock !== undefined ? inStock : watchProducts[productIndex].inStock
  };

  res.json(watchProducts[productIndex]);
});

// DELETE product
router.delete('/:id', (req, res) => {
  const productIndex = watchProducts.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const deletedProduct = watchProducts.splice(productIndex, 1)[0];
  res.json({ message: 'Product deleted successfully', product: deletedProduct });
});

// GET products by category
router.get('/category/:category', (req, res) => {
  const category = req.params.category;
  const filteredProducts = watchProducts.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  res.json(filteredProducts);
});

// GET products by brand
router.get('/brand/:brand', (req, res) => {
  const brand = req.params.brand;
  const filteredProducts = watchProducts.filter(p => 
    p.brand.toLowerCase().includes(brand.toLowerCase())
  );
  res.json(filteredProducts);
});

module.exports = router;