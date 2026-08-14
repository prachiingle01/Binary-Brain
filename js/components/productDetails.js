// Product Details Component: Interactive Product Modal

import { store } from '../store.js';

export function renderProductDetailsModal() {
  const container = document.getElementById('product-details-container');
  if (!container) return;

  const product = store.selectedProductModal;

  if (!product) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="modal-backdrop" id="pmodal-backdrop">
      <div class="modal-card product-modal-card glass-panel">
        <button class="modal-close-btn" id="pmodal-close">×</button>

        <div class="product-modal-grid">
          <div class="pmodal-gallery">
            <img src="${product.image}" alt="${product.name}" class="pmodal-main-img">
            <span class="product-tag tag-primary pmodal-tag">${product.tag}</span>
          </div>

          <div class="pmodal-details">
            <div class="pmodal-meta">
              <span class="category-badge">${product.category.toUpperCase()}</span>
              <span class="rating-badge">★ ${product.rating} (${product.reviewsCount} customer reviews)</span>
            </div>

            <h2 class="pmodal-title">${product.name}</h2>

            <div class="pmodal-price-row">
              <span class="pmodal-price">$${product.price.toFixed(2)}</span>
              <span class="stock-badge ${product.stock <= product.minStockThreshold ? 'low-stock' : 'in-stock'}">
                ${product.stock === 0 ? 'Out of Stock' : (product.stock <= product.minStockThreshold ? `Low Stock (${product.stock} remaining)` : `In Stock (${product.stock} units)`)}
              </span>
            </div>

            <p class="pmodal-desc">${product.description}</p>

            <!-- Agentic AI Insights Box -->
            <div class="ai-insight-box">
              <div class="ai-insight-header">
                <span class="ai-icon">🤖</span>
                <strong>Binary Agentic Insight</strong>
              </div>
              <p>${product.aiInsight}</p>
            </div>

            <!-- Specs Table -->
            <div class="pmodal-specs">
              <h4>Technical Specifications</h4>
              <div class="specs-grid">
                ${Object.entries(product.specs || {}).map(([key, val]) => `
                  <div class="spec-row">
                    <span class="spec-name">${key}:</span>
                    <span class="spec-value">${val}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Action Controls -->
            <div class="pmodal-actions">
              <div class="quantity-picker">
                <button class="qty-btn" id="qty-minus">-</button>
                <input type="number" id="pmodal-qty" value="1" min="1" max="${product.stock}">
                <button class="qty-btn" id="qty-plus">+</button>
              </div>

              <button class="btn btn-primary btn-lg flex-1" id="pmodal-add-cart" ${product.stock === 0 ? 'disabled' : ''}>
                Add to Cart • $${product.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('pmodal-close')?.addEventListener('click', () => {
    store.selectedProductModal = null;
    store.notify();
  });

  document.getElementById('pmodal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'pmodal-backdrop') {
      store.selectedProductModal = null;
      store.notify();
    }
  });

  const qtyInput = document.getElementById('pmodal-qty');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (qtyInput && qtyInput.value > 1) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
    }
  });

  document.getElementById('qty-plus')?.addEventListener('click', () => {
    if (qtyInput && parseInt(qtyInput.value) < product.stock) {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    }
  });

  document.getElementById('pmodal-add-cart')?.addEventListener('click', () => {
    const qty = parseInt(qtyInput?.value || 1);
    store.addToCart(product.id, qty);
    store.selectedProductModal = null;
    store.notify();
  });
}
