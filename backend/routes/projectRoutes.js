import express from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get projects for the current user
router.get('/', protect, getProjects);

// Create new project - Admin only
router.post('/', protect, admin, createProject);

export default router;