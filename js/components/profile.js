// Profile Component: Customer Profile & Settings View

import { store } from '../store.js';

export function renderProfileView() {
  const container = document.getElementById('profile-view');
  if (!container) return;

  if (store.activeView !== 'profile') {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  const user = store.user;

  if (!user) {
    container.innerHTML = `
      <div class="glass-panel profile-logged-out">
        <h3>Please Sign In</h3>
        <p>Log in to view your profile settings, saved addresses, and loyalty rewards.</p>
        <button class="btn btn-primary" onclick="window.bbStore.authModalOpen = true; window.bbStore.notify();">Sign In Now</button>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="profile-container">
      <div class="profile-sidebar glass-panel">
        <div class="user-avatar-wrapper">
          <img src="${user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}" alt="${user.name}">
          <span class="user-role-badge">${user.role.toUpperCase()}</span>
        </div>

        <h3 class="user-name">${user.name}</h3>
        <span class="user-email">${user.email}</span>

        <div class="loyalty-card">
          <div class="loyalty-header">
            <span class="star-icon">★</span>
            <span>${user.tier || 'Cyber Elite Member'}</span>
          </div>
          <div class="points-val">${user.loyaltyPoints || 4850}</div>
          <span class="points-label">AI Neural Credits</span>
        </div>

        <button class="btn btn-outline btn-block" id="profile-logout-btn">
          Sign Out 👋
        </button>
      </div>

      <div class="profile-content glass-panel">
        <h3>Account Settings & Preferences</h3>

        <form id="profile-edit-form" class="profile-form">
          <div class="form-grid">
            <div class="form-group span-2">
              <label for="prof-name">Full Name</label>
              <input type="text" id="prof-name" class="form-input" value="${user.name}" required>
            </div>

            <div class="form-group span-2">
              <label for="prof-email">Email Address</label>
              <input type="email" id="prof-email" class="form-input" value="${user.email}" required>
            </div>

            <div class="form-group span-2">
              <label for="prof-phone">Phone Number</label>
              <input type="text" id="prof-phone" class="form-input" value="${user.phone || '+1 555-019-2834'}">
            </div>

            <div class="form-group span-2">
              <label for="prof-address">Primary Delivery Address</label>
              <textarea id="prof-address" class="form-input" rows="3">${user.address || '104 Binary Tower, Silicon Valley, CA'}</textarea>
            </div>
          </div>

          <div class="preferences-group">
            <h4>Agent Automation Preferences</h4>
            <label class="toggle-checkbox-label">
              <input type="checkbox" checked>
              <span>Enable AI Agent Auto-Restock Notifications</span>
            </label>
            <label class="toggle-checkbox-label">
              <input type="checkbox" checked>
              <span>Receive Real-Time Drone Delivery Map Signals</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary">Save Profile Changes</button>
        </form>
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('profile-logout-btn')?.addEventListener('click', () => {
    store.logout();
  });

  document.getElementById('profile-edit-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    store.user.name = document.getElementById('prof-name').value;
    store.user.email = document.getElementById('prof-email').value;
    store.user.phone = document.getElementById('prof-phone').value;
    store.user.address = document.getElementById('prof-address').value;
    store.showToast('Profile updated successfully!', 'success');
    store.notify();
  });
}
