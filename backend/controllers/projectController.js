import Project from '../models/Project.js';

// Create a new project - Only for Admins
export const createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    // Create project using the user ID from the protect middleware
    const project = await Project.create({
      title,
      description,
      owner: req.user._id, 
      members: members || [] 
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Could not create project' });
  }
};

// Fetch projects related to the logged-in user
export const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find projects where user is owner or a member
    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }]
    })
    .populate('owner', 'name email')
    .populate('members', 'name email');

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error loading projects' });
  }
};