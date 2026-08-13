// Main Application Entry Point

import { store } from './js/store.js';
import { renderAuthModal } from './js/components/auth.js';
import { renderCatalogView } from './js/components/catalog.js';
import { renderProductDetailsModal } from './js/components/productDetails.js';
import { renderCartDrawer } from './js/components/cart.js';
import { renderCheckoutView } from './js/components/checkout.js';
import { renderOrdersView } from './js/components/orders.js';
import { renderProfileView } from './js/components/profile.js';
import { renderAdminView } from './js/components/admin.js';
import { renderAIChatWidget } from './js/components/aiChat.js';
import { renderNotificationsDrawer, renderToastManager } from './js/components/notifications.js';

// Expose store globally for inline onclick handlers
window.bbStore = store;

function initHeader() {
  const headerContainer = document.getElementById('header-navigation');
  if (!headerContainer) return;

  const cartCount = store.cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifCount = store.notifications.filter(n => !n.read).length;
  const user = store.user;

  headerContainer.innerHTML = `
    <header class="navbar-header glass-panel">
      <div class="header-left">
        <a href="#" class="brand-logo" id="nav-brand">
          <span class="logo-brain-icon">🧠</span>
          <div class="logo-title-group">
            <span class="logo-name">Binary-Brain</span>
            <span class="logo-tagline">Autonomous E-Commerce</span>
          </div>
        </a>
      </div>

      <nav class="nav-links">
        <button class="nav-link ${store.activeView === 'catalog' ? 'active' : ''}" id="nav-catalog">Catalogue</button>
        <button class="nav-link ${store.activeView === 'orders' ? 'active' : ''}" id="nav-orders">Orders & Tracking</button>
        ${user && user.role === 'admin' ? `
          <button class="nav-link nav-admin-link ${store.activeView === 'admin' ? 'active' : ''}" id="nav-admin">
            ⚙️ Admin Portal
          </button>
        ` : ''}
      </nav>

      <div class="header-right">
        <!-- Quick Search -->
        <div class="header-search-bar">
          <input type="text" id="header-search-input" class="header-search-input" placeholder="Search hardware..." value="${store.searchQuery}">
          <span class="search-btn-icon">🔍</span>
        </div>

        <!-- Notifications Bell -->
        <button class="header-icon-btn" id="notif-btn" title="Notifications">
          <span class="icon">🔔</span>
          ${unreadNotifCount > 0 ? `<span class="badge-count">${unreadNotifCount}</span>` : ''}
        </button>

        <!-- Cart Icon -->
        <button class="header-icon-btn" id="cart-btn" title="Shopping Cart">
          <span class="icon">🛒</span>
          ${cartCount > 0 ? `<span class="badge-count count-cart">${cartCount}</span>` : ''}
        </button>

        <!-- User Profile / Auth Button -->
        ${user ? `
          <button class="user-avatar-btn" id="nav-profile-btn" title="Profile (${user.role})">
            <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="${user.name}">
            <span class="user-fname">${user.name.split(' ')[0]}</span>
          </button>
        ` : `
          <button class="btn btn-primary btn-sm" id="nav-auth-btn">Sign In</button>
        `}
      </div>
    </header>
  `;

  // Bind Navbar Events
  document.getElementById('nav-brand')?.addEventListener('click', (e) => {
    e.preventDefault();
    store.navigate('catalog');
  });

  document.getElementById('nav-catalog')?.addEventListener('click', () => store.navigate('catalog'));
  document.getElementById('nav-orders')?.addEventListener('click', () => store.navigate('orders'));
  document.getElementById('nav-admin')?.addEventListener('click', () => store.navigate('admin'));

  document.getElementById('header-search-input')?.addEventListener('input', (e) => {
    store.setSearchQuery(e.target.value);
    if (store.activeView !== 'catalog') {
      store.navigate('catalog');
    }
  });

  document.getElementById('notif-btn')?.addEventListener('click', () => {
    store.notificationsDrawerOpen = true;
    store.notify();
  });

  document.getElementById('cart-btn')?.addEventListener('click', () => {
    store.cartDrawerOpen = true;
    store.notify();
  });

  document.getElementById('nav-profile-btn')?.addEventListener('click', () => store.navigate('profile'));
  document.getElementById('nav-auth-btn')?.addEventListener('click', () => {
    store.authModalOpen = true;
    store.notify();
  });
}

function renderApp() {
  initHeader();
  renderCatalogView();
  renderCheckoutView();
  renderOrdersView();
  renderProfileView();
  renderAdminView();

  // Overlays
  renderAuthModal();
  renderProductDetailsModal();
  renderCartDrawer();
  renderNotificationsDrawer();
  renderAIChatWidget();
  renderToastManager();
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  store.subscribe(() => renderApp());
});
