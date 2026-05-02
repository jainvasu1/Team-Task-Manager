import { Router } from 'express';
import { signup, login, me, resetPassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/reset-password', resetPassword);
export default router;
