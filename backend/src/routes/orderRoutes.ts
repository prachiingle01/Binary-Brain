import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus
} from '../controllers/orderController';
import { optionalAuth, authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, createOrder);
router.get('/', optionalAuth, getOrders);
router.get('/:orderId', getOrderById);
router.post('/:orderId/cancel', optionalAuth, cancelOrder);
router.patch('/:orderId/status', updateOrderStatus); // Also accessible by admin simulator

export default router;
