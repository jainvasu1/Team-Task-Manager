import Project from '../models/Project.js';
import Task from '../models/Task.js';

export const createProject = async (req, res) => {
  const { name, description, members = [] } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name is required' });
  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: [...new Set([req.user._id.toString(), ...members])],
  });
  res.status(201).json(project);
};

export const listProjects = async (req, res) => {
  const filter =
    req.user.role === 'admin'
      ? {}
      : { $or: [{ createdBy: req.user._id }, { members: req.user._id }] };
  const projects = await Project.find(filter)
    .populate('members', 'name email avatar role')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(projects);
};

export const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members', 'name email avatar role')
    .populate('createdBy', 'name email');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  await Task.deleteMany({ project: project._id });
  res.json({ message: 'Project and its tasks deleted' });
};

export const addMember = async (req, res) => {
  const { userId } = req.body;
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { members: userId } },
    { new: true }
  ).populate('members', 'name email avatar role');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const removeMember = async (req, res) => {
  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { $pull: { members: req.params.userId } },
    { new: true }
  ).populate('members', 'name email avatar role');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};
