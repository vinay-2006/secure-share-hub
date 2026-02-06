import express from 'express';
import { register, login, adminLogin, refresh, getCurrentUser, logout, requestPasswordReset, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { registerValidation, loginValidation, requestPasswordResetValidation, resetPasswordValidation } from '../utils/validators';

const router = express.Router();

// Apply rate limiting to authentication endpoints
router.post('/register', authRateLimiter, registerValidation, register);
router.post('/login', authRateLimiter, loginValidation, login);
router.post('/admin/login', authRateLimiter, loginValidation, adminLogin);
router.post('/refresh', refresh);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', logout);

// Password reset endpoints
router.post('/password/reset-request', authRateLimiter, requestPasswordResetValidation, requestPasswordReset);
router.post('/password/reset', authRateLimiter, resetPasswordValidation, resetPassword);

export default router;
