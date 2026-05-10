import Task from '../models/Task.js';
import Project from '../models/Project.js';

// Add a new task to a project
export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, projectId, assignedTo } = req.body;

    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      project: projectId,
      assignedTo: assignedTo || null 
    });

    // Automatically sync assigned user to project members
    if (assignedTo) {
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { members: assignedTo }
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// Get all tasks for a project
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email');

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error loading tasks' });
  }
};

// Update status (Drag and drop or manual)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Permission check: Assigned user or Admin only
    const isOwner = task.assignedTo?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'Admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
};