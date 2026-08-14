import { Router } from 'express';
import { getInventoryStatus, restockProduct, getInventoryLogs } from '../controllers/inventoryController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/status', getInventoryStatus);
router.post('/restock', restockProduct); // Accessible for admin restock operations
router.get('/logs', getInventoryLogs);

export default router;
