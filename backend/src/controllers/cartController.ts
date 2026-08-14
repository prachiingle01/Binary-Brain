import { Response } from 'express';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/auth';

function calculateCartTotals(items: any[]) {
  const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    shipping,
    total,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0)
  };
}

export async function getCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.user ? req.user.id : undefined;
    const sessionId = (req.headers['x-session-id'] as string) || 'guest-session';

    const cart = await db.getCart(userId, sessionId);
    const totals = calculateCartTotals(cart.items);

    return res.json({
      cart,
      ...totals
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function addItemToCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.user ? req.user.id : undefined;
    const sessionId = (req.headers['x-session-id'] as string) || 'guest-session';
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required.' });
    }

    const { cart } = await db.addItemToCart(userId, sessionId, productId, Number(quantity));
    const totals = calculateCartTotals(cart.items);

    return res.status(200).json({
      message: 'Item added to cart successfully',
      cart,
      ...totals
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function updateCartItemQuantity(req: AuthRequest, res: Response) {
  try {
    const userId = req.user ? req.user.id : undefined;
    const sessionId = (req.headers['x-session-id'] as string) || 'guest-session';
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: 'quantity is required.' });
    }

    const cart = await db.updateCartItemQuantity(userId, sessionId, productId, Number(quantity));
    const totals = calculateCartTotals(cart.items);

    return res.json({
      message: 'Cart item updated',
      cart,
      ...totals
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function removeItemFromCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.user ? req.user.id : undefined;
    const sessionId = (req.headers['x-session-id'] as string) || 'guest-session';
    const { productId } = req.params;

    const cart = await db.removeItemFromCart(userId, sessionId, productId);
    const totals = calculateCartTotals(cart.items);

    return res.json({
      message: 'Item removed from cart',
      cart,
      ...totals
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function clearCart(req: AuthRequest, res: Response) {
  try {
    const userId = req.user ? req.user.id : undefined;
    const sessionId = (req.headers['x-session-id'] as string) || 'guest-session';

    const cart = await db.clearCart(userId, sessionId);
    const totals = calculateCartTotals(cart.items);

    return res.json({
      message: 'Cart cleared',
      cart,
      ...totals
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
