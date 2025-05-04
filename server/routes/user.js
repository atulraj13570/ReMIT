import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, batch_year, branch, profile_picture, linkedin_url, current_position, location } = req.body;
    console.log('Registration attempt:', { name, email, role, batch_year, branch });
    
    // Basic validation
    if (!name || !email || !password || !role || !batch_year || !branch) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      name, 
      email, 
      password: hashedPassword, 
      role, 
      batch_year, 
      branch, 
      profile_picture: profile_picture || '', 
      linkedin_url: linkedin_url || '', 
      current_position: current_position || '', 
      location: location || ''
    });
    
    // Save user to database
    await user.save();
    console.log('User registered successfully:', email);
    
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error: ' + err.message });
    }
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Get JWT_SECRET from environment variables or use a fallback for development
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
    
    // Log JWT_SECRET status (not the actual value)
    console.log('JWT_SECRET status:', JWT_SECRET === 'fallback_secret_key_for_development' ? 'Using fallback (not secure for production)' : 'Using environment variable');
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '1d' }
    );
    
    console.log('Login successful for user:', email);
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        batch_year: user.batch_year, 
        branch: user.branch, 
        profile_picture: user.profile_picture, 
        linkedin_url: user.linkedin_url, 
        current_position: user.current_position, 
        location: user.location 
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Get all users (with optional filters for batch and branch)
router.get('/', async (req, res) => {
  try {
    const { batch_year, branch } = req.query;
    const filter = {};
    if (batch_year) filter.batch_year = batch_year;
    if (branch) filter.branch = branch;
    const users = await User.find(filter).select('-password -messages');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
