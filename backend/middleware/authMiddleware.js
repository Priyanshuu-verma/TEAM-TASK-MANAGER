import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT and protect routes
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Get token from header string
      token = authHeader.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request, skip password
      req.user = await User.findById(decoded.id).select('-password');
      
      next();
    } catch (err) {
      console.error('Auth middleware error:', err);
      res.status(401).json({ message: 'Authorization failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token, access denied' });
  }
};

// Middleware for admin-only access
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};