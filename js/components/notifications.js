// Notifications Component: Side Drawer & Floating Toast Alerts

import { store } from '../store.js';

export function renderNotificationsDrawer() {
  const container = document.getElementById('notifications-drawer-container');
  if (!container) return;

  if (!store.notificationsDrawerOpen) {
    container.innerHTML = '';
    return;
  }

  const unreadCount = store.notifications.filter(n => !n.read).length;

  container.innerHTML = `
    <div class="modal-backdrop" id="notif-drawer-backdrop">
      <div class="drawer-panel notif-drawer glass-panel">
        <div class="drawer-header">
          <div>
            <h3>Notifications (${unreadCount} unread)</h3>
            <span class="sub-text">System telemetry & order updates</span>
          </div>
          <button class="modal-close-btn" id="notif-drawer-close">×</button>
        </div>

        <div class="notif-actions-bar">
          <button class="btn btn-text btn-sm" id="mark-all-read-btn">Mark all as read</button>
        </div>

        <div class="drawer-body">
          ${store.notifications.length === 0 ? `
            <div class="empty-state">
              <p>No notifications at this time.</p>
            </div>
          ` : `
            <div class="notifications-list">
              ${store.notifications.map(n => `
                <div class="notif-card ${!n.read ? 'unread' : ''}" data-id="${n.id}">
                  <div class="notif-icon-type type-${n.type}">
                    ${n.type === 'order' ? '📦' : (n.type === 'admin' ? '⚠️' : '🔔')}
                  </div>
                  <div class="notif-content">
                    <h4 class="notif-title">${n.title}</h4>
                    <p class="notif-msg">${n.message}</p>
                    <span class="notif-time">${n.time}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Bind Events
  document.getElementById('notif-drawer-close')?.addEventListener('click', () => {
    store.notificationsDrawerOpen = false;
    store.notify();
  });

  document.getElementById('notif-drawer-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'notif-drawer-backdrop') {
      store.notificationsDrawerOpen = false;
      store.notify();
    }
  });

  document.getElementById('mark-all-read-btn')?.addEventListener('click', () => {
    store.markAllNotificationsAsRead();
  });

  container.querySelectorAll('.notif-card').forEach(card => {
    card.addEventListener('click', () => {
      store.markNotificationAsRead(card.dataset.id);
    });
  });
}

export function renderToastManager() {
  const container = document.getElementById('toast-container');
  if (!container) return;

  container.innerHTML = store.toasts.map(t => `
    <div class="toast-card toast-${t.type} glass-panel">
      <span class="toast-icon">
        ${t.type === 'success' ? '✅' : (t.type === 'error' ? '❌' : (t.type === 'warning' ? '⚠️' : 'ℹ️'))}
      </span>
      <span class="toast-msg">${t.message}</span>
    </div>
  `).join('');
}
