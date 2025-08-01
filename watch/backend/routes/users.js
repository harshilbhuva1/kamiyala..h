const express = require('express');
const router = express.Router();

// Sample users data (in a real app, this would be in a database)
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "hashedpassword123", // In real app, this would be hashed
    role: "customer",
    createdAt: new Date()
  }
];

// GET all users (admin only)
router.get('/', (req, res) => {
  // In a real app, you'd check for admin role
  const usersWithoutPassword = users.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
  res.json(usersWithoutPassword);
});

// GET user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// POST register new user
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password, // In real app, hash this password
    role: "customer",
    createdAt: new Date()
  };

  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json(userWithoutPassword);
});

// POST login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // In a real app, you'd generate a JWT token here
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    message: 'Login successful',
    user: userWithoutPassword,
    token: 'sample-jwt-token-' + user.id
  });
});

// PUT update user
router.put('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, email, password } = req.body;
  
  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].name,
    password: password || users[userIndex].password
  };

  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.json(userWithoutPassword);
});

// DELETE user
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  const { password, ...userWithoutPassword } = deletedUser;
  res.json({ message: 'User deleted successfully', user: userWithoutPassword });
});

module.exports = router;