// Client API Service for Binary-Brain REST & WebSocket Backend

const API_BASE = window.location.hostname === 'localhost' && window.location.port === '5500'
  ? 'http://localhost:5000/api'
  : '/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('bb_auth_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('bb_auth_token', token);
    } else {
      localStorage.removeItem('bb_auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return data;
    } catch (err) {
      console.warn(`[API] Request to ${endpoint} failed:`, err.message);
      throw err;
    }
  }

  // --- Auth APIs ---
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async register(name, email, password, role = 'customer') {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    if (data.token) this.setToken(data.token);
    return data;
  }

  async getProfile() {
    return this.request('/auth/me');
  }

  // --- Products & Categories APIs ---
  async getCategories() {
    return this.request('/categories/categories');
  }

  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.query) query.append('query', params.query);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.minRating) query.append('minRating', params.minRating);
    if (params.inStock) query.append('inStock', 'true');
    if (params.sort) query.append('sort', params.sort);

    return this.request(`/products?${query.toString()}`);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  // --- Cart APIs ---
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeCartItem(productId) {
    return this.request(`/cart/items/${productId}`, {
      method: 'DELETE'
    });
  }

  // --- Orders & Cancellation APIs ---
  async createOrder(orderPayload) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload)
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrderById(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async cancelOrder(orderId, reason) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // --- Inventory & Admin APIs ---
  async getInventoryStatus() {
    return this.request('/inventory/status');
  }

  async restockProduct(productId, amount = 10) {
    return this.request('/inventory/restock', {
      method: 'POST',
      body: JSON.stringify({ productId, amount })
    });
  }

  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getAdminSalesReport() {
    return this.request('/admin/sales-report');
  }

  // --- AI Agent API ---
  async sendAIQuery(query, context = {}) {
    return this.request('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query, context })
    });
  }
}

export const api = new ApiClient();
