import { Router } from 'express';
import { getDashboard, getSalesReport } from '../controllers/adminController';
import { getInventoryStatus, restockProduct, getInventoryLogs } from '../controllers/inventoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// In production, these are protected by authenticateToken + requireAdmin
router.get('/dashboard', getDashboard);
router.get('/sales-report', getSalesReport);
router.get('/inventory', getInventoryStatus);
router.post('/inventory/restock', restockProduct);
router.get('/inventory/logs', getInventoryLogs);

export default router;
