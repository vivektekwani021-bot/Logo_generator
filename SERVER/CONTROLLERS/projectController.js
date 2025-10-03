const Project = require('../models/Project');

// @desc    Get user's projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Save a new project
// @route   POST /api/projects
// @access  Private
const saveProject = async (req, res) => {
  const { name, designState } = req.body;

  try {
    const newProject = new Project({
      name,
      designState,
      user: req.user.id,
    });

    const project = await newProject.save();
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  const { name, designState } = req.body;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Make sure user owns the project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    project.name = name || project.name;
    project.designState = designState || project.designState;
    project.updatedAt = Date.now();

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Make sure user owns the project
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await project.deleteOne(); // Use deleteOne() for Mongoose v6+

    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
};
