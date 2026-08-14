// Cart Component: Cart Side Drawer & Cart Page View

import { store } from '../store.js';

export function renderCartDrawer() {
  const container = document.getElementById('cart-drawer-container');
  if (!container) return;

  if (!store.cartDrawerOpen) {
    container.innerHTML = '';
    return;
  }

  const { subtotal, tax, shipping, total } = store.getCartTotal();

  container.innerHTML = `
    <div class="modal-backdrop" id="cart-drawer-backdrop">
      <div class="drawer-panel glass-panel">
        <div class="drawer-header">
          <h3>Shopping Cart (${store.cart.reduce((sum, item) => sum + item.quantity, 0)})</h3>
          <button class="modal-close-btn" id="cart-drawer-close">×</button>
        </div>

        <div class="drawer-body">
          ${store.cart.length === 0 ? `
            <div class="empty-cart-view">
              <span class="empty-cart-icon">🛒</span>
              <p>Your cart is empty.</p>
              <button class="btn btn-primary" id="cart-shop-now">Explore Hardware</button>
            </div>
          ` : `
            <div class="cart-items-list">
              ${store.cart.map(item => `
                <div class="cart-item-card">
                  <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
                  
                  <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.product.name}</h4>
                    <span class="cart-item-price">$${item.product.price.toFixed(2)}</span>
                    
                    <div class="cart-item-qty-row">
                      <button class="qty-btn-sm dec-qty" data-id="${item.product.id}">-</button>
                      <span class="cart-qty">${item.quantity}</span>
                      <button class="qty-btn-sm inc-qty" data-id="${item.product.id}">+</button>
                    </div>
                  </div>

                  <button class="remove-cart-item-btn" data-id="${item.product.id}">🗑️</button>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        ${store.cart.length > 0 ? `
          <div class="drawer-footer">
            <div class="summary-line">
              <span>Subtotal:</span>
              <strong>$${subtotal.toFixed(2)}</strong>
            </div>
            <div class="summary-line">
              <span>Estimated Tax (8%):</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-line">
              <span>Shipping:</span>
              <span>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="summary-line total-line">
              <span>Total Amount:</span>
              <strong class="total-price">$${total.toFixed(2)}</strong>
            </div>

            <button class="btn btn-primary btn-block btn-lg" id="drawer-checkout-btn">
              Proceed to Checkout →
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('cart-drawer-close')?.addEventListener('click', () => {
    store.cartDrawerOpen = false;
    store.notify();
  });

  document.getElementById('cart-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'cart-drawer-backdrop') {
      store.cartDrawerOpen = false;
      store.notify();
    }
  });

  document.getElementById('cart-shop-now')?.addEventListener('click', () => {
    store.cartDrawerOpen = false;
    store.navigate('catalog');
  });

  container.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = store.cart.find(i => i.product.id === btn.dataset.id);
      if (item) store.updateCartQuantity(btn.dataset.id, item.quantity - 1);
    });
  });

  container.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = store.cart.find(i => i.product.id === btn.dataset.id);
      if (item) store.updateCartQuantity(btn.dataset.id, item.quantity + 1);
    });
  });

  container.querySelectorAll('.remove-cart-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.removeFromCart(btn.dataset.id);
    });
  });

  document.getElementById('drawer-checkout-btn')?.addEventListener('click', () => {
    store.cartDrawerOpen = false;
    store.navigate('checkout');
  });
}
