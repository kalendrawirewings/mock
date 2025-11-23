import User from '../models/User.js';
import {
  isEmailOrPhone,
  validatePassword,
  validateName,
} from '../utils/validation.js';

export const register = async (req, res) => {
  try {
    const { emailOrPhone, password, name } = req.body;

    if (!emailOrPhone || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: email/phone, password, and name',
      });
    }

    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({
        success: false,
        message: nameValidation.message,
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: passwordValidation.message,
      });
    }

    const { type, value } = isEmailOrPhone(emailOrPhone);

    if (!type) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide a valid email or Indian phone number (starting with +91, 91, or 10 digits starting with 6-9)',
      });
    }

    const email = type === 'email' ? value : null;
    const phone = type === 'phone' ? value : null;

    const existingUser = await User.findByEmailOrPhone(email, phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User with this ${type} already exists`,
      });
    }

    const user = await User.create({ email, phone, password, name });

    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/phone and password',
      });
    }

    const { type, value } = isEmailOrPhone(emailOrPhone);

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email or Indian phone number',
      });
    }

    const email = type === 'email' ? value : null;
    const phone = type === 'phone' ? value : null;

    const user = await User.findByEmailOrPhone(email, phone);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isValidPassword = await User.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error logging out',
      });
    }

    res.clearCookie('sessionId');
    res.json({
      success: true,
      message: 'Logout successful',
    });
  });
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Check auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
