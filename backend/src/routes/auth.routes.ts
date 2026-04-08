import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

router.post('/login',         authLimiter,  login);
router.get('/me',             authenticate, getMe);
router.post('/logout',        authenticate, logout);

export default router;
