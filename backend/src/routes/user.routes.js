import { Router } from 'express';
import { listUsers } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.use(protect);
router.get('/', listUsers);
export default router;
