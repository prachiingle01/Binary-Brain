import { Request, Response } from 'express';
import { store } from '../db/store';
import { Order } from '../config/seedData';

export const getOrders = (req: Request, res: Response) => {
  try {
    const orders = store.getAllOrders();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrderById = (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = store.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order with ID '${orderId}' not found.`
      });
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOrderStatus = (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status, customNote } = req.body as { status: Order['status']; customNote?: string };

    const validStatuses: Order['status'][] = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updatedOrder = store.updateOrderStatus(orderId, status, customNote);
    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: `Order '${orderId}' not found.` });
    }

    res.json({
      success: true,
      message: `Order status updated to '${status}' successfully.`,
      data: updatedOrder
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
