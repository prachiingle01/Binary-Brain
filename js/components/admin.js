// Admin Dashboard Component: Inventory Operations, Stock Manager, Order Control & Analytics

import { store } from '../store.js';

export function renderAdminView() {
  const container = document.getElementById('admin-view');
  if (!container) return;

  if (store.activeView !== 'admin') {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  const stats = store.adminStats;
  const products = store.products;
  const orders = store.orders;

  container.innerHTML = `
    <div class="admin-dashboard-container">
      <div class="admin-header glass-panel">
        <div>
          <h2>Autonomous Inventory Admin Portal</h2>
          <p>Real-time telemetry, stock threshold triggers, and agentic order management.</p>
        </div>
        <span class="badge badge-accent">Admin Mode Active</span>
      </div>

      <!-- Metrics KPI Cards -->
      <div class="metrics-grid">
        <div class="metric-card glass-panel">
          <span class="metric-icon">💰</span>
          <div class="metric-body">
            <span class="metric-title">Total Revenue</span>
            <span class="metric-value">${stats.totalRevenue}</span>
            <span class="metric-change positive">${stats.revenueGrowth}</span>
          </div>
        </div>

        <div class="metric-card glass-panel">
          <span class="metric-icon">📦</span>
          <div class="metric-body">
            <span class="metric-title">Active Orders</span>
            <span class="metric-value">${orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Delivered').length}</span>
            <span class="metric-change">Pending fulfillment</span>
          </div>
        </div>

        <div class="metric-card glass-panel">
          <span class="metric-icon">⚠️</span>
          <div class="metric-body">
            <span class="metric-title">Low Stock Warnings</span>
            <span class="metric-value">${products.filter(p => p.stock <= p.minStockThreshold).length} Items</span>
            <span class="metric-change negative">Threshold <= 5</span>
          </div>
        </div>

        <div class="metric-card glass-panel">
          <span class="metric-icon">🤖</span>
          <div class="metric-body">
            <span class="metric-title">Agent Automations</span>
            <span class="metric-value">${stats.agentAutomationsCount}</span>
            <span class="metric-change positive">99.9% Autonomous</span>
          </div>
        </div>
      </div>

      <!-- Analytics SVG Charts Section -->
      <div class="analytics-charts-grid">
        <div class="chart-card glass-panel">
          <h3>Sales Velocity (Last 7 Days)</h3>
          <div class="svg-chart-container">
            <svg viewBox="0 0 500 150" class="analytics-svg">
              <path d="M0,120 Q70,90 140,110 T280,40 T420,60 T500,20" fill="none" stroke="#10b981" stroke-width="4" />
              <circle cx="140" cy="110" r="5" fill="#10b981" />
              <circle cx="280" cy="40" r="5" fill="#10b981" />
              <circle cx="420" cy="60" r="5" fill="#10b981" />
              <circle cx="500" cy="20" r="6" fill="#6366f1" />
            </svg>
          </div>
        </div>

        <div class="chart-card glass-panel">
          <h3>Stock Depletion Rate</h3>
          <div class="svg-chart-container">
            <svg viewBox="0 0 500 150" class="analytics-svg">
              <path d="M0,30 Q100,50 200,40 T350,110 T500,130" fill="none" stroke="#6366f1" stroke-width="4" stroke-dasharray="6,6" />
              <circle cx="350" cy="110" r="5" fill="#ef4444" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Inventory Management Table -->
      <div class="admin-section glass-panel">
        <div class="admin-section-header">
          <h3>Inventory Stock Telemetry & Control</h3>
          <span class="hint">Click "+10 Restock" to simulate supplier restock trigger.</span>
        </div>

        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Level</th>
                <th>Min Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr class="${p.stock <= p.minStockThreshold ? 'row-warning' : ''}">
                  <td class="product-cell">
                    <img src="${p.image}" alt="${p.name}" class="table-thumb">
                    <div>
                      <strong>${p.name}</strong>
                      <span class="sub-text">ID: ${p.id}</span>
                    </div>
                  </td>
                  <td>${p.category.toUpperCase()}</td>
                  <td>$${p.price.toFixed(2)}</td>
                  <td>
                    <strong class="${p.stock <= p.minStockThreshold ? 'text-danger' : 'text-success'}">${p.stock} units</strong>
                  </td>
                  <td>${p.minStockThreshold} units</td>
                  <td>
                    <span class="stock-badge ${p.stock <= p.minStockThreshold ? 'low-stock' : 'in-stock'}">
                      ${p.stock === 0 ? 'Out of Stock' : (p.stock <= p.minStockThreshold ? 'Low Stock Alert' : 'Healthy')}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-primary restock-btn" data-id="${p.id}">
                      +10 Restock ⚡
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Orders Management Table -->
      <div class="admin-section glass-panel">
        <div class="admin-section-header">
          <h3>Orders Fulfillment Control</h3>
        </div>

        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items Count</th>
                <th>Total Price</th>
                <th>Current Status</th>
                <th>Override Status</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>${o.id}</strong></td>
                  <td>${o.date}</td>
                  <td>${o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                  <td>$${o.total.toFixed(2)}</td>
                  <td>
                    <span class="order-status-badge status-${o.status.toLowerCase()}">${o.status}</span>
                  </td>
                  <td>
                    <select class="form-select select-status-override" data-id="${o.id}">
                      <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                      <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                      <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                      <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  // Bind Events
  container.querySelectorAll('.restock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.restockProduct(btn.dataset.id, 10);
    });
  });

  container.querySelectorAll('.select-status-override').forEach(select => {
    select.addEventListener('change', (e) => {
      store.updateOrderStatus(select.dataset.id, e.target.value);
    });
  });
}
