const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasks = async (req, res) => {
  try {
    const { projectId, status, priority, assignedTo } = req.query;
    const filter = {};

    let projectIds = [];
    if (projectId) {
      const project = await Project.findOne({
        _id: projectId,
        $or: [{ owner: req.user._id }, { members: req.user._id }]
      });
      if (!project) return res.status(403).json({ message: 'Access denied' });
      projectIds = [projectId];
    } else {
      const userProjects = await Project.find({
        $or: [{ owner: req.user._id }, { members: req.user._id }]
      }).select('_id');
      projectIds = userProjects.map(p => p._id);
    }

    filter.project = { $in: projectIds };

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('project', 'title')
      .sort({ order: 1, createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });

    if (!project) return res.status(403).json({ message: 'Access denied to this project' });

    const task = await Task.create({ ...req.body, project: projectId, createdBy: req.user._id });
    await task.populate('assignedTo createdBy', 'name email');

    const io = req.app.get('io');
    io.to(projectId).emit('task-changed', { type: 'created', task });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    });

    if (!project) return res.status(403).json({ message: 'Access denied' });

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignedTo createdBy', 'name email');

    const io = req.app.get('io');
    io.to(updatedTask.project.toString()).emit('task-changed', { type: 'updated', task: updatedTask });

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    });

    if (!project) return res.status(403).json({ message: 'Access denied' });

    await Task.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    io.to(task.project.toString()).emit('task-changed', { type: 'deleted', taskId: req.params.id });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
