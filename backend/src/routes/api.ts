import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController';
import { getOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';
import { processAIQuery } from '../controllers/aiController';

const router = Router();

// Healthcheck
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Binary-Brain Backend', timestamp: new Date().toISOString() });
});

// Products REST API
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Orders REST API
router.get('/orders', getOrders);
router.get('/orders/:orderId', getOrderById);
router.patch('/orders/:orderId/status', updateOrderStatus);

// AI Tool Processing API
router.post('/ai/query', processAIQuery);

export default router;
