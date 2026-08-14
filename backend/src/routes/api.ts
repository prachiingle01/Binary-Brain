import { Router } from 'express';
import authRoutes from './authRoutes';
import productRoutes from './productRoutes';
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
router.use('/users', authRoutes); // User management alias
router.use('/products', productRoutes);
router.use('/categories', productRoutes); // Category alias
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

// AI Agent Assistant endpoint
router.post('/ai/query', processAIQuery);

export default router;
