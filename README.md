# 🤖 Binary Brain — Autonomous Agentic E-Commerce System

> **Authors:** Prachi Ingle • Payal Itankar • Bhagyashri Khanke  
> **Tech Stack:** Node.js • Express • Socket.IO • React • Vite • TypeScript • Tailwind CSS • Docker • Vitest • GitHub Actions

---

## 🌟 Key Features

1. **🤖 AI Customer Assistant**:
   - Natural-language query parsing and tool execution state machine.
   - Context-aware answers for store policies, products, and order statuses.
2. **📦 Natural-Language Order Lookup**:
   - Instant order resolution via queries like `"Where is my order ORD-1001?"` or `"Check tracking for package 1002"`.
   - Returns order status, carrier info (`FedEx`, `UPS`, `DHL`), tracking codes, and step-by-step progress nodes.
3. **🔍 Intelligent Product Search & AI Recommendations**:
   - Semantic natural language matching (e.g. `"Show wireless noise canceling headphones under $200"`).
   - Ranked product search results with price range filters and AI recommendation cards.
4. **📡 Real-Time WebSocket AI Chat**:
   - Bi-directional Socket.IO stream with typing indicators and tool execution feedback (`⚡ Executing tool: lookupOrder`).
5. **🚚 Live Order-Status Updates & Notifications**:
   - Built-in **Admin Event Simulator** allowing status transitions (`Pending` ➔ `Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`).
   - Real-time room broadcasts push live timeline node updates and toast alerts across all connected clients.
6. **🐳 Docker & Docker Compose Containerization**:
   - Single-command orchestration via `docker compose up --build`.
7. **🧪 Automated Test Suite & GitHub Actions CI**:
   - Comprehensive API and AI tool execution tests written in Vitest.
   - GitHub Actions workflow (`.github/workflows/ci.yml`) enforcing automated test verification on every commit.

---

## 🏗️ Architecture Overview

```
                          ┌─────────────────────────────────────┐
                          │     React + Vite Frontend (UI)      │
                          │ - Glassmorphic Product Catalog      │
                          │ - Live Order Timeline Tracker       │
                          │ - Admin Status Event Simulator      │
                          │ - WebSocket AI Assistant Chat       │
                          └──────────────────┬──────────────────┘
                                             │ (REST & WebSockets)
                                             ▼
                          ┌─────────────────────────────────────┐
                          │   Node.js + Express Backend API     │
                          │ - Socket.IO Server (Live Push)      │
                          │ - AI Tool Execution Engine          │
                          │ - In-Memory Store Manager           │
                          └─────────────────────────────────────┘
```

---

## 🚀 Quick Start (Local Development)

### Option 1: Running with Node.js & NPM

1. **Start Backend API & WebSocket Server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   *Backend runs at:* `http://localhost:5000`

2. **Start Frontend Web Application:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend runs at:* `http://localhost:3000`

---

### Option 2: Running with Docker Compose 🐳

To launch both frontend and backend in unified isolated containers:

```bash
docker compose up --build
```

- **Frontend App:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`

---

## 🧪 Automated Testing

Run the automated Vitest test suite covering product search APIs, order tracking logic, order status updates, and AI tool execution:

```bash
cd backend
npm test
```

---

## 📡 API Reference Endpoint Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck & uptime check |
| `GET` | `/api/products` | Search products with query, maxPrice, category filters |
| `GET` | `/api/products/:id` | Retrieve product details by ID |
| `GET` | `/api/orders` | Retrieve list of sample customer orders |
| `GET` | `/api/orders/:orderId` | Natural-language order lookup by ID (e.g. `ORD-1001`) |
| `PATCH` | `/api/orders/:orderId/status` | Update order status and trigger live WebSocket push |
| `POST` | `/api/ai/query` | REST fallback endpoint for AI query processing & tool calling |

---

## 🚢 Deployment Guide

### Deploying Backend
The backend is packaged into a production-ready Node.js container (`backend/Dockerfile`). Deploy to platforms like **Render**, **Fly.io**, **Railway**, or **AWS ECS**:
```bash
docker build -t binary-brain-backend ./backend
docker run -p 5000:5000 binary-brain-backend
```

### Deploying Frontend
The frontend builds optimized static assets into `/dist` via Vite and serves them using Nginx (`frontend/Dockerfile`). Deploy directly to **Vercel**, **Netlify**, or container registries.