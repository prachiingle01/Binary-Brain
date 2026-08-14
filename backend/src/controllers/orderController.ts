import { Request, Response } from 'express';
import { db } from '../db/database';
import { AuthRequest } from '../middleware/auth';
import { broadcastOrderCreated, broadcastOrderStatus, broadcastOrderCancelled, broadcastInventoryAlert } from '../services/websocket';
import { OrderStatus } from '../db/models';

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const {
      customerName,
      customerEmail,
      shippingAddress,
      paymentMethod = 'CyberPay (Crypto)',
      discountCode,
      items
    } = req.body;

    const user = req.user;
    const finalCustomerName = customerName || (user ? user.name : 'Guest Customer');
    const finalCustomerEmail = customerEmail || (user ? user.email : 'guest@binarybrain.io');
    const finalAddress = shippingAddress || (user ? user.address : '104 Binary Tower, Silicon Valley');

    // If no direct items provided, checkout from current user/session cart
    let orderItems = items;
    if (!orderItems || orderItems.length === 0) {
      const sessionId = (req.headers['x-session-id'] as string) || 'guest-session';
      const cart = await db.getCart(user?.id, sessionId);
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty. Cannot checkout without items.' });
      }
      orderItems = cart.items.map(i => ({ productId: i.productId, quantity: i.quantity }));
    }

    const { order, paymentIntent } = await db.createOrder({
      userId: user?.id,
      customerName: finalCustomerName,
      customerEmail: finalCustomerEmail,
      shippingAddress: finalAddress,
      paymentMethod,
      discountCode,
      items: orderItems
    });

    // Check for low stock triggers on ordered items
    for (const item of order.items) {
      if (item.productId) {
        const prod = await db.findProductById(item.productId);
        if (prod && prod.stock <= prod.minStockThreshold) {
          broadcastInventoryAlert(prod);
        }
      }
    }

    // Broadcast WebSocket event
    broadcastOrderCreated(order);

    return res.status(201).json({
      message: 'Order created successfully',
      order,
      paymentIntent
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getOrders(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    const status = req.query.status as string;

    // If admin, can retrieve all orders or filter by user query param
    let targetUserId: string | undefined = undefined;
    if (user && user.role === 'admin') {
      targetUserId = req.query.userId as string || undefined;
    } else if (user) {
      targetUserId = user.id;
    }

    const orders = await db.getOrders(targetUserId, status);
    return res.json({ orders, count: orders.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getOrderById(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const order = await db.findOrderById(orderId.toUpperCase());

    if (!order) {
      return res.status(404).json({ error: `Order #${orderId} not found.` });
    }

    const payment = await db.findPaymentByOrderId(order.id);

    return res.json({ order, payment });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// =============================================================================
// ORDER CANCELLATION CONTROLLER
// =============================================================================
export async function cancelOrder(req: AuthRequest, res: Response) {
  try {
    const { orderId } = req.params;
    const { reason = 'Customer requested cancellation' } = req.body;

    const existingOrder = await db.findOrderById(orderId.toUpperCase());
    if (!existingOrder) {
      return res.status(404).json({ error: `Order #${orderId} not found.` });
    }

    // If authenticated as customer, verify ownership
    if (req.user && req.user.role !== 'admin' && existingOrder.userId && existingOrder.userId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to cancel this order.' });
    }

    const { order, refund } = await db.cancelOrder(orderId.toUpperCase(), reason);

    // Broadcast WebSocket updates
    broadcastOrderCancelled(order);

    return res.json({
      message: `Order #${order.id} cancelled successfully. Inventory stock restored and refund processed.`,
      order,
      refund
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

// =============================================================================
// ADMIN ORDER STATUS PROGRESSION CONTROLLER
// =============================================================================
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const updatedOrder = await db.updateOrderStatus(orderId.toUpperCase(), status as OrderStatus);

    // Broadcast WebSocket event
    broadcastOrderStatus(updatedOrder);

    return res.json({
      message: `Order #${orderId} status updated to ${status}`,
      order: updatedOrder
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
