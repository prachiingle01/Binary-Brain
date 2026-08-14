import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart
} from '../controllers/cartController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.get('/', getCart);
router.post('/items', addItemToCart);
router.put('/items/:productId', updateCartItemQuantity);
router.delete('/items/:productId', removeItemFromCart);
router.delete('/', clearCart);

export default router;
