import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Auth endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);

// Get list of users for assignment (Admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    // Find users and exclude password field
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;