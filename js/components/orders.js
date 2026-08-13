// Orders Component: Order History, Order Cancellation & Live Order Tracking UI

import { store } from '../store.js';

export function renderOrdersView() {
  const container = document.getElementById('orders-view');
  if (!container) return;

  if (store.activeView !== 'orders') {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  const trackingOrder = store.activeTrackingOrder || store.orders[0];
  const cancellationOrder = store.cancellationModalOrder;

  container.innerHTML = `
    <div class="orders-page-container">
      <div class="orders-header glass-panel">
        <h2>Order Management & Live Tracking</h2>
        <p>Monitor real-time fulfillment progress, inspect order receipts, or initiate cancellations.</p>
      </div>

      <!-- Live Tracking Section (If tracking order selected) -->
      ${trackingOrder ? `
        <div class="tracking-section glass-panel">
          <div class="tracking-header">
            <div>
              <h3>Live Delivery Tracking — ${trackingOrder.id}</h3>
              <span class="tracking-date">Ordered on ${trackingOrder.date} • Expected Delivery: <strong>${trackingOrder.estimatedDelivery}</strong></span>
            </div>
            <span class="order-status-badge status-${trackingOrder.status.toLowerCase()}">${trackingOrder.status}</span>
          </div>

          <!-- Progress Stepper -->
          <div class="stepper-wrapper">
            <div class="stepper-line">
              <div class="stepper-line-fill" style="width: ${(trackingOrder.trackingStep / 4) * 100}%;"></div>
            </div>

            <div class="step-item ${trackingOrder.trackingStep >= 0 ? 'completed' : ''} ${trackingOrder.trackingStep === 0 ? 'active' : ''}">
              <div class="step-circle">1</div>
              <span class="step-label">Order Placed</span>
            </div>

            <div class="step-item ${trackingOrder.trackingStep >= 1 ? 'completed' : ''} ${trackingOrder.trackingStep === 1 ? 'active' : ''}">
              <div class="step-circle">2</div>
              <span class="step-label">Stock Reserved</span>
            </div>

            <div class="step-item ${trackingOrder.trackingStep >= 2 ? 'completed' : ''} ${trackingOrder.trackingStep === 2 ? 'active' : ''}">
              <div class="step-circle">3</div>
              <span class="step-label">Autonomous Packing</span>
            </div>

            <div class="step-item ${trackingOrder.trackingStep >= 3 ? 'completed' : ''} ${trackingOrder.trackingStep === 3 ? 'active' : ''}">
              <div class="step-circle">4</div>
              <span class="step-label">In Transit</span>
            </div>

            <div class="step-item ${trackingOrder.trackingStep >= 4 ? 'completed' : ''} ${trackingOrder.trackingStep === 4 ? 'active' : ''}">
              <div class="step-circle">5</div>
              <span class="step-label">Delivered</span>
            </div>
          </div>

          <!-- Simulated Live Map / Driver Card -->
          <div class="tracking-live-card">
            <div class="live-map-sim">
              <div class="map-grid-pattern"></div>
              <div class="map-drone-marker">🚁 Autonomous Drone Delivery #B-88</div>
              <div class="map-pulse-circle"></div>
            </div>

            <div class="live-info-box">
              <div class="info-row">
                <span class="info-label">Courier Agent:</span>
                <strong>AeroBot Logistics #442</strong>
              </div>
              <div class="info-row">
                <span class="info-label">Delivery Address:</span>
                <span>${trackingOrder.shippingAddress}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span>${trackingOrder.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Order History List -->
      <div class="order-history-section glass-panel">
        <div class="section-title-row">
          <h3>Order History (${store.orders.length})</h3>
        </div>

        <div class="orders-list">
          ${store.orders.map(order => `
            <div class="order-card glass-panel ${trackingOrder && trackingOrder.id === order.id ? 'active-track' : ''}">
              <div class="order-card-header">
                <div class="order-meta">
                  <strong>${order.id}</strong>
                  <span class="order-date">${order.date}</span>
                </div>
                <span class="order-status-badge status-${order.status.toLowerCase()}">${order.status}</span>
              </div>

              <div class="order-card-items">
                ${order.items.map(item => `
                  <div class="order-item-mini">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="mini-info">
                      <span class="mini-name">${item.name}</span>
                      <span class="mini-qty-price">${item.quantity} × $${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="order-card-footer">
                <div class="order-total-price">
                  <span>Total Amount:</span>
                  <strong>$${order.total.toFixed(2)}</strong>
                </div>

                <div class="order-actions">
                  <button class="btn btn-sm btn-outline track-btn" data-id="${order.id}">
                    Live Tracking 📍
                  </button>

                  ${order.status === 'Processing' && order.cancellationEligible ? `
                    <button class="btn btn-sm btn-danger cancel-trigger-btn" data-id="${order.id}">
                      Cancel Order 🚫
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Order Cancellation Modal -->
    ${cancellationOrder ? `
      <div class="modal-backdrop" id="cancel-modal-backdrop">
        <div class="modal-card cancel-modal glass-panel">
          <button class="modal-close-btn" id="cancel-modal-close">×</button>
          
          <div class="cancel-modal-header">
            <span class="cancel-icon">⚠️</span>
            <h3>Cancel Order #${cancellationOrder.id}</h3>
            <p>Are you sure you want to cancel this order? Stock will be restored to inventory and your refund will be processed immediately.</p>
          </div>

          <div class="form-group">
            <label for="cancel-reason-select">Reason for Cancellation</label>
            <select id="cancel-reason-select" class="form-select">
              <option value="Changed my mind">Changed my mind</option>
              <option value="Found a better item">Found a better item</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Incorrect shipping address">Incorrect shipping address</option>
            </select>
          </div>

          <div class="modal-actions-row">
            <button class="btn btn-outline" id="keep-order-btn">Keep Order</button>
            <button class="btn btn-danger" id="confirm-cancel-btn">Confirm Cancellation</button>
          </div>
        </div>
      </div>
    ` : ''}
  `;

  // Bind Events
  container.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.activeTrackingOrder = store.orders.find(o => o.id === btn.dataset.id);
      store.notify();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  container.querySelectorAll('.cancel-trigger-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.cancellationModalOrder = store.orders.find(o => o.id === btn.dataset.id);
      store.notify();
    });
  });

  document.getElementById('cancel-modal-close')?.addEventListener('click', () => {
    store.cancellationModalOrder = null;
    store.notify();
  });

  document.getElementById('keep-order-btn')?.addEventListener('click', () => {
    store.cancellationModalOrder = null;
    store.notify();
  });

  document.getElementById('confirm-cancel-btn')?.addEventListener('click', () => {
    if (cancellationOrder) {
      const reason = document.getElementById('cancel-reason-select')?.value;
      store.cancelOrder(cancellationOrder.id, reason);
    }
  });
}
