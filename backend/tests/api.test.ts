import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/server';

describe('Binary-Brain Backend API Suite', () => {

  it('GET /api/health - should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/products - should return product list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/products?query=headphones - should return matching products', async () => {
    const res = await request(app).get('/api/products?query=headphones');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].name).toContain('Headphones');
  });

  it('GET /api/orders/ORD-1001 - should return order details', async () => {
    const res = await request(app).get('/api/orders/ORD-1001');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderId).toBe('ORD-1001');
    expect(res.body.data.customerName).toBe('Alex Mercer');
  });

  it('PATCH /api/orders/ORD-1001/status - should update order status', async () => {
    const res = await request(app)
      .patch('/api/orders/ORD-1001/status')
      .send({ status: 'Out for Delivery' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('Out for Delivery');
  });

  it('POST /api/ai/query - should handle natural language order lookup', async () => {
    const res = await request(app)
      .post('/api/ai/query')
      .send({ query: 'Where is my order ORD-1002?' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.intent).toBe('ORDER_LOOKUP');
    expect(res.body.data.toolCallsExecuted.length).toBeGreaterThan(0);
    expect(res.body.data.toolCallsExecuted[0].toolName).toBe('lookupOrder');
  });

  it('POST /api/ai/query - should handle product search with price constraint', async () => {
    const res = await request(app)
      .post('/api/ai/query')
      .send({ query: 'Find wireless noise canceling headphones under 200' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.intent).toBe('PRODUCT_SEARCH');
  });

});
