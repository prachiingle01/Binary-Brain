// Catalogue Component: Products Grid, Category Pills, Search & Filters

import { store } from '../store.js';
import { MOCK_CATEGORIES } from '../data.js';

export function renderCatalogView() {
  const container = document.getElementById('catalog-view');
  if (!container) return;

  if (store.activeView !== 'catalog') {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';

  const filteredProducts = store.getFilteredProducts();

  container.innerHTML = `
    <div class="catalog-hero glass-panel">
      <div class="hero-content">
        <span class="badge badge-accent">Autonomous Agentic Ecosystem</span>
        <h1>Neural Hardware & AI Accelerators</h1>
        <p>Explore high-bandwidth neural interfaces, low-latency edge AI hardware, and autonomous robotics components.</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat-card">
          <span class="stat-number">99.8%</span>
          <span class="stat-label">AI Fulfillment Speed</span>
        </div>
        <div class="hero-stat-card">
          <span class="stat-number">24/7</span>
          <span class="stat-label">Agentic Inventory Sync</span>
        </div>
      </div>
    </div>

    <!-- Category Pills Navigation -->
    <div class="category-scroll-container">
      <div class="category-pills">
        ${MOCK_CATEGORIES.map(cat => `
          <button class="category-pill ${store.selectedCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.name}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="catalog-main-layout">
      <!-- Multi-facet Filter Sidebar -->
      <aside class="filter-sidebar glass-panel">
        <div class="sidebar-header">
          <h3>Filters & Refinements</h3>
          <button class="btn btn-text" id="reset-filters-btn">Reset All</button>
        </div>

        <div class="filter-group">
          <label class="filter-label">Search Query</label>
          <div class="search-input-wrapper">
            <input type="text" id="sidebar-search-input" class="form-input" placeholder="Search products..." value="${store.searchQuery}">
            <span class="search-icon">🔍</span>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Max Price: <strong id="price-val">$${store.maxPrice}</strong></label>
          <input type="range" id="price-range" class="form-range" min="100" max="3000" step="50" value="${store.maxPrice}">
          <div class="range-bounds">
            <span>$100</span>
            <span>$3000</span>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-label">Minimum Rating</label>
          <div class="rating-filter-options">
            <button class="rating-opt ${store.minRating === 0 ? 'active' : ''}" data-rating="0">Any</button>
            <button class="rating-opt ${store.minRating === 4 ? 'active' : ''}" data-rating="4">4★ +</button>
            <button class="rating-opt ${store.minRating === 4.5 ? 'active' : ''}" data-rating="4.5">4.5★ +</button>
          </div>
        </div>

        <div class="filter-group">
          <label class="filter-checkbox-label">
            <input type="checkbox" id="instock-checkbox" ${store.inStockOnly ? 'checked' : ''}>
            <span>In Stock Items Only</span>
          </label>
        </div>

        <div class="filter-group">
          <label class="filter-label">Sort Products By</label>
          <select id="sort-select" class="form-select">
            <option value="relevance" ${store.sortBy === 'relevance' ? 'selected' : ''}>Relevance / Featured</option>
            <option value="price-asc" ${store.sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${store.sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="rating" ${store.sortBy === 'rating' ? 'selected' : ''}>Highest Rated</option>
            <option value="stock" ${store.sortBy === 'stock' ? 'selected' : ''}>Highest Stock Availability</option>
          </select>
        </div>
      </aside>

      <!-- Products Grid & Header -->
      <section class="products-grid-section">
        <div class="products-header">
          <p class="results-count">Showing <strong>${filteredProducts.length}</strong> products</p>
          <div class="view-toggle">
            <span class="active">Grid View</span>
          </div>
        </div>

        ${filteredProducts.length === 0 ? `
          <div class="no-results glass-panel">
            <span class="no-results-icon">🔎</span>
            <h3>No products found matching your criteria</h3>
            <p>Try clearing your search query or adjusting the price & category filters.</p>
            <button class="btn btn-primary" id="empty-reset-btn">Reset Filters</button>
          </div>
        ` : `
          <div class="products-grid">
            ${filteredProducts.map(p => `
              <div class="product-card glass-panel">
                <div class="card-image-wrapper">
                  <img src="${p.image}" alt="${p.name}" loading="lazy">
                  <span class="product-tag ${p.stock <= p.minStockThreshold ? 'tag-warning' : 'tag-primary'}">${p.tag}</span>
                  <button class="wishlist-btn" title="Add to Wishlist" onclick="this.classList.toggle('active')">♥</button>
                </div>

                <div class="card-content">
                  <div class="card-meta">
                    <span class="product-category">${p.category.toUpperCase()}</span>
                    <span class="product-rating">★ ${p.rating} (${p.reviewsCount})</span>
                  </div>

                  <h3 class="product-title">${p.name}</h3>
                  <p class="product-desc">${p.description}</p>

                  <div class="stock-status-bar">
                    <span class="stock-badge ${p.stock <= p.minStockThreshold ? 'low-stock' : 'in-stock'}">
                      ${p.stock === 0 ? 'Out of Stock' : (p.stock <= p.minStockThreshold ? `Low Stock (${p.stock} left)` : `In Stock (${p.stock})`)}
                    </span>
                  </div>

                  <div class="card-footer">
                    <div class="price-container">
                      <span class="price-symbol">$</span>
                      <span class="price-amount">${p.price.toFixed(2)}</span>
                    </div>

                    <div class="card-actions">
                      <button class="btn btn-sm btn-outline quick-view-btn" data-id="${p.id}">Details</button>
                      <button class="btn btn-sm btn-primary add-cart-btn" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </section>
    </div>
  `;

  // Bind Events
  container.querySelectorAll('.category-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setCategory(btn.dataset.cat);
    });
  });

  const priceRange = container.querySelector('#price-range');
  priceRange?.addEventListener('input', (e) => {
    document.getElementById('price-val').innerText = `$${e.target.value}`;
    store.setMaxPrice(e.target.value);
  });

  container.querySelector('#sidebar-search-input')?.addEventListener('input', (e) => {
    store.setSearchQuery(e.target.value);
  });

  container.querySelectorAll('.rating-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setMinRating(Number(btn.dataset.rating));
    });
  });

  container.querySelector('#instock-checkbox')?.addEventListener('change', (e) => {
    store.setInStockOnly(e.target.checked);
  });

  container.querySelector('#sort-select')?.addEventListener('change', (e) => {
    store.setSortBy(e.target.value);
  });

  const resetAction = () => {
    store.searchQuery = '';
    store.selectedCategory = 'all';
    store.maxPrice = 2500;
    store.minRating = 0;
    store.inStockOnly = false;
    store.sortBy = 'relevance';
    store.notify();
  };

  container.querySelector('#reset-filters-btn')?.addEventListener('click', resetAction);
  container.querySelector('#empty-reset-btn')?.addEventListener('click', resetAction);

  container.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.selectedProductModal = store.products.find(p => p.id === btn.dataset.id);
      store.notify();
    });
  });

  container.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.addToCart(btn.dataset.id, 1);
    });
  });
}
