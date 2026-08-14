import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Order, Product } from '../db/models';
import { executeAgentQuery } from './aiAgent';

let ioInstance: SocketIOServer | null = null;

export function initWebSocketServer(httpServer: HTTPServer): SocketIOServer {
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
  });

  ioInstance.on('connection', (socket: Socket) => {
    console.log(`🔌 Client connected via Socket.IO: ${socket.id}`);

    // Join specific order tracking room
    socket.on('join_order_room', (orderId: string) => {
      socket.join(`order_${orderId}`);
      console.log(`📦 Socket ${socket.id} joined tracking room: order_${orderId}`);
    });

    // Join admin telemetry room
    socket.on('join_admin_room', () => {
      socket.join('admin_channel');
      console.log(`⚙️ Socket ${socket.id} joined admin telemetry room.`);
    });

    // Real-Time AI Chat over WebSocket
    socket.on('ai_query', async (data: { query: string; context?: any }) => {
      try {
        socket.emit('ai_typing', { status: true });
        const response = await executeAgentQuery(data.query, data.context);
        socket.emit('ai_typing', { status: false });
        socket.emit('ai_response', response);
      } catch (err: any) {
        socket.emit('ai_typing', { status: false });
        socket.emit('ai_response', {
          reply: `An error occurred while processing your request: ${err.message}`,
          toolExecuted: null,
          toolOutput: null
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
}

export function getIO(): SocketIOServer | null {
  return ioInstance;
}

// Broadcast Helpers
export function broadcastOrderCreated(order: Order) {
  if (!ioInstance) return;
  ioInstance.emit('order:created', order);
  ioInstance.to('admin_channel').emit('admin:new_order', order);
}

export function broadcastOrderStatus(order: Order) {
  if (!ioInstance) return;
  ioInstance.to(`order_${order.id}`).emit('order:status_updated', order);
  ioInstance.emit('order:status_updated', order);
  ioInstance.to('admin_channel').emit('admin:order_updated', order);
}

export function broadcastOrderCancelled(order: Order) {
  if (!ioInstance) return;
  ioInstance.to(`order_${order.id}`).emit('order:cancelled', order);
  ioInstance.emit('order:cancelled', order);
  ioInstance.to('admin_channel').emit('admin:order_cancelled', order);
}

export function broadcastInventoryAlert(product: Product) {
  if (!ioInstance) return;
  ioInstance.to('admin_channel').emit('inventory:low_stock', {
    productId: product.id,
    name: product.name,
    stock: product.stock,
    minStockThreshold: product.minStockThreshold,
    message: `⚠️ Low Stock Warning: "${product.name}" has only ${product.stock} units left.`
  });
  ioInstance.emit('inventory:stock_updated', product);
}

export function broadcastRestock(product: Product, amount: number) {
  if (!ioInstance) return;
  ioInstance.to('admin_channel').emit('inventory:restocked', {
    productId: product.id,
    name: product.name,
    addedAmount: amount,
    newStock: product.stock,
    message: `⚡ Restock Triggered: Added ${amount} units to "${product.name}". New stock: ${product.stock}`
  });
  ioInstance.emit('inventory:stock_updated', product);
}
