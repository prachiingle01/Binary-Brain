// Auth Component: Login and Registration Modal

import { store } from '../store.js';

export function renderAuthModal() {
  const container = document.getElementById('auth-modal-container');
  if (!container) return;

  if (!store.authModalOpen) {
    container.innerHTML = '';
    return;
  }

  const isLogin = store.authMode === 'login';

  container.innerHTML = `
    <div class="modal-backdrop" id="auth-modal-backdrop">
      <div class="modal-card auth-modal">
        <button class="modal-close-btn" id="auth-modal-close">×</button>
        
        <div class="auth-header">
          <div class="auth-logo">
            <span class="logo-icon">🧠</span>
            <span class="logo-text">Binary-Brain</span>
          </div>
          <h2>${isLogin ? 'Sign In to Your Account' : 'Create Agent Account'}</h2>
          <p class="auth-subtitle">
            ${isLogin ? 'Access your neural hardware orders & agent settings' : 'Join the autonomous e-commerce ecosystem'}
          </p>
        </div>

        <div class="auth-tabs">
          <button class="tab-btn ${isLogin ? 'active' : ''}" id="tab-login">Login</button>
          <button class="tab-btn ${!isLogin ? 'active' : ''}" id="tab-register">Register</button>
        </div>

        <form id="auth-form" class="auth-form">
          ${!isLogin ? `
            <div class="form-group">
              <label for="auth-name">Full Name</label>
              <input type="text" id="auth-name" class="form-input" placeholder="e.g. Prachi Ingle" required>
            </div>
          ` : ''}

          <div class="form-group">
            <label for="auth-email">Email Address</label>
            <input type="email" id="auth-email" class="form-input" placeholder="user@binarybrain.io" value="${isLogin ? 'user@binarybrain.io' : ''}" required>
          </div>

          <div class="form-group">
            <label for="auth-password">Password</label>
            <div class="password-input-wrapper">
              <input type="password" id="auth-password" class="form-input" placeholder="••••••••" value="${isLogin ? 'user123' : ''}" required>
              <button type="button" class="toggle-password-btn" id="toggle-pwd">👁️</button>
            </div>
          </div>

          <div class="form-group">
            <label for="auth-role">Account Role</label>
            <select id="auth-role" class="form-select">
              <option value="customer" selected>Customer Agent</option>
              <option value="admin">Administrator (Inventory Ops)</option>
            </select>
          </div>

          ${isLogin ? `
            <div class="form-footer-options">
              <label class="remember-me">
                <input type="checkbox" checked> Remember token
              </label>
              <a href="#" class="forgot-link" onclick="event.preventDefault(); alert('Demo password reset token sent to your email.');">Forgot Password?</a>
            </div>
          ` : ''}

          <button type="submit" class="btn btn-primary btn-block">
            ${isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div class="quick-demo-login">
          <p>Quick Demo Sign In:</p>
          <div class="demo-buttons">
            <button class="btn btn-sm btn-outline" id="demo-customer-btn">Customer Login</button>
            <button class="btn btn-sm btn-outline" id="demo-admin-btn">Admin Login</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('auth-modal-close')?.addEventListener('click', () => {
    store.authModalOpen = false;
    store.notify();
  });

  document.getElementById('auth-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'auth-modal-backdrop') {
      store.authModalOpen = false;
      store.notify();
    }
  });

  document.getElementById('tab-login')?.addEventListener('click', () => {
    store.authMode = 'login';
    store.notify();
  });

  document.getElementById('tab-register')?.addEventListener('click', () => {
    store.authMode = 'register';
    store.notify();
  });

  document.getElementById('toggle-pwd')?.addEventListener('click', () => {
    const input = document.getElementById('auth-password');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  });

  document.getElementById('demo-customer-btn')?.addEventListener('click', () => {
    store.login('user@binarybrain.io', 'user123', 'customer');
  });

  document.getElementById('demo-admin-btn')?.addEventListener('click', () => {
    store.login('admin@binarybrain.io', 'admin123', 'admin');
  });

  document.getElementById('auth-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const role = document.getElementById('auth-role').value;

    if (isLogin) {
      store.login(email, password, role);
    } else {
      const name = document.getElementById('auth-name').value;
      store.register(name, email, password, role);
    }
  });
}
