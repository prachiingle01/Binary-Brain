import { store } from '../db/store';
import { Product, Order, STORE_POLICIES } from '../config/seedData';

export interface ToolCallExecution {
  toolName: string;
  parameters: Record<string, any>;
  resultSummary: string;
}

export interface AgentResponse {
  text: string;
  intent: 'ORDER_LOOKUP' | 'PRODUCT_SEARCH' | 'RECOMMENDATION' | 'ORDER_UPDATE' | 'STORE_POLICY' | 'GENERAL';
  toolCallsExecuted: ToolCallExecution[];
  payload?: {
    products?: Product[];
    order?: Order;
    orders?: Order[];
    recommendations?: Product[];
    policy?: typeof STORE_POLICIES;
  };
}

export class AIAgentEngine {
  async processUserMessage(userMessage: string): Promise<AgentResponse> {
    const text = userMessage.toLowerCase().trim();
    const toolCalls: ToolCallExecution[] = [];

    // 1. ORDER LOOKUP INTENT DETECTOR
    const orderIdMatch = text.match(/(ord-\d+|\b100[1-9]\b|\border\s+#?\s*([a-z0-9-]+))/i);
    const isOrderQuery = text.includes('order') || text.includes('track') || text.includes('package') || text.includes('delivery') || text.includes('where is my');

    if (orderIdMatch || (isOrderQuery && (text.includes('1001') || text.includes('1002') || text.includes('1003') || text.includes('status')))) {
      let rawOrderId = orderIdMatch ? (orderIdMatch[1] || orderIdMatch[2]) : '';
      if (!rawOrderId && text.includes('1001')) rawOrderId = 'ORD-1001';
      if (!rawOrderId && text.includes('1002')) rawOrderId = 'ORD-1002';
      if (!rawOrderId && text.includes('1003')) rawOrderId = 'ORD-1003';

      if (rawOrderId) {
        if (!rawOrderId.toUpperCase().startsWith('ORD-')) {
          rawOrderId = `ORD-${rawOrderId.replace(/^#/, '')}`;
        }
        
        // Execute Tool 1: lookupOrder API
        toolCalls.push({
          toolName: 'lookupOrder',
          parameters: { orderId: rawOrderId },
          resultSummary: `Invoked store.getOrderById('${rawOrderId}')`
        });

        const order = store.getOrderById(rawOrderId);
        if (order) {
          const itemsList = order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ');
          const completedSteps = order.trackingHistory.filter(s => s.completed).map(s => s.status).join(' ➔ ');

          return {
            text: `📦 **Order Found: ${order.orderId}**\n\n- **Status:** \`${order.status}\` (${order.carrier})\n- **Customer:** ${order.customerName}\n- **Tracking Number:** \`${order.trackingNumber}\`\n- **Estimated Delivery:** ${order.estimatedDelivery}\n- **Items:** ${itemsList}\n\n**Current Progress:** ${completedSteps}`,
            intent: 'ORDER_LOOKUP',
            toolCallsExecuted: toolCalls,
            payload: { order }
          };
        } else {
          return {
            text: `🔍 I searched our order database for **${rawOrderId}**, but couldn't find an active order matching that ID. Please double-check your order number (e.g., ORD-1001, ORD-1002, ORD-1003).`,
            intent: 'ORDER_LOOKUP',
            toolCallsExecuted: toolCalls
          };
        }
      } else {
        // Customer name search fallback
        const orders = store.getAllOrders();
        return {
          text: `📦 You can track any order by providing your Order ID (such as **ORD-1001** or **ORD-1002**). Here are sample orders available in your account mock environment:`,
          intent: 'ORDER_LOOKUP',
          toolCallsExecuted: toolCalls,
          payload: { orders }
        };
      }
    }

    // 2. ORDER STATUS UPDATE INTENT (ADMIN / SIMULATION)
    if ((text.includes('update') || text.includes('change') || text.includes('mark')) && text.includes('order')) {
      const targetIdMatch = text.match(/(ord-\d+|\b100[1-9]\b)/i);
      let statusTarget: Order['status'] | null = null;
      if (text.includes('shipped')) statusTarget = 'Shipped';
      else if (text.includes('delivered')) statusTarget = 'Delivered';
      else if (text.includes('processing')) statusTarget = 'Processing';
      else if (text.includes('out for delivery')) statusTarget = 'Out for Delivery';
      else if (text.includes('cancelled') || text.includes('cancel')) statusTarget = 'Cancelled';

      if (targetIdMatch && statusTarget) {
        let orderId = targetIdMatch[0].toUpperCase();
        if (!orderId.startsWith('ORD-')) orderId = `ORD-${orderId}`;

        // Execute Tool 2: updateOrderStatus API
        toolCalls.push({
          toolName: 'updateOrderStatus',
          parameters: { orderId, status: statusTarget },
          resultSummary: `Invoked store.updateOrderStatus('${orderId}', '${statusTarget}')`
        });

        const updatedOrder = store.updateOrderStatus(orderId, statusTarget);
        if (updatedOrder) {
          return {
            text: `✅ **Order ${orderId} Successfully Updated!**\nNew Status is set to **${statusTarget}**. Live WebSocket alert broadcasted to connected clients.`,
            intent: 'ORDER_UPDATE',
            toolCallsExecuted: toolCalls,
            payload: { order: updatedOrder }
          };
        }
      }
    }

    // 3. PRODUCT RECOMMENDATIONS INTENT
    if (text.includes('recommend') || text.includes('suggest') || text.includes('best') || text.includes('top rated') || text.includes('popular')) {
      toolCalls.push({
        toolName: 'recommendProducts',
        parameters: { limit: 3, queryContext: userMessage },
        resultSummary: 'Invoked store.searchProducts() with rating > 4.6 filter'
      });

      const products = store.getAllProducts().filter(p => p.rating >= 4.6).slice(0, 3);
      return {
        text: `✨ **Here are our Top AI-Recommended Products for you:**\nBased on popular customer ratings and quality verification:`,
        intent: 'RECOMMENDATION',
        toolCallsExecuted: toolCalls,
        payload: { recommendations: products }
      };
    }

    // 4. INTELLIGENT PRODUCT SEARCH INTENT
    const isProductSearch = text.includes('find') || text.includes('search') || text.includes('show') || text.includes('buy') || text.includes('looking for') || text.includes('under') || text.includes('headphone') || text.includes('monitor') || text.includes('shoe') || text.includes('sweater') || text.includes('keyboard') || text.includes('backpack');

    if (isProductSearch || text.length > 3) {
      // Parse price extraction e.g. "under 100" or "under $150"
      const priceMatch = text.match(/(under|less than|below|\$)\s*\$?(\d+)/i);
      const maxPrice = priceMatch ? parseFloat(priceMatch[2]) : undefined;

      // Execute Tool 3: searchProducts API
      toolCalls.push({
        toolName: 'searchProducts',
        parameters: { query: userMessage, maxPrice },
        resultSummary: `Invoked store.searchProducts('${userMessage}', maxPrice: ${maxPrice ?? 'none'})`
      });

      let products = store.searchProducts(userMessage, maxPrice);

      // Fallback search if strict text didn't return matches
      if (products.length === 0) {
        if (text.includes('headphone') || text.includes('audio') || text.includes('sound')) {
          products = store.searchProducts('Headphones', maxPrice);
        } else if (text.includes('monitor') || text.includes('display') || text.includes('screen') || text.includes('gaming')) {
          products = store.searchProducts('Monitor', maxPrice);
        } else if (text.includes('clothing') || text.includes('wear') || text.includes('coat') || text.includes('jacket') || text.includes('sweater')) {
          products = store.searchProducts('Sweater', maxPrice);
        } else if (text.includes('shoe') || text.includes('sneaker') || text.includes('run')) {
          products = store.searchProducts('Shoes', maxPrice);
        } else if (text.includes('bag') || text.includes('hiking') || text.includes('travel')) {
          products = store.searchProducts('Backpack', maxPrice);
        } else if (text.includes('keyboard') || text.includes('key')) {
          products = store.searchProducts('Keyboard', maxPrice);
        } else {
          products = store.getAllProducts().slice(0, 3);
        }
      }

      const count = products.length;
      const priceText = maxPrice ? ` under $${maxPrice}` : '';

      return {
        text: `🔍 **Found ${count} Product${count !== 1 ? 's' : ''} matching your search${priceText}:**`,
        intent: 'PRODUCT_SEARCH',
        toolCallsExecuted: toolCalls,
        payload: { products }
      };
    }

    // 5. STORE POLICY & GENERAL HELP INTENT
    if (text.includes('return') || text.includes('policy') || text.includes('refund')) {
      return {
        text: `🛡️ **Return Policy:**\n${STORE_POLICIES.returnPolicy}`,
        intent: 'STORE_POLICY',
        toolCallsExecuted: [],
        payload: { policy: STORE_POLICIES }
      };
    }

    if (text.includes('shipping') || text.includes('delivery time') || text.includes('how fast')) {
      return {
        text: `🚚 **Shipping Information:**\n${STORE_POLICIES.shippingInfo}`,
        intent: 'STORE_POLICY',
        toolCallsExecuted: [],
        payload: { policy: STORE_POLICIES }
      };
    }

    // Default Fallback
    return {
      text: `👋 Hello! I am your **Binary Brain Autonomous AI Assistant**. I can help you with:\n\n1. 📦 **Natural Language Order Lookup**: Ask *"Where is my order ORD-1001?"*\n2. 🔍 **Intelligent Product Search**: Ask *"Find noise-canceling headphones under $200"*\n3. ✨ **AI Recommendations**: Ask *"Recommend top tech accessories for gaming"*\n4. 🚚 **Live Order Updates**: Track real-time shipment status & carrier history.\n\nWhat can I assist you with today?`,
      intent: 'GENERAL',
      toolCallsExecuted: []
    };
  }
}

export const aiAgentEngine = new AIAgentEngine();
