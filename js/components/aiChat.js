// AI Chat Component: Agentic AI Assistant Widget ("Binary Agent")

import { store } from '../store.js';

export function renderAIChatWidget() {
  const container = document.getElementById('ai-chat-container');
  if (!container) return;

  // Persistent chat message history in memory
  if (!window.bbChatHistory) {
    window.bbChatHistory = [
      {
        sender: 'ai',
        text: 'Greetings! I am Binary Assistant, your autonomous agentic inventory companion. How can I assist your setup today?',
        time: 'Just now'
      }
    ];
  }

  const isExpanded = window.bbChatExpanded || false;

  container.innerHTML = `
    <div class="ai-chat-widget ${isExpanded ? 'expanded' : 'collapsed'}">
      ${!isExpanded ? `
        <button class="ai-chat-toggle-btn glass-panel" id="ai-chat-open">
          <span class="ai-badge">AI</span>
          <span class="ai-icon">🤖</span>
          <span class="toggle-label">Ask Binary AI</span>
        </button>
      ` : `
        <div class="ai-chat-box glass-panel">
          <div class="ai-chat-header">
            <div class="ai-header-title">
              <span class="ai-status-dot"></span>
              <strong>Binary Agentic Assistant</strong>
              <span class="sub-status">Online • GPT-4 Neural Sync</span>
            </div>
            <button class="ai-close-btn" id="ai-chat-close">✕</button>
          </div>

          <div class="ai-chat-messages" id="ai-messages-list">
            ${window.bbChatHistory.map(msg => `
              <div class="chat-message message-${msg.sender}">
                <div class="message-bubble">
                  <p>${msg.text}</p>
                  <span class="message-time">${msg.time}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Suggested Action Chips -->
          <div class="ai-suggestion-chips">
            <button class="chip-btn" data-query="Recommend low stock products">⚠️ Low stock items?</button>
            <button class="chip-btn" data-query="Where is my active order?">📦 Track my order</button>
            <button class="chip-btn" data-query="Show me products under $500">💰 Hardware under $500</button>
          </div>

          <form id="ai-chat-form" class="ai-chat-input-row">
            <input type="text" id="ai-chat-input" class="form-input" placeholder="Ask about products, orders, or stock..." required>
            <button type="submit" class="btn btn-primary btn-sm">Send 🚀</button>
          </form>
        </div>
      `}
    </div>
  `;

  // Scroll to bottom of message list
  const msgList = document.getElementById('ai-messages-list');
  if (msgList) msgList.scrollTop = msgList.scrollHeight;

  // Bind Events
  document.getElementById('ai-chat-open')?.addEventListener('click', () => {
    window.bbChatExpanded = true;
    renderAIChatWidget();
  });

  document.getElementById('ai-chat-close')?.addEventListener('click', () => {
    window.bbChatExpanded = false;
    renderAIChatWidget();
  });

  container.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleUserSendMessage(btn.dataset.query);
    });
  });

  document.getElementById('ai-chat-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('ai-chat-input');
    if (input && input.value.trim()) {
      handleUserSendMessage(input.value.trim());
      input.value = '';
    }
  });
}

function handleUserSendMessage(userText) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  window.bbChatHistory.push({ sender: 'user', text: userText, time });
  renderAIChatWidget();

  // Simulate AI Response
  setTimeout(() => {
    const replyText = generateAIResponse(userText);
    window.bbChatHistory.push({ sender: 'ai', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    renderAIChatWidget();
  }, 700);
}

function generateAIResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('track') || q.includes('order') || q.includes('where')) {
    const lastOrder = store.orders[0];
    if (lastOrder) {
      return `Your latest order #${lastOrder.id} is currently **${lastOrder.status}**. Expected delivery is **${lastOrder.estimatedDelivery}**. Would you like me to open live tracking?`;
    }
    return 'You have no active orders placed yet.';
  }

  if (q.includes('stock') || q.includes('low')) {
    const lowStockItems = store.products.filter(p => p.stock <= p.minStockThreshold);
    if (lowStockItems.length > 0) {
      return `Alert! Currently ${lowStockItems.length} products have low stock: **${lowStockItems.map(i => i.name).join(', ')}**. Restock supplier bots are monitoring inventory telemetry.`;
    }
    return 'All inventory stock levels are healthy and within optimal parameters!';
  }

  if (q.includes('under') || q.includes('price') || q.includes('500') || q.includes('cheap')) {
    const affordable = store.products.filter(p => p.price <= 500);
    return `Here are top recommendations under $500: **${affordable.map(p => `${p.name} ($${p.price})`).join(', ')}**. Check them out in the catalog!`;
  }

  if (q.includes('recommend') || q.includes('best') || q.includes('neural')) {
    const top = store.products[0];
    return `Our top recommended neural interface is **${top.name}** rated ${top.rating}★. It features 1024-channel cortical mapping with sub-1.5ms latency.`;
  }

  return `I have analyzed your request: "${query}". As an autonomous agent, I can assist with product search, real-time stock alerts, or tracking order dispatches. Let me know what you need!`;
}
