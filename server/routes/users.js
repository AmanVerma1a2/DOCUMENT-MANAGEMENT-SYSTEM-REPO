const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Get all users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add a user (for testing)
router.post('/', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  // Email validation for username
  if (!/^\S+@\S+\.\S+$/.test(username)) {
    return res.status(400).json({ message: 'Username must be a valid email address' });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ message: 'Signup successful' });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  // Email validation for username
  if (!/^\S+@\S+\.\S+$/.test(username)) {
    return res.status(400).json({ message: 'Username must be a valid email address' });
  }
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'User not found' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

module.exports = router;