import { Request, Response } from 'express';
import { db } from '../db/database';

export async function getDashboard(req: Request, res: Response) {
  try {
    const stats = await db.getAdminDashboardStats();
    return res.json({ stats });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getSalesReport(req: Request, res: Response) {
  try {
    const stats = await db.getAdminDashboardStats();
    const orders = await db.getOrders();

    const ordersByStatus: Record<string, number> = {};
    orders.forEach(o => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    return res.json({
      summary: {
        totalRevenue: stats.totalRevenue,
        totalOrders: stats.totalOrders,
        averageOrderValue: stats.averageOrderValue,
        ordersByStatus
      },
      topSellingProducts: stats.topSellingProducts,
      categorySales: stats.categorySales,
      recentOrders: orders.slice(0, 10)
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
