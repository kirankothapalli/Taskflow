const Project = require('../models/Project');
const Task = require('../models/Task');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate('owner', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    // Attach task stats
    const projectsWithStats = await Promise.all(
      projects.map(async (p) => {
        const tasks = await Task.find({ project: p._id });
        const completed = tasks.filter((t) => t.status === 'completed').length;
        return {
          ...p.toObject(),
          totalTasks: tasks.length,
          completedTasks: completed,
          progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
        };
      })
    );

    res.json(projectsWithStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, owner: req.user._id });
    await project.populate('owner', 'name email');
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    })
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found' });

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ order: 1 });

    const completed = tasks.filter((t) => t.status === 'completed').length;

    res.json({
      ...project.toObject(),
      tasks,
      totalTasks: tasks.length,
      completedTasks: completed,
      progress: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('owner members', 'name email');

    if (!project) return res.status(404).json({ message: 'Project not found or not authorized' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!project) return res.status(404).json({ message: 'Project not found or not authorized' });

    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProjects, createProject, getProject, updateProject, deleteProject };
