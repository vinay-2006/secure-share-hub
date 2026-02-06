import express from 'express';
import { register, login, adminLogin, refresh, getCurrentUser, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { registerValidation, loginValidation } from '../utils/validators';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/admin/login', authLimiter, loginValidation, adminLogin);
router.post('/refresh', refresh);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', logout);

export default router;
