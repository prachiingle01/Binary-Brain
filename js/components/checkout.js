// Checkout Component: Multi-step Checkout Form & Instant Order Confirmation

import { store } from '../store.js';

export function renderCheckoutView() {
  const container = document.getElementById('checkout-view');
  if (!container) return;

  if (store.activeView !== 'checkout') {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  const { subtotal, tax, shipping, total } = store.getCartTotal();

  if (store.cart.length === 0) {
    container.innerHTML = `
      <div class="checkout-empty glass-panel">
        <span class="empty-icon">📦</span>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart before proceeding to checkout.</p>
        <button class="btn btn-primary" onclick="window.bbStore.navigate('catalog')">Return to Catalog</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="checkout-container">
      <div class="checkout-header glass-panel">
        <h2>Secure Checkout Flow</h2>
        <p>Complete your neural order via encrypted autonomous transaction pipeline.</p>
      </div>

      <div class="checkout-layout">
        <!-- Checkout Steps Form -->
        <div class="checkout-form-section glass-panel">
          <form id="checkout-form">
            <!-- Step 1: Shipping Address -->
            <div class="checkout-step">
              <div class="step-header">
                <span class="step-badge">1</span>
                <h3>Shipping & Delivery Address</h3>
              </div>

              <div class="form-grid">
                <div class="form-group span-2">
                  <label for="chk-name">Full Name</label>
                  <input type="text" id="chk-name" class="form-input" value="${store.user ? store.user.name : ''}" required>
                </div>

                <div class="form-group span-2">
                  <label for="chk-address">Street Address</label>
                  <input type="text" id="chk-address" class="form-input" value="${store.user ? store.user.address : ''}" placeholder="104 Binary Tower, Silicon Valley" required>
                </div>

                <div class="form-group">
                  <label for="chk-city">City</label>
                  <input type="text" id="chk-city" class="form-input" value="Silicon Valley" required>
                </div>

                <div class="form-group">
                  <label for="chk-zip">Postal Code</label>
                  <input type="text" id="chk-zip" class="form-input" value="94025" required>
                </div>
              </div>
            </div>

            <!-- Step 2: Payment Options -->
            <div class="checkout-step">
              <div class="step-header">
                <span class="step-badge">2</span>
                <h3>Payment Method</h3>
              </div>

              <div class="payment-options-grid">
                <label class="payment-option-card active">
                  <input type="radio" name="payment" value="CyberPay (Crypto)" checked>
                  <div class="pay-content">
                    <span class="pay-icon">💎</span>
                    <div>
                      <strong>CyberPay / Web3 Crypto</strong>
                      <span class="pay-desc">Instant zero-fee SOL/USDC transfer</span>
                    </div>
                  </div>
                </label>

                <label class="payment-option-card">
                  <input type="radio" name="payment" value="Credit Card">
                  <div class="pay-content">
                    <span class="pay-icon">💳</span>
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <span class="pay-desc">Visa, MasterCard, Amex (256-bit encrypted)</span>
                    </div>
                  </div>
                </label>
              </div>

              <div class="promo-code-box">
                <label for="promo-input">Promo Code</label>
                <div class="promo-input-group">
                  <input type="text" id="promo-input" class="form-input" placeholder="e.g. BINARY10">
                  <button type="button" class="btn btn-outline" id="apply-promo-btn">Apply</button>
                </div>
                <span class="promo-hint">Use code <strong>BINARY10</strong> for 10% instant discount!</span>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="submit-order-btn">
              Complete Order • $${total.toFixed(2)}
            </button>
          </form>
        </div>

        <!-- Order Summary Sidebar -->
        <aside class="checkout-summary-section glass-panel">
          <h3>Order Summary (${store.cart.reduce((s, i) => s + i.quantity, 0)} items)</h3>

          <div class="checkout-items-list">
            ${store.cart.map(item => `
              <div class="summary-item">
                <img src="${item.product.image}" alt="${item.product.name}">
                <div class="summary-item-info">
                  <h4>${item.product.name}</h4>
                  <span>Qty: ${item.quantity} × $${item.product.price.toFixed(2)}</span>
                </div>
                <span class="summary-item-total">$${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="summary-breakdown">
            <div class="summary-line">
              <span>Subtotal:</span>
              <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-line">
              <span>Estimated Tax (8%):</span>
              <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-line">
              <span>Shipping Fee:</span>
              <span>${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="summary-line total-line" id="checkout-total-row">
              <span>Total:</span>
              <strong class="total-price">$${total.toFixed(2)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;

  // Bind Events
  let currentDiscountApplied = false;

  document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
    const code = document.getElementById('promo-input').value.trim().toUpperCase();
    if (code === 'BINARY10') {
      if (!currentDiscountApplied) {
        currentDiscountApplied = true;
        const discountedTotal = total * 0.9;
        document.getElementById('checkout-total-row').innerHTML = `
          <span>Total (10% OFF):</span>
          <strong class="total-price">$${discountedTotal.toFixed(2)}</strong>
        `;
        document.getElementById('submit-order-btn').innerText = `Complete Order • $${discountedTotal.toFixed(2)}`;
        store.showToast('Promo code BINARY10 applied! 10% off', 'success');
      }
    } else {
      store.showToast('Invalid promo code. Try BINARY10', 'error');
    }
  });

  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = document.getElementById('chk-address').value;
    const paymentRadio = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = paymentRadio ? paymentRadio.value : 'CyberPay (Crypto)';
    const promoCode = document.getElementById('promo-input').value.trim();

    store.placeOrder(address, paymentMethod, promoCode);
  });
}
