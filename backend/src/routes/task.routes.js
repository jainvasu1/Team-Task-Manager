import { Router } from 'express';
import {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  dashboardStats,
} from '../controllers/task.controller.js';
import { protect, requireRole } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);

router.get('/stats', dashboardStats);
router.get('/', listTasks);
router.post('/', requireRole('admin'), createTask);
router.get('/:id', getTask);
router.patch('/:id', updateTask);
router.delete('/:id', requireRole('admin'), deleteTask);

export default router;
