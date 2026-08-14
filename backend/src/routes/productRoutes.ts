import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Category Routes
router.get('/categories', getCategories);
router.post('/categories', authenticateToken, requireAdmin, createCategory);
router.put('/categories/:id', authenticateToken, requireAdmin, updateCategory);
router.delete('/categories/:id', authenticateToken, requireAdmin, deleteCategory);

// Product Routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', authenticateToken, requireAdmin, createProduct);
router.put('/products/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/products/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;
