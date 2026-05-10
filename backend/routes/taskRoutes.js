import express from 'express';
import { createTask, getTasksByProject, updateTaskStatus } from '../controllers/taskController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin creates a new task
router.post('/', protect, admin, createTask);

// Fetch tasks for a specific project
router.get('/:projectId', protect, getTasksByProject);

// Update status of a task
router.put('/:id/status', protect, updateTaskStatus);

export default router;