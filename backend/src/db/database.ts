import { Pool } from 'pg';
import {
  User,
  Category,
  Product,
  Cart,
  CartItem,
  Order,
  OrderItem,
  InventoryLog,
  Payment,
  ProductQueryParams,
  OrderStatus
} from './models';
import {
  SEED_USERS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_ORDERS,
  SEED_INVENTORY_LOGS,
  SEED_PAYMENTS
} from '../config/seedData';

class DatabaseStore {
  private pgPool: Pool | null = null;
  private isPostgresConnected = false;

  // In-Memory Relational Tables
  private users: Map<string, User> = new Map();
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private carts: Map<string, Cart> = new Map();
  private orders: Map<string, Order> = new Map();
  private inventoryLogs: InventoryLog[] = [];
  private payments: Map<string, Payment> = new Map();

  constructor() {
    this.seedInMemory();
    this.initPostgres();
  }

  public seedInMemory() {
    this.users.clear();
    this.categories.clear();
    this.products.clear();
    this.carts.clear();
    this.orders.clear();
    this.inventoryLogs = [];
    this.payments.clear();

    // Populate Users
    SEED_USERS.forEach(u => this.users.set(u.id, { ...u }));

    // Populate Categories
    SEED_CATEGORIES.forEach(c => this.categories.set(c.id, { ...c }));

    // Populate Products
    SEED_PRODUCTS.forEach(p => this.products.set(p.id, { ...p, specs: { ...p.specs } }));

    // Populate Orders & line items
    SEED_ORDERS.forEach(o => {
      this.orders.set(o.id, {
        ...o,
        items: o.items.map(i => ({ ...i }))
      });
    });

    // Populate Inventory Logs
    this.inventoryLogs = [...SEED_INVENTORY_LOGS];

    // Populate Payments
    SEED_PAYMENTS.forEach(pay => this.payments.set(pay.id, { ...pay }));

    // Initial default cart for demo customer
    const demoCartId = 'cart-cust-1';
    const firstProduct = SEED_PRODUCTS[0];
    this.carts.set(demoCartId, {
      id: demoCartId,
      userId: 'usr-cust-1',
      sessionId: 'sess-default-1',
      items: [
        {
          id: 'citem-1',
          cartId: demoCartId,
          productId: firstProduct.id,
          quantity: 1,
          unitPrice: firstProduct.price,
          product: { ...firstProduct },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  private async initPostgres() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log('ℹ️  No DATABASE_URL provided. Running with High-Performance Relational In-Memory Store.');
      return;
    }

    try {
      this.pgPool = new Pool({
        connectionString: dbUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
      });

      const client = await this.pgPool.connect();
      this.isPostgresConnected = true;
      console.log('✅ Connected to PostgreSQL Database successfully.');
      client.release();
    } catch (err: any) {
      console.warn(`⚠️  PostgreSQL connection failed: ${err.message}. Falling back to In-Memory Relational Engine.`);
      this.isPostgresConnected = false;
    }
  }

  // ===========================================================================
  // USER REPOSITORY
  // ===========================================================================
  public async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const norm = email.trim().toLowerCase();
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === norm) return u;
    }
    return null;
  }

  public async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const id = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const newUser: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.users.set(id, newUser);
    return newUser;
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.users.set(id, updated);
    return updated;
  }

  public async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).map(u => ({
      ...u,
      passwordHash: '[PROTECTED]'
    }));
  }

  // ===========================================================================
  // CATEGORY REPOSITORY
  // ===========================================================================
  public async getAllCategories(): Promise<(Category & { productCount: number })[]> {
    return Array.from(this.categories.values()).map(cat => {
      const productCount = Array.from(this.products.values()).filter(
        p => p.categoryId === cat.id && p.isActive
      ).length;
      return { ...cat, productCount };
    });
  }

  public async findCategoryById(id: string): Promise<Category | null> {
    return this.categories.get(id) || null;
  }

  public async createCategory(data: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const id = data.slug || `cat-${Date.now()}`;
    const newCat: Category = {
      ...data,
      id,
      createdAt: new Date().toISOString()
    };
    this.categories.set(id, newCat);
    return newCat;
  }

  public async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const cat = this.categories.get(id);
    if (!cat) return null;
    const updated: Category = { ...cat, ...updates };
    this.categories.set(id, updated);
    return updated;
  }

  public async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // ===========================================================================
  // PRODUCT REPOSITORY
  // ===========================================================================
  public async getProducts(params: ProductQueryParams = {}): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let list = Array.from(this.products.values()).filter(p => p.isActive);

    // Search query filter
    if (params.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryId.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (params.category && params.category !== 'all') {
      list = list.filter(p => p.categoryId.toLowerCase() === params.category!.toLowerCase());
    }

    // Min Price
    if (params.minPrice !== undefined) {
      list = list.filter(p => p.price >= params.minPrice!);
    }

    // Max Price
    if (params.maxPrice !== undefined) {
      list = list.filter(p => p.price <= params.maxPrice!);
    }

    // Min Rating
    if (params.minRating !== undefined) {
      list = list.filter(p => p.rating >= params.minRating!);
    }

    // In Stock Only
    if (params.inStock) {
      list = list.filter(p => p.stock > 0);
    }

    // Sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price_asc':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          list.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          list.sort((a, b) => b.rating - a.rating);
          break;
        case 'stock':
          list.sort((a, b) => b.stock - a.stock);
          break;
        case 'newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }
    }

    const total = list.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 50);
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page,
      limit,
      totalPages
    };
  }

  public async findProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  public async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, newProduct);

    // Initial inventory log
    this.createInventoryLog({
      productId: id,
      changeAmount: data.stock,
      previousStock: 0,
      newStock: data.stock,
      reason: 'ADJUSTMENT',
      notes: 'Initial stock intake upon product creation'
    });

    return newProduct;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const prod = this.products.get(id);
    if (!prod) return null;

    if (updates.stock !== undefined && updates.stock !== prod.stock) {
      const diff = updates.stock - prod.stock;
      this.createInventoryLog({
        productId: id,
        changeAmount: diff,
        previousStock: prod.stock,
        newStock: updates.stock,
        reason: 'ADJUSTMENT',
        notes: 'Admin manual stock level update'
      });
    }

    const updated: Product = {
      ...prod,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.products.set(id, updated);
    return updated;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const prod = this.products.get(id);
    if (!prod) return false;
    prod.isActive = false;
    prod.updatedAt = new Date().toISOString();
    return true;
  }

  // ===========================================================================
  // CART & CART_ITEMS REPOSITORY
  // ===========================================================================
  public async getCart(userId?: string, sessionId?: string): Promise<Cart> {
    let cart: Cart | undefined;

    for (const c of this.carts.values()) {
      if (userId && c.userId === userId) {
        cart = c;
        break;
      }
      if (sessionId && c.sessionId === sessionId) {
        cart = c;
        break;
      }
    }

    if (!cart) {
      const id = `cart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      cart = {
        id,
        userId,
        sessionId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.carts.set(id, cart);
    }

    // Refresh embedded product details
    cart.items = cart.items.map(item => {
      const p = this.products.get(item.productId);
      return {
        ...item,
        unitPrice: p ? p.price : item.unitPrice,
        product: p ? { ...p } : undefined
      };
    });

    return cart;
  }

  public async addItemToCart(
    userId: string | undefined,
    sessionId: string | undefined,
    productId: string,
    quantity: number = 1
  ): Promise<{ cart: Cart; message?: string }> {
    const product = this.products.get(productId);
    if (!product || !product.isActive) {
      throw new Error('Product not found or unavailable');
    }

    const cart = await this.getCart(userId, sessionId);
    const existingIndex = cart.items.findIndex(i => i.productId === productId);

    const currentQty = existingIndex > -1 ? cart.items[existingIndex].quantity : 0;
    const targetQty = currentQty + quantity;

    if (targetQty > product.stock) {
      throw new Error(`Cannot add requested quantity. Only ${product.stock} units available in stock.`);
    }

    const now = new Date().toISOString();
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = targetQty;
      cart.items[existingIndex].updatedAt = now;
    } else {
      cart.items.push({
        id: `citem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cartId: cart.id,
        productId,
        quantity: targetQty,
        unitPrice: product.price,
        product: { ...product },
        createdAt: now,
        updatedAt: now
      });
    }

    cart.updatedAt = now;
    return { cart };
  }

  public async updateCartItemQuantity(
    userId: string | undefined,
    sessionId: string | undefined,
    productId: string,
    quantity: number
  ): Promise<Cart> {
    const cart = await this.getCart(userId, sessionId);
    const product = this.products.get(productId);

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.productId !== productId);
      cart.updatedAt = new Date().toISOString();
      return cart;
    }

    if (product && quantity > product.stock) {
      throw new Error(`Insufficient stock. Only ${product.stock} units available.`);
    }

    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      item.updatedAt = new Date().toISOString();
      cart.updatedAt = new Date().toISOString();
    }

    return cart;
  }

  public async removeItemFromCart(
    userId: string | undefined,
    sessionId: string | undefined,
    productId: string
  ): Promise<Cart> {
    const cart = await this.getCart(userId, sessionId);
    cart.items = cart.items.filter(i => i.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  public async clearCart(userId?: string, sessionId?: string): Promise<Cart> {
    const cart = await this.getCart(userId, sessionId);
    cart.items = [];
    cart.updatedAt = new Date().toISOString();
    return cart;
  }

  // ===========================================================================
  // ORDER & CANCELLATION REPOSITORY
  // ===========================================================================
  public async createOrder(orderPayload: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    paymentMethod: string;
    discountCode?: string;
    items: { productId: string; quantity: number }[];
  }): Promise<{ order: Order; paymentIntent?: Payment }> {
    if (!orderPayload.items || orderPayload.items.length === 0) {
      throw new Error('Cannot create order with an empty item list.');
    }

    // 1. Verify Stock for all items atomically
    for (const item of orderPayload.items) {
      const p = this.products.get(item.productId);
      if (!p || !p.isActive) {
        throw new Error(`Product ID ${item.productId} is not available.`);
      }
      if (p.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${p.name}". Requested: ${item.quantity}, Available: ${p.stock}`);
      }
    }

    // 2. Compute Financials & Deduct Stock
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of orderPayload.items) {
      const p = this.products.get(item.productId)!;
      const prevStock = p.stock;
      p.stock -= item.quantity;
      p.updatedAt = now;

      const lineTotal = p.price * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        id: `item-${orderId}-${item.productId}`,
        orderId,
        productId: p.id,
        productName: p.name,
        productImage: p.image,
        unitPrice: p.price,
        quantity: item.quantity,
        totalPrice: lineTotal,
        createdAt: now
      });

      // Audit Log stock deduction
      this.createInventoryLog({
        productId: p.id,
        changeAmount: -item.quantity,
        previousStock: prevStock,
        newStock: p.stock,
        reason: 'ORDER_FULFILLMENT',
        orderId,
        notes: `Order #${orderId} fulfilled. Deducted ${item.quantity} units.`
      });
    }

    const taxAmount = Number((subtotal * 0.08).toFixed(2));
    const shippingFee = subtotal > 500 ? 0 : 25;
    const discountAmount =
      orderPayload.discountCode?.toUpperCase() === 'BINARY10'
        ? Number(((subtotal + taxAmount + shippingFee) * 0.1).toFixed(2))
        : 0;
    const totalAmount = Number((subtotal + taxAmount + shippingFee - discountAmount).toFixed(2));

    const newOrder: Order = {
      id: orderId,
      userId: orderPayload.userId,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount,
      shippingFee,
      discountAmount,
      totalAmount,
      status: 'Processing',
      shippingAddress: orderPayload.shippingAddress,
      paymentMethod: orderPayload.paymentMethod || 'CyberPay (Crypto)',
      paymentStatus: 'Paid',
      trackingStep: 1,
      carrier: 'AeroBot Logistics #442',
      trackingNumber: `TRK-AB-${orderId.replace('ORD-', '')}-${Math.floor(10 + Math.random() * 90)}`,
      estimatedDelivery: '3 Days from today',
      cancellationEligible: true,
      items: orderItems,
      createdAt: now,
      updatedAt: now
    };

    this.orders.set(orderId, newOrder);

    // Create Initial Payment Record
    const payment = await this.createPayment({
      orderId,
      amount: totalAmount,
      currency: 'USD',
      provider: orderPayload.paymentMethod.includes('Crypto') ? 'CyberPay' : 'Card',
      status: 'Completed',
      paymentDetails: { method: orderPayload.paymentMethod }
    });

    // Clear cart if associated
    if (orderPayload.userId) {
      await this.clearCart(orderPayload.userId);
    }

    return { order: newOrder, paymentIntent: payment };
  }

  public async getOrders(userId?: string, status?: string): Promise<Order[]> {
    let list = Array.from(this.orders.values());
    if (userId) {
      list = list.filter(o => o.userId === userId || o.customerEmail === userId);
    }
    if (status && status !== 'all') {
      list = list.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async findOrderById(orderId: string): Promise<Order | null> {
    return this.orders.get(orderId) || null;
  }

  // ===========================================================================
  // ORDER CANCELLATION LOGIC ENGINE
  // ===========================================================================
  public async cancelOrder(
    orderId: string,
    reason: string = 'Customer requested cancellation'
  ): Promise<{ order: Order; refund: Payment | null }> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order #${orderId} does not exist.`);
    }

    // Validation: Cancellation eligibility check
    if (order.status === 'Cancelled' || order.status === 'Refunded') {
      throw new Error(`Order #${orderId} has already been cancelled.`);
    }

    if (order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered') {
      throw new Error(
        `Order #${orderId} cannot be cancelled because it is already in status "${order.status}". Please request a return after delivery.`
      );
    }

    const now = new Date().toISOString();

    // 1. Restore Inventory Stock for every product in order
    for (const item of order.items) {
      if (item.productId) {
        const p = this.products.get(item.productId);
        if (p) {
          const prevStock = p.stock;
          p.stock += item.quantity;
          p.updatedAt = now;

          // Record stock restoration in inventory audit log
          this.createInventoryLog({
            productId: p.id,
            changeAmount: item.quantity,
            previousStock: prevStock,
            newStock: p.stock,
            reason: 'ORDER_CANCELLATION',
            orderId: order.id,
            notes: `Restored ${item.quantity} units due to order cancellation (${reason})`
          });
        }
      }
    }

    // 2. Process Refund
    let refundPayment: Payment | null = null;
    const existingPayment = Array.from(this.payments.values()).find(p => p.orderId === orderId);

    if (existingPayment) {
      existingPayment.status = 'Refunded';
      existingPayment.updatedAt = now;
      refundPayment = existingPayment;
    }

    // 3. Update Order Record
    order.status = 'Cancelled';
    order.paymentStatus = 'Refunded';
    order.cancellationEligible = false;
    order.cancellationReason = reason;
    order.cancelledAt = now;
    order.updatedAt = now;

    return { order, refund: refundPayment };
  }

  public async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error(`Order #${orderId} not found.`);
    }

    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (newStatus === 'Pending') order.trackingStep = 0;
    if (newStatus === 'Processing') order.trackingStep = 1;
    if (newStatus === 'Shipped') {
      order.trackingStep = 2;
      order.cancellationEligible = false;
    }
    if (newStatus === 'Out for Delivery') {
      order.trackingStep = 3;
      order.cancellationEligible = false;
    }
    if (newStatus === 'Delivered') {
      order.trackingStep = 4;
      order.cancellationEligible = false;
    }
    if (newStatus === 'Cancelled') {
      order.cancellationEligible = false;
    }

    return order;
  }

  // ===========================================================================
  // INVENTORY & AUDIT REPOSITORY
  // ===========================================================================
  public createInventoryLog(log: Omit<InventoryLog, 'id' | 'createdAt'>): InventoryLog {
    const newLog: InventoryLog = {
      ...log,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.inventoryLogs.unshift(newLog);
    return newLog;
  }

  public async getInventoryLogs(productId?: string, limit: number = 100): Promise<InventoryLog[]> {
    let logs = [...this.inventoryLogs];
    if (productId) {
      logs = logs.filter(l => l.productId === productId);
    }
    return logs.slice(0, limit);
  }

  public async restockProduct(
    productId: string,
    amount: number = 10,
    reason: 'MANUAL_RESTOCK' | 'SUPPLIER_RESTOCK' = 'MANUAL_RESTOCK'
  ): Promise<{ product: Product; log: InventoryLog }> {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found.`);
    }

    const prevStock = product.stock;
    product.stock += amount;
    product.updatedAt = new Date().toISOString();

    const log = this.createInventoryLog({
      productId,
      changeAmount: amount,
      previousStock: prevStock,
      newStock: product.stock,
      reason,
      notes: `Restocked ${amount} units via ${reason}`
    });

    return { product, log };
  }

  public async getInventoryTelemetry(): Promise<{
    totalProducts: number;
    totalUnitsInStock: number;
    lowStockItems: Product[];
    outOfStockItems: Product[];
    healthScore: string;
  }> {
    const products = Array.from(this.products.values()).filter(p => p.isActive);
    const totalProducts = products.length;
    const totalUnitsInStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= p.minStockThreshold);
    const outOfStockItems = products.filter(p => p.stock === 0);

    const healthRatio = totalProducts > 0 ? (totalProducts - (lowStockItems.length + outOfStockItems.length)) / totalProducts : 1;
    const healthScore = `${Math.round(healthRatio * 100)}%`;

    return {
      totalProducts,
      totalUnitsInStock,
      lowStockItems,
      outOfStockItems,
      healthScore
    };
  }

  // ===========================================================================
  // PAYMENT REPOSITORY
  // ===========================================================================
  public async createPayment(data: Omit<Payment, 'id' | 'transactionId' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const id = `pay-${Date.now()}`;
    const transactionId = `TXN-${data.provider.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date().toISOString();

    const payment: Payment = {
      ...data,
      id,
      transactionId,
      createdAt: now,
      updatedAt: now
    };

    this.payments.set(id, payment);
    return payment;
  }

  public async findPaymentByOrderId(orderId: string): Promise<Payment | null> {
    for (const p of this.payments.values()) {
      if (p.orderId === orderId) return p;
    }
    return null;
  }

  // ===========================================================================
  // ADMIN SALES & ANALYTICS
  // ===========================================================================
  public async getAdminDashboardStats(): Promise<{
    totalRevenue: number;
    totalRevenueFormatted: string;
    revenueGrowth: string;
    totalOrders: number;
    activeOrdersCount: number;
    deliveredOrdersCount: number;
    cancelledOrdersCount: number;
    averageOrderValue: number;
    lowStockCount: number;
    agentAutomationsCount: number;
    topSellingProducts: { product: Product; unitsSold: number; revenue: number }[];
    categorySales: { category: string; revenue: number }[];
  }> {
    const orders = Array.from(this.orders.values());
    const validOrders = orders.filter(o => o.status !== 'Cancelled');

    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = validOrders.length > 0 ? Number((totalRevenue / validOrders.length).toFixed(2)) : 0;

    const activeOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Pending' || o.status === 'Shipped' || o.status === 'Out for Delivery').length;
    const deliveredOrdersCount = orders.filter(o => o.status === 'Delivered').length;
    const cancelledOrdersCount = orders.filter(o => o.status === 'Cancelled').length;

    const products = Array.from(this.products.values());
    const lowStockCount = products.filter(p => p.stock <= p.minStockThreshold).length;

    // Calculate product sales & category sales
    const productSalesMap = new Map<string, { units: number; rev: number }>();
    const catSalesMap = new Map<string, number>();

    validOrders.forEach(o => {
      o.items.forEach(item => {
        if (item.productId) {
          const curr = productSalesMap.get(item.productId) || { units: 0, rev: 0 };
          productSalesMap.set(item.productId, {
            units: curr.units + item.quantity,
            rev: curr.rev + item.totalPrice
          });

          const p = this.products.get(item.productId);
          if (p) {
            const catCurr = catSalesMap.get(p.categoryId) || 0;
            catSalesMap.set(p.categoryId, catCurr + item.totalPrice);
          }
        }
      });
    });

    const topSellingProducts = Array.from(productSalesMap.entries())
      .map(([prodId, sales]) => ({
        product: this.products.get(prodId)!,
        unitsSold: sales.units,
        revenue: Number(sales.rev.toFixed(2))
      }))
      .filter(item => Boolean(item.product))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const categorySales = Array.from(catSalesMap.entries()).map(([cat, rev]) => ({
      category: cat,
      revenue: Number(rev.toFixed(2))
    }));

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalRevenueFormatted: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      revenueGrowth: '+18.4% vs last month',
      totalOrders: orders.length,
      activeOrdersCount,
      deliveredOrdersCount,
      cancelledOrdersCount,
      averageOrderValue,
      lowStockCount,
      agentAutomationsCount: 142,
      topSellingProducts,
      categorySales
    };
  }
}

export const db = new DatabaseStore();
export { DatabaseStore };
