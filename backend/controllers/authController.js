const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * REGISTER USER
 */
exports.registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      location,
      email,
      phone,
      password,
      confirmPassword
    } = req.body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !location ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (FIXED userType)
    const user = await User.create({
      firstName,
      lastName,
      location,
      email,
      phone,
      userType: 'user',
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * LOGIN USER
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const { password: pw, ...userData } = user._doc;

    res.status(200).json({
      message: 'Login successful',
      token,
      user: userData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
