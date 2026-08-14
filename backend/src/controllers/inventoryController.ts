import { Request, Response } from 'express';
import { db } from '../db/database';
import { broadcastRestock } from '../services/websocket';

export async function getInventoryStatus(req: Request, res: Response) {
  try {
    const telemetry = await db.getInventoryTelemetry();
    const { products } = await db.getProducts({ limit: 100 });

    return res.json({
      telemetry,
      products
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function restockProduct(req: Request, res: Response) {
  try {
    const { productId, amount = 10, reason = 'MANUAL_RESTOCK' } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'productId is required for restocking.' });
    }

    const { product, log } = await db.restockProduct(productId, Number(amount), reason);

    // Broadcast WebSocket alert
    broadcastRestock(product, Number(amount));

    return res.json({
      message: `Successfully restocked ${product.name} (+${amount} units).`,
      product,
      log
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function getInventoryLogs(req: Request, res: Response) {
  try {
    const productId = req.query.productId as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;

    const logs = await db.getInventoryLogs(productId, limit);
    return res.json({ logs, count: logs.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
