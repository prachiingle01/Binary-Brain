import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { aiAgentEngine } from './aiAgent';
import { store } from '../db/store';

export function setupWebSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Listen to store events and broadcast order status updates
  store.on('orderUpdated', (eventData) => {
    const { order, oldStatus, newStatus } = eventData;
    
    // Broadcast to order specific room and to global stream
    io.to(`order_${order.orderId}`).emit('order:status_changed', {
      orderId: order.orderId,
      oldStatus,
      newStatus,
      order,
      timestamp: new Date().toISOString()
    });

    io.emit('notification:push', {
      id: `notif_${Date.now()}`,
      title: `Order Status Update: ${order.orderId}`,
      message: `Order #${order.orderId} moved from '${oldStatus}' to '${newStatus}'.`,
      type: 'order_status',
      orderId: order.orderId,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Join room for order notifications
    socket.on('order:subscribe', (orderId: string) => {
      const room = `order_${orderId.toUpperCase()}`;
      socket.join(room);
      console.log(`[WebSocket] Client ${socket.id} subscribed to room: ${room}`);
    });

    // Real-time Chat Handler
    socket.on('chat:message', async (data: { message: string; messageId?: string }) => {
      const userMsg = data.message || '';
      console.log(`[WebSocket] Received chat message from ${socket.id}: "${userMsg}"`);

      // Emit typing indicator
      socket.emit('chat:typing', { isTyping: true });

      try {
        // Emit tool execution step preview
        setTimeout(() => {
          socket.emit('chat:tool_step', {
            step: 'ANALYZING_INTENT',
            description: 'Analyzing natural language query & matching backend tool signature...'
          });
        }, 200);

        // Process message via AI Agent engine
        const agentResult = await aiAgentEngine.processUserMessage(userMsg);

        // Emit tool completion step
        if (agentResult.toolCallsExecuted.length > 0) {
          socket.emit('chat:tool_step', {
            step: 'TOOL_EXECUTED',
            toolCalls: agentResult.toolCallsExecuted,
            description: `Successfully executed tool calls: ${agentResult.toolCallsExecuted.map(t => t.toolName).join(', ')}`
          });
        }

        // Send final response payload
        setTimeout(() => {
          socket.emit('chat:typing', { isTyping: false });
          socket.emit('chat:response', {
            messageId: data.messageId || `msg_${Date.now()}`,
            userMessage: userMsg,
            response: agentResult,
            timestamp: new Date().toISOString()
          });
        }, 500);

      } catch (error: any) {
        socket.emit('chat:typing', { isTyping: false });
        socket.emit('chat:error', {
          error: 'Failed to process AI chat request.',
          details: error?.message || 'Unknown error'
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
