import { INITIAL_PRODUCTS, INITIAL_ORDERS, Product, Order, TrackingStep } from '../config/seedData';
import { EventEmitter } from 'events';

class StoreManager extends EventEmitter {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();

  constructor() {
    super();
    // Seed initial data
    INITIAL_PRODUCTS.forEach(p => this.products.set(p.id, p));
    INITIAL_ORDERS.forEach(o => this.orders.set(o.orderId, o));
  }

  // Products API
  getAllProducts(): Product[] {
    return Array.from(this.products.values());
  }

  getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  searchProducts(query?: string, maxPrice?: number, category?: string, tags?: string[]): Product[] {
    let result = this.getAllProducts();

    if (category && category !== 'All') {
      result = result.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (maxPrice && maxPrice > 0) {
      result = result.filter(p => p.price <= maxPrice);
    }

    if (tags && tags.length > 0) {
      result = result.filter(p => tags.some(t => p.tags.includes(t.toLowerCase())));
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  }

  // Orders API
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getOrderById(orderId: string): Order | undefined {
    const cleanId = orderId.trim().toUpperCase();
    // Try exact match or match digits (e.g. "1001" -> "ORD-1001")
    if (this.orders.has(cleanId)) return this.orders.get(cleanId);
    
    for (const [id, order] of this.orders.entries()) {
      if (id.toUpperCase() === cleanId || id.endsWith(cleanId) || cleanId.endsWith(id)) {
        return order;
      }
    }
    return undefined;
  }

  findOrdersByCustomer(query: string): Order[] {
    const q = query.toLowerCase();
    return this.getAllOrders().filter(o => 
      o.customerName.toLowerCase().includes(q) || 
      o.customerEmail.toLowerCase().includes(q) ||
      o.orderId.toLowerCase().includes(q)
    );
  }

  updateOrderStatus(orderId: string, newStatus: Order['status'], customNote?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const oldStatus = order.status;
    order.status = newStatus;

    // Update tracking steps dynamically based on current status
    const statusMap: Record<string, number> = {
      'Pending': 0,
      'Order Placed': 0,
      'Processing': 1,
      'Shipped': 2,
      'Out for Delivery': 3,
      'Delivered': 4,
      'Cancelled': -1
    };

    const targetIdx = statusMap[newStatus] ?? 0;
    const nowStr = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' });

    order.trackingHistory.forEach((step, idx) => {
      if (idx <= targetIdx && targetIdx >= 0) {
        if (!step.completed) {
          step.completed = true;
          step.timestamp = nowStr;
          if (customNote) step.description = customNote;
        }
      }
    });

    if (newStatus === 'Delivered') {
      order.estimatedDelivery = 'Delivered Today';
    } else if (newStatus === 'Shipped') {
      order.estimatedDelivery = 'Within 1-2 Business Days';
    }

    this.orders.set(order.orderId, order);

    // Emit live socket event
    this.emit('orderUpdated', {
      order,
      oldStatus,
      newStatus,
      timestamp: new Date().toISOString()
    });

    return order;
  }
}

export const store = new StoreManager();
