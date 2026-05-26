const Project = require('../models/Project');
const Task = require('../models/Task');

const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { members: userId }],
    });

    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } });

    const myTasks = await Task.find({ assignedTo: userId })
      .populate('project', 'title color')
      .sort({ deadline: 1 })
      .limit(10);

    const upcoming = await Task.find({
      project: { $in: projectIds },
      deadline: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      status: { $ne: 'completed' },
    })
      .populate('project', 'title color')
      .populate('assignedTo', 'name')
      .sort({ deadline: 1 });

    const stats = {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'active').length,
      completedProjects: projects.filter((p) => p.status === 'completed').length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t) => t.status === 'completed').length,
      inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
      todoTasks: tasks.filter((t) => t.status === 'todo').length,
    };

    // Task distribution by priority
    const priorityChart = {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
    };

    // Weekly task completion (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const completed = tasks.filter(
        (t) =>
          t.status === 'completed' &&
          t.updatedAt >= dayStart &&
          t.updatedAt <= dayEnd
      ).length;

      weeklyData.push({
        day: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
      });
    }

    res.json({ stats, priorityChart, weeklyData, myTasks, upcoming });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboard };
