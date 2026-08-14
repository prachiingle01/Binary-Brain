import { Router } from 'express';
import { register, login, getProfile, updateProfile, getAllUsers, getUserById } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// User Management (Admin)
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.get('/users/:id', authenticateToken, requireAdmin, getUserById);

export default router;
