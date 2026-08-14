import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import inventoryRoutes from './inventoryRoutes';
import paymentRoutes from './paymentRoutes';
import adminRoutes from './adminRoutes';
import { processAIQuery } from '../controllers/aiController';

const router = Router();

// Healthcheck
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Binary-Brain Autonomous E-Commerce Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Sub-Routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

// AI Agent Assistant endpoint
router.post('/ai/query', processAIQuery);

export default router;
