// Centralized Reactive Store & State Manager

import { MOCK_PRODUCTS, MOCK_USER, MOCK_ADMIN_USER, INITIAL_ORDERS, INITIAL_NOTIFICATIONS, ADMIN_STATS } from './data.js';

class StateStore {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('bb_user')) || MOCK_USER;
    this.products = JSON.parse(localStorage.getItem('bb_products')) || [...MOCK_PRODUCTS];
    this.cart = JSON.parse(localStorage.getItem('bb_cart')) || [
      { product: MOCK_PRODUCTS[0], quantity: 1 }
    ];
    this.orders = JSON.parse(localStorage.getItem('bb_orders')) || [...INITIAL_ORDERS];
    this.notifications = JSON.parse(localStorage.getItem('bb_notifications')) || [...INITIAL_NOTIFICATIONS];
    this.adminStats = { ...ADMIN_STATS };

    // Search and Filter State
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.maxPrice = 2500;
    this.minRating = 0;
    this.inStockOnly = false;
    this.sortBy = 'relevance'; // 'relevance', 'price-asc', 'price-desc', 'rating'

    // UI View State
    this.activeView = 'catalog'; // 'catalog', 'cart', 'checkout', 'orders', 'profile', 'admin'
    this.selectedProductModal = null;
    this.authModalOpen = false;
    this.authMode = 'login'; // 'login' or 'register'
    this.notificationsDrawerOpen = false;
    this.cartDrawerOpen = false;
    this.activeTrackingOrder = null;
    this.cancellationModalOrder = null;

    // Toast Queue
    this.toasts = [];

    // Event listeners array
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this._persist();
    this.subscribers.forEach(cb => cb(this));
  }

  _persist() {
    localStorage.setItem('bb_user', JSON.stringify(this.user));
    localStorage.setItem('bb_products', JSON.stringify(this.products));
    localStorage.setItem('bb_cart', JSON.stringify(this.cart));
    localStorage.setItem('bb_orders', JSON.stringify(this.orders));
    localStorage.setItem('bb_notifications', JSON.stringify(this.notifications));
  }

  // --- Auth Actions ---
  login(email, password, role = 'customer') {
    if (role === 'admin' || email.includes('admin')) {
      this.user = { ...MOCK_ADMIN_USER, email, role: 'admin' };
      this.showToast('Logged in as Administrator', 'info');
    } else {
      this.user = { ...MOCK_USER, email, role: 'customer' };
      this.showToast(`Welcome back, ${this.user.name}!`, 'success');
    }
    this.authModalOpen = false;
    this.notify();
  }

  register(name, email, password, role = 'customer') {
    this.user = {
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      address: '123 Neural Way, Cyber City',
      phone: '+1 555-900-1122',
      loyaltyPoints: 100,
      tier: 'New Agent'
    };
    this.authModalOpen = false;
    this.showToast('Account registered successfully!', 'success');
    this.notify();
  }

  logout() {
    this.user = null;
    this.showToast('Logged out successfully', 'info');
    this.notify();
  }

  // --- Navigation & View Actions ---
  navigate(viewName) {
    this.activeView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  // --- Filter Actions ---
  setSearchQuery(query) {
    this.searchQuery = query.trim().toLowerCase();
    this.notify();
  }

  setCategory(categoryId) {
    this.selectedCategory = categoryId;
    this.notify();
  }

  setMaxPrice(price) {
    this.maxPrice = Number(price);
    this.notify();
  }

  setMinRating(rating) {
    this.minRating = Number(rating);
    this.notify();
  }

  setInStockOnly(value) {
    this.inStockOnly = Boolean(value);
    this.notify();
  }

  setSortBy(sortKey) {
    this.sortBy = sortKey;
    this.notify();
  }

  getFilteredProducts() {
    return this.products.filter(p => {
      const matchesSearch = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.description.toLowerCase().includes(this.searchQuery) ||
        p.category.toLowerCase().includes(this.searchQuery);

      const matchesCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchesPrice = p.price <= this.maxPrice;
      const matchesRating = p.rating >= this.minRating;
      const matchesStock = !this.inStockOnly || p.stock > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    }).sort((a, b) => {
      if (this.sortBy === 'price-asc') return a.price - b.price;
      if (this.sortBy === 'price-desc') return b.price - a.price;
      if (this.sortBy === 'rating') return b.rating - a.rating;
      if (this.sortBy === 'stock') return b.stock - a.stock;
      return 0; // relevance
    });
  }

  // --- Cart Actions ---
  addToCart(productId, quantity = 1) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock < quantity) {
      this.showToast(`Insufficient stock! Only ${product.stock} left.`, 'error');
      return;
    }

    const existingIndex = this.cart.findIndex(item => item.product.id === productId);
    if (existingIndex > -1) {
      const newQty = this.cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        this.showToast(`Cannot add more than remaining stock (${product.stock}).`, 'warning');
        return;
      }
      this.cart[existingIndex].quantity = newQty;
    } else {
      this.cart.push({ product, quantity });
    }

    this.showToast(`Added ${product.name} to Cart`, 'success');
    this.notify();
  }

  updateCartQuantity(productId, newQty) {
    if (newQty <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const product = this.products.find(p => p.id === productId);
    if (product && newQty > product.stock) {
      this.showToast(`Only ${product.stock} available in stock.`, 'warning');
      return;
    }

    const item = this.cart.find(i => i.product.id === productId);
    if (item) {
      item.quantity = newQty;
      this.notify();
    }
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.product.id !== productId);
    this.showToast('Item removed from cart', 'info');
    this.notify();
  }

  clearCart() {
    this.cart = [];
    this.notify();
  }

  getCartTotal() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 25;
    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  }

  // --- Checkout & Orders Actions ---
  placeOrder(shippingAddress, paymentMethod, discountCode = '') {
    if (this.cart.length === 0) {
      this.showToast('Cart is empty!', 'error');
      return null;
    }

    const { total } = this.getCartTotal();
    const finalTotal = discountCode.toUpperCase() === 'BINARY10' ? total * 0.9 : total;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      total: Number(finalTotal.toFixed(2)),
      status: 'Processing',
      items: this.cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      shippingAddress: shippingAddress || (this.user ? this.user.address : 'Standard Delivery Address'),
      paymentMethod: paymentMethod || 'CyberPay (Crypto)',
      trackingStep: 0,
      estimatedDelivery: '3 Days from today',
      cancellationEligible: true
    };

    // Deduct stock
    this.cart.forEach(cartItem => {
      const p = this.products.find(prod => prod.id === cartItem.product.id);
      if (p) {
        p.stock = Math.max(0, p.stock - cartItem.quantity);
        if (p.stock <= p.minStockThreshold) {
          this.addNotification(
            'Low Stock Alert',
            `Product ${p.name} stock level is now low (${p.stock} remaining).`,
            'admin'
          );
        }
      }
    });

    this.orders.unshift(newOrder);
    this.clearCart();
    this.showToast(`Order #${newOrder.id} placed successfully!`, 'success');
    this.activeTrackingOrder = newOrder;
    this.navigate('orders');
    this.notify();
    return newOrder;
  }

  cancelOrder(orderId, reason = 'Changed my mind') {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.status !== 'Processing') {
      this.showToast(`Order #${orderId} cannot be cancelled as it is already ${order.status}.`, 'error');
      return;
    }

    order.status = 'Cancelled';
    order.cancellationEligible = false;

    // Restore stock
    order.items.forEach(item => {
      const p = this.products.find(prod => prod.id === item.id);
      if (p) {
        p.stock += item.quantity;
      }
    });

    this.addNotification(
      'Order Cancelled',
      `Order #${orderId} has been cancelled. Refund initiated for $${order.total.toFixed(2)}.`,
      'order'
    );

    this.cancellationModalOrder = null;
    this.showToast(`Order #${orderId} cancelled successfully.`, 'info');
    this.notify();
  }

  // --- Admin Stock Actions ---
  restockProduct(productId, amount = 10) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.stock += amount;
      this.showToast(`Restocked ${product.name} (+${amount} units)`, 'success');
      this.addNotification(
        'Stock Restocked',
        `Agentic restocking system added ${amount} units to ${product.name}. Current stock: ${product.stock}`,
        'admin'
      );
      this.notify();
    }
  }

  updateOrderStatus(orderId, newStatus) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      if (newStatus === 'Shipped') order.trackingStep = 2;
      if (newStatus === 'Delivered') order.trackingStep = 4;
      if (newStatus === 'Cancelled') order.cancellationEligible = false;
      this.showToast(`Order #${orderId} status updated to ${newStatus}`, 'info');
      this.notify();
    }
  }

  // --- Notifications Actions ---
  addNotification(title, message, type = 'system') {
    const notif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    this.notifications.unshift(notif);
    this.notify();
  }

  markNotificationAsRead(id) {
    const n = this.notifications.find(item => item.id === id);
    if (n) {
      n.read = true;
      this.notify();
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  }

  // --- Toast Manager ---
  showToast(message, type = 'info') {
    const toast = { id: Date.now(), message, type };
    this.toasts.push(toast);
    this.notify();

    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t.id !== toast.id);
      this.notify();
    }, 4000);
  }
}

export const store = new StateStore();
