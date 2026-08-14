import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';
import { db } from '../src/db/database';

describe('Binary-Brain Enterprise E-Commerce API Test Suite', () => {
  beforeEach(() => {
    // Reset state before every test
    db.seedInMemory();
  });

  // ---------------------------------------------------------------------------
  // 1. Healthcheck
  // ---------------------------------------------------------------------------
  it('GET /api/health should return ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toContain('Binary-Brain');
  });

  // ---------------------------------------------------------------------------
  // 2. Authentication & User Management
  // ---------------------------------------------------------------------------
  describe('Authentication & User Management APIs', () => {
    it('POST /api/auth/register should create a new user and return JWT token', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Alex Mercer',
        email: 'alex@cyber.io',
        password: 'password123',
        role: 'customer'
      });

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('alex@cyber.io');
    });

    it('POST /api/auth/login should authenticate valid user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'user@binarybrain.io',
        password: 'user123'
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.name).toBe('Prachi Ingle');
    });

    it('GET /api/auth/me should return user profile with valid Bearer token', async () => {
      const loginRes = await request(app).post('/api/auth/login').send({
        email: 'user@binarybrain.io',
        password: 'user123'
      });
      const token = loginRes.body.token;

      const profileRes = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.user.email).toBe('user@binarybrain.io');
      expect(profileRes.body.user.tier).toBe('Cyber Elite Member');
    });

    it('GET /api/users should allow admin access to view all registered users', async () => {
      const adminLogin = await request(app).post('/api/auth/login').send({
        email: 'admin@binarybrain.io',
        password: 'admin123'
      });
      const adminToken = adminLogin.body.token;

      const res = await request(app)
        .get('/api/users/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.users)).toBe(true);
      expect(res.body.users.length).toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Categories & Products APIs
  // ---------------------------------------------------------------------------
  describe('Product & Category APIs', () => {
    it('GET /api/categories should return all categories with product counts', async () => {
      const res = await request(app).get('/api/categories/categories');
      expect(res.status).toBe(200);
      expect(res.body.categories.length).toBeGreaterThan(0);
      expect(res.body.categories[0].productCount).toBeDefined();
    });

    it('GET /api/products should return filtered products by category and maxPrice', async () => {
      const res = await request(app).get('/api/products?category=neural&maxPrice=1000');
      expect(res.status).toBe(200);
      expect(res.body.products).toBeDefined();
      res.body.products.forEach((p: any) => {
        expect(p.categoryId).toBe('neural');
        expect(p.price).toBeLessThanOrEqual(1000);
      });
    });

    it('GET /api/products/:id should return single product details with inventory logs', async () => {
      const res = await request(app).get('/api/products/prod-1');
      expect(res.status).toBe(200);
      expect(res.body.product.name).toBe('NeuralLink BCI Headset X1');
      expect(res.body.product.specs).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Cart & CartItems APIs
  // ---------------------------------------------------------------------------
  describe('Cart & CartItems APIs', () => {
    it('POST /api/cart/items should add product to cart and compute totals', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .set('x-session-id', 'test-session-123')
        .send({ productId: 'prod-3', quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.cart.items.length).toBe(1);
      expect(res.body.cart.items[0].quantity).toBe(2);
      expect(res.body.subtotal).toBe(999); // 499.50 * 2
    });

    it('PUT /api/cart/items/:productId should update item quantity', async () => {
      await request(app)
        .post('/api/cart/items')
        .set('x-session-id', 'test-session-456')
        .send({ productId: 'prod-3', quantity: 1 });

      const updateRes = await request(app)
        .put('/api/cart/items/prod-3')
        .set('x-session-id', 'test-session-456')
        .send({ quantity: 3 });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.cart.items[0].quantity).toBe(3);
    });

    it('DELETE /api/cart should clear the cart', async () => {
      await request(app)
        .post('/api/cart/items')
        .set('x-session-id', 'test-clear')
        .send({ productId: 'prod-1', quantity: 1 });

      const clearRes = await request(app)
        .delete('/api/cart')
        .set('x-session-id', 'test-clear');

      expect(clearRes.status).toBe(200);
      expect(clearRes.body.cart.items.length).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Order Placement & Inventory Stock Deduction
  // ---------------------------------------------------------------------------
  describe('Order Creation & Inventory Stock Deduction', () => {
    it('POST /api/orders should place order and deduct stock atomically', async () => {
      const initialProd = await db.findProductById('prod-5');
      const initialStock = initialProd!.stock;

      const res = await request(app).post('/api/orders').send({
        customerName: 'Test Buyer',
        customerEmail: 'buyer@test.io',
        shippingAddress: '99 Quantum Blvd',
        paymentMethod: 'CyberPay (Crypto)',
        items: [{ productId: 'prod-5', quantity: 2 }]
      });

      expect(res.status).toBe(201);
      expect(res.body.order.id).toMatch(/^ORD-/);
      expect(res.body.order.status).toBe('Processing');
      expect(res.body.order.items.length).toBe(1);

      // Verify stock deducted
      const updatedProd = await db.findProductById('prod-5');
      expect(updatedProd!.stock).toBe(initialStock - 2);
    });

    it('POST /api/orders should reject order if requested quantity exceeds available stock', async () => {
      const res = await request(app).post('/api/orders').send({
        customerName: 'Greedy Buyer',
        customerEmail: 'greedy@test.io',
        shippingAddress: '1 Error Way',
        items: [{ productId: 'prod-4', quantity: 9999 }]
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Insufficient stock');
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Order Cancellation Logic Engine
  // ---------------------------------------------------------------------------
  describe('Order Cancellation Logic', () => {
    it('POST /api/orders/:orderId/cancel should cancel eligible order and restore stock', async () => {
      // ORD-8921 is seeded in 'Processing' status with prod-1 (1 qty) & prod-3 (1 qty)
      const initialProd1 = await db.findProductById('prod-1');
      const initialStock1 = initialProd1!.stock;

      const res = await request(app).post('/api/orders/ORD-8921/cancel').send({
        reason: 'Changed mind about the VR Visor'
      });

      expect(res.status).toBe(200);
      expect(res.body.order.status).toBe('Cancelled');
      expect(res.body.order.cancellationEligible).toBe(false);
      expect(res.body.refund).toBeDefined();

      // Check stock restored
      const updatedProd1 = await db.findProductById('prod-1');
      expect(updatedProd1!.stock).toBe(initialStock1 + 1);
    });

    it('POST /api/orders/:orderId/cancel should reject cancellation for Shipped orders', async () => {
      // ORD-7643 is seeded in 'Shipped' status
      const res = await request(app).post('/api/orders/ORD-7643/cancel').send({
        reason: 'Want to cancel late'
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('cannot be cancelled');
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Inventory Management & Restocking
  // ---------------------------------------------------------------------------
  describe('Inventory Management APIs', () => {
    it('GET /api/inventory/status should return telemetry and product list', async () => {
      const res = await request(app).get('/api/inventory/status');
      expect(res.status).toBe(200);
      expect(res.body.telemetry.totalProducts).toBeGreaterThan(0);
      expect(res.body.telemetry.healthScore).toBeDefined();
    });

    it('POST /api/inventory/restock should add stock and create audit log', async () => {
      const initialProd = await db.findProductById('prod-2');
      const initialStock = initialProd!.stock;

      const res = await request(app).post('/api/inventory/restock').send({
        productId: 'prod-2',
        amount: 15,
        reason: 'SUPPLIER_RESTOCK'
      });

      expect(res.status).toBe(200);
      expect(res.body.product.stock).toBe(initialStock + 15);
      expect(res.body.log.reason).toBe('SUPPLIER_RESTOCK');
    });
  });

  // ---------------------------------------------------------------------------
  // 8. Payment Integration APIs
  // ---------------------------------------------------------------------------
  describe('Payment Integration APIs', () => {
    it('POST /api/payments/create-intent should create payment session', async () => {
      const res = await request(app).post('/api/payments/create-intent').send({
        orderId: 'ORD-8921',
        amount: 1511.45,
        provider: 'Stripe'
      });

      expect(res.status).toBe(201);
      expect(res.body.intent.clientSecret).toBeDefined();
      expect(res.body.intent.transactionId).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // 9. Admin Sales & Analytics APIs
  // ---------------------------------------------------------------------------
  describe('Admin Sales & Analytics APIs', () => {
    it('GET /api/admin/dashboard should return complete financial KPIs', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.status).toBe(200);
      expect(res.body.stats.totalRevenue).toBeGreaterThan(0);
      expect(res.body.stats.topSellingProducts).toBeDefined();
    });

    it('GET /api/admin/sales-report should return sales breakdown', async () => {
      const res = await request(app).get('/api/admin/sales-report');
      expect(res.status).toBe(200);
      expect(res.body.summary.totalRevenue).toBeDefined();
      expect(res.body.categorySales).toBeDefined();
    });
  });

  // ---------------------------------------------------------------------------
  // 10. AI Agent Tool Execution API
  // ---------------------------------------------------------------------------
  describe('AI Agent Tool Execution API', () => {
    it('POST /api/ai/query should lookup order tracking via tool execution', async () => {
      const res = await request(app).post('/api/ai/query').send({
        query: 'Where is my order ORD-7643?'
      });

      expect(res.status).toBe(200);
      expect(res.body.toolExecuted).toBe('lookupOrder');
      expect(res.body.reply).toContain('ORD-7643');
    });

    it('POST /api/ai/query should execute order cancellation through conversational query', async () => {
      const res = await request(app).post('/api/ai/query').send({
        query: 'Please cancel my order ORD-8921 because I made an error'
      });

      expect(res.status).toBe(200);
      expect(res.body.toolExecuted).toBe('cancelOrder');
      expect(res.body.reply).toContain('cancelled Order');
    });
  });
});
