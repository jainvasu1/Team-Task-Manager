import Task from '../models/Task.js';
import Project from '../models/Project.js';

export const createTask = async (req, res) => {
  const { title, description, project, assignedTo, priority, dueDate, status } = req.body;
  if (!title || !project) return res.status(400).json({ message: 'Title and project are required' });
  const exists = await Project.findById(project);
  if (!exists) return res.status(404).json({ message: 'Project not found' });
  const task = await Task.create({
    title,
    description,
    project,
    assignedTo: assignedTo || null,
    priority,
    dueDate,
    status,
    createdBy: req.user._id,
  });
  res.status(201).json(task);
};

export const listTasks = async (req, res) => {
  const { project, assignedTo, status, mine } = req.query;
  const filter = {};
  if (project) filter.project = project;
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;
  if (mine === 'true') filter.assignedTo = req.user._id;

  if (req.user.role !== 'admin' && !mine) {
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }],
    }).select('_id');
    filter.project = { $in: projects.map((p) => p._id) };
  }

  const tasks = await Task.find(filter)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'name')
    .sort({ createdAt: -1 });
  res.json(tasks);
};

export const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'name');
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const isAssignee = task.assignedTo?.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const isCreator = task.createdBy.toString() === req.user._id.toString();

  if (!isAdmin && !isCreator) {
    const onlyStatus = Object.keys(req.body).every((k) => k === 'status');
    if (!isAssignee || !onlyStatus)
      return res.status(403).json({ message: 'You can only update status of tasks assigned to you' });
  }

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
};

export const dashboardStats = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
  const [total, todo, inProgress, done, overdue] = await Promise.all([
    Task.countDocuments(filter),
    Task.countDocuments({ ...filter, status: 'todo' }),
    Task.countDocuments({ ...filter, status: 'in-progress' }),
    Task.countDocuments({ ...filter, status: 'done' }),
    Task.countDocuments({
      ...filter,
      status: { $ne: 'done' },
      dueDate: { $lt: new Date() },
    }),
  ]);
  res.json({ total, todo, inProgress, done, overdue });
};
