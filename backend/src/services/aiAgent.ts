import { db } from '../db/database';
import { Product, Order } from '../db/models';
import { broadcastOrderCancelled } from './websocket';

export interface AgentResult {
  reply: string;
  toolExecuted: string | null;
  toolOutput: any;
  confidence: number;
}

export async function executeAgentQuery(query: string, context?: any): Promise<AgentResult> {
  const q = query.trim().toLowerCase();

  // 1. ORDER CANCELLATION TOOL
  if (
    (q.includes('cancel') || q.includes('stop order') || q.includes('abort order')) &&
    (q.match(/ord-\d+/i) || q.match(/\b\d{4}\b/))
  ) {
    const orderMatch = query.match(/ORD-\d+/i) || query.match(/\b\d{4}\b/);
    const orderId = orderMatch ? (orderMatch[0].startsWith('ORD-') ? orderMatch[0].toUpperCase() : `ORD-${orderMatch[0]}`) : '';

    try {
      const { order, refund } = await db.cancelOrder(orderId, 'Cancelled via Autonomous AI Agent');
      broadcastOrderCancelled(order);

      return {
        reply: `✅ Successfully cancelled Order **#${order.id}**! All items have been restored to warehouse stock, and a full refund of **$${order.totalAmount.toFixed(2)}** has been initiated.`,
        toolExecuted: 'cancelOrder',
        toolOutput: { order, refund },
        confidence: 0.98
      };
    } catch (err: any) {
      return {
        reply: `⚠️ Unable to cancel Order **#${orderId}**: ${err.message}`,
        toolExecuted: 'cancelOrder',
        toolOutput: { error: err.message, orderId },
        confidence: 0.95
      };
    }
  }

  // 2. ORDER LOOKUP TOOL
  if (q.includes('order') || q.includes('track') || q.includes('where is') || q.includes('delivery') || q.match(/ord-\d+/i)) {
    const orderMatch = query.match(/ORD-\d+/i) || query.match(/\b\d{4}\b/);
    let targetOrder: Order | null = null;

    if (orderMatch) {
      const orderId = orderMatch[0].startsWith('ORD-') ? orderMatch[0].toUpperCase() : `ORD-${orderMatch[0]}`;
      targetOrder = await db.findOrderById(orderId);
    } else if (context?.userId) {
      const userOrders = await db.getOrders(context.userId);
      if (userOrders.length > 0) targetOrder = userOrders[0];
    } else {
      const allOrders = await db.getOrders();
      if (allOrders.length > 0) targetOrder = allOrders[0];
    }

    if (targetOrder) {
      const itemsList = targetOrder.items.map(i => `${i.quantity}x ${i.productName}`).join(', ');
      return {
        reply: `📦 Order **#${targetOrder.id}** is currently **${targetOrder.status}** (Step ${targetOrder.trackingStep + 1}/5). Estimated delivery is **${targetOrder.estimatedDelivery}** via **${targetOrder.carrier}**. Items: ${itemsList}.`,
        toolExecuted: 'lookupOrder',
        toolOutput: targetOrder,
        confidence: 0.96
      };
    }

    return {
      reply: 'I could not find an order matching that ID. Please check your order reference number (e.g. `ORD-8921`).',
      toolExecuted: 'lookupOrder',
      toolOutput: null,
      confidence: 0.85
    };
  }

  // 3. INVENTORY TELEMETRY & LOW STOCK TOOL
  if (q.includes('stock') || q.includes('inventory') || q.includes('warehouse') || q.includes('depletion')) {
    const telemetry = await db.getInventoryTelemetry();
    if (q.includes('low') || q.includes('alert') || q.includes('critical') || q.includes('warning')) {
      const low = telemetry.lowStockItems;
      if (low.length > 0) {
        const names = low.map(p => `• **${p.name}** (Stock: ${p.stock}, Threshold: ${p.minStockThreshold})`).join('\n');
        return {
          reply: `⚠️ **Inventory Telemetry Alert**: Found ${low.length} product(s) below threshold:\n${names}\n\nAutomated supplier restock orders have been queued.`,
          toolExecuted: 'checkInventoryTelemetry',
          toolOutput: telemetry,
          confidence: 0.95
        };
      }
      return {
        reply: `🟢 All inventory stock levels are currently healthy! Total units in stock: **${telemetry.totalUnitsInStock}**.`,
        toolExecuted: 'checkInventoryTelemetry',
        toolOutput: telemetry,
        confidence: 0.92
      };
    }

    return {
      reply: `📊 **Warehouse Overview**: ${telemetry.totalProducts} active products, ${telemetry.totalUnitsInStock} total units in stock. Overall Inventory Health Score is **${telemetry.healthScore}**.`,
      toolExecuted: 'checkInventoryTelemetry',
      toolOutput: telemetry,
      confidence: 0.9
    };
  }

  // 4. PRODUCT RECOMMENDATION & SEARCH TOOL
  if (
    q.includes('headset') ||
    q.includes('chip') ||
    q.includes('sensor') ||
    q.includes('drone') ||
    q.includes('wearable') ||
    q.includes('under') ||
    q.includes('price') ||
    q.includes('recommend') ||
    q.includes('product') ||
    q.includes('buy')
  ) {
    let maxPrice: number | undefined;
    const priceMatch = query.match(/\$?\s?(\d+)/);
    if (q.includes('under') && priceMatch) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    let category: string | undefined;
    if (q.includes('neural') || q.includes('headset') || q.includes('bci') || q.includes('glove')) category = 'neural';
    if (q.includes('chip') || q.includes('tensor') || q.includes('crypto')) category = 'chips';
    if (q.includes('wearable') || q.includes('visor') || q.includes('ring')) category = 'wearables';
    if (q.includes('sensor') || q.includes('lidar')) category = 'sensors';
    if (q.includes('drone') || q.includes('uav')) category = 'drones';

    const { products } = await db.getProducts({
      category,
      maxPrice,
      sort: 'rating',
      limit: 3
    });

    if (products.length > 0) {
      const prodsList = products.map(p => `• **${p.name}** ($${p.price}) — ${p.rating}★ rating (${p.stock} in stock)`).join('\n');
      return {
        reply: `Here are our top recommended hardware products matching your search:\n${prodsList}`,
        toolExecuted: 'searchProducts',
        toolOutput: products,
        confidence: 0.94
      };
    }
  }

  // 5. STORE POLICY & CANCELLATION RULES
  if (q.includes('policy') || q.includes('refund') || q.includes('return') || q.includes('shipping fee')) {
    return {
      reply: `📋 **Binary-Brain Store Policies**:\n• **Order Cancellations:** Orders in *Processing* or *Pending* status can be cancelled instantly with automated full refunds.\n• **Shipping:** Free drone delivery on orders over $500. Standard shipping is $25.\n• **Warranty:** All neural hardware and edge AI chips include a 2-year warranty with 24/7 telemetry support.`,
      toolExecuted: 'getStorePolicy',
      toolOutput: { cancellationWindow: 'Before dispatch', warrantyYears: 2, freeShippingThreshold: 500 },
      confidence: 0.95
    };
  }

  // Default Conversational Answer
  return {
    reply: `I have analyzed your query: "${query}". As Binary-Brain's Autonomous Agent, I can help you search hardware, check inventory telemetry, track orders, or instantly cancel orders eligible for refund. What would you like me to do?`,
    toolExecuted: null,
    toolOutput: null,
    confidence: 0.8
  };
}
