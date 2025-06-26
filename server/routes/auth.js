const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later'
  }
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Normalize and validate email
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone?.trim()
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Prepare user response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt
    };

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Find user and include password for comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password +isActive');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (user.isActive === false) {
      return res.status(403).json({
        status: 'error',
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Prepare user response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      lastLogin: user.lastLogin
    };

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: userResponse,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v -resetPasswordToken -resetPasswordExpire')
      .populate('cart.product', 'name brand price images')
      .populate('savedForLater.product', 'name brand price images')
      .populate('recentlyViewed.product', 'name brand price images');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({
    status: 'success',
    message: 'Logout successful'
  });
});

module.exports = router;