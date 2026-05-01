import { Router } from 'express';
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from '../controllers/project.controller.js';
import { protect, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);

router.get('/', listProjects);
router.post('/', requireRole('admin'), createProject);
router.get('/:id', getProject);
router.patch('/:id', requireRole('admin'), updateProject);
router.delete('/:id', requireRole('admin'), deleteProject);
router.post('/:id/members', requireRole('admin'), addMember);
router.delete('/:id/members/:userId', requireRole('admin'), removeMember);

export default router;
