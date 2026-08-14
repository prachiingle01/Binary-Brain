# 🤖 Binary Brain — Autonomous Agentic E-Commerce & Inventory Ecosystem

> **Authors:** Prachi Ingle • Payal Itankar • Bhagyashri Khanke  
> **Tech Stack:** Node.js • Express • PostgreSQL • Socket.IO • TypeScript • Vitest • Docker & Docker Compose

---

## 🌟 Core System Architecture

Binary-Brain is an enterprise-grade autonomous agentic e-commerce platform with real-time inventory telemetry, automated order cancellation logic, payment processing, role-based authentication, and conversational AI tool execution.

```
                                 ┌──────────────────────────────────────────────┐
                                 │            Client Layer (Web UI)            │
                                 │   - Glassmorphic Neural Product Catalog     │
                                 │   - Multi-facet Filters & Live Search       │
                                 │   - Real-time Order Tracker & Cancel UI     │
                                 │   - Admin Telemetry & Restocking Portal     │
                                 │   - WebSocket AI Assistant Companion        │
                                 └──────────────────────┬───────────────────────┘
                                                        │ (REST + Socket.IO)
                                                        ▼
                                 ┌──────────────────────────────────────────────┐
                                 │        Express.js Backend API Server         │
                                 │   - JWT Auth & Role-Based Access Control    │
                                 │   - Cart & CartItem Engine                  │
                                 │   - Atomic Checkout & Stock Deduction       │
                                 │   - Cancellation & Stock Restoration Engine │
                                 │   - Payment Intent & Refund Gateway         │
                                 │   - Socket.IO Bi-directional Room Broadcast │
                                 └──────────────────────┬───────────────────────┘
                                                        │
                                                        ▼
                                 ┌──────────────────────────────────────────────┐
                                 │     PostgreSQL Database (or In-Memory)       │
                                 │   - users, categories, products             │
                                 │   - carts, cart_items                       │
                                 │   - orders, order_items                     │
                                 │   - inventory_logs, payments                │
                                 └──────────────────────────────────────────────┘
```

---

## 🗄️ PostgreSQL Database Design

The database schema (`backend/src/db/schema.sql`) implements 8 core relational tables with foreign keys, indexes, check constraints, and triggers:

1. **`users`**: Customer & administrator accounts, hashed credentials, loyalty points, and role permissions (`customer` | `admin`).
2. **`categories`**: Product taxonomy (`neural`, `chips`, `wearables`, `sensors`, `drones`).
3. **`products`**: Tech/hardware catalog with real-time stock levels, min-stock alert thresholds, price, ratings, specs (JSONB), and AI insights.
4. **`carts` & `cart_items`**: User and session-bound shopping carts with quantity tracking.
5. **`orders` & `order_items`**: Relational order records with customer details, financials (subtotal, tax, shipping, discount), status transitions, delivery steps, tracking IDs, and cancellation eligibility flags.
6. **`inventory_logs`**: Complete audit trail recording every stock mutation (`ORDER_FULFILLMENT`, `ORDER_CANCELLATION`, `MANUAL_RESTOCK`, `SUPPLIER_RESTOCK`, `ADJUSTMENT`) with previous & new stock counts.
7. **`payments`**: Payment records tracking transaction IDs, status (`Pending`, `Completed`, `Refunded`), payment methods, and gateways.

---

## 📡 REST API Reference

### 1. 🔐 Authentication & User Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer or admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile & loyalty credits |
| `PUT` | `/api/auth/profile` | Authenticated | Update user name, address, and contact info |
| `GET` | `/api/users/users` | Admin | List all registered users and order counts |
| `GET` | `/api/users/users/:id` | Admin | Retrieve user details with order history |

### 2. 🏷️ Categories & Products
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | Public | List all categories with product counts |
| `POST` | `/api/categories` | Admin | Create a new category |
| `GET` | `/api/products` | Public | Filter products by `search`, `category`, `minPrice`, `maxPrice`, `minRating`, `inStock`, `sort`, `page`, `limit` |
| `GET` | `/api/products/:id` | Public | Get product details, specs, and recent inventory logs |
| `POST` | `/api/products` | Admin | Create a new product with stock and min-threshold |
| `PUT` | `/api/products/:id` | Admin | Update product information and stock levels |
| `DELETE` | `/api/products/:id` | Admin | Soft-delete / deactivate product |

### 3. 🛒 Shopping Cart
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Public / Auth | Get current cart with computed subtotal, tax, shipping, and total |
| `POST` | `/api/cart/items` | Public / Auth | Add product to cart (validates available stock) |
| `PUT` | `/api/cart/items/:productId` | Public / Auth | Update quantity of a cart item |
| `DELETE` | `/api/cart/items/:productId` | Public / Auth | Remove item from cart |
| `DELETE` | `/api/cart` | Public / Auth | Clear all items in cart |

### 4. 📦 Orders & Cancellation Logic
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Public / Auth | Checkout: validates stock, deducts stock atomically, creates order + order items, logs inventory, emits WebSocket event |
| `GET` | `/api/orders` | Public / Auth | List orders for current user (or all if admin) |
| `GET` | `/api/orders/:orderId` | Public / Auth | Retrieve order tracking timeline, items, and status |
| `POST` | `/api/orders/:orderId/cancel` | Public / Auth | **Cancel Order**: checks eligibility (`Processing`/`Pending`), restores product stock, creates inventory cancellation log, issues refund, and emits WebSocket event |
| `PATCH` | `/api/orders/:orderId/status` | Admin | Progress order status (`Processing` ➔ `Shipped` ➔ `Out for Delivery` ➔ `Delivered`) |

### 5. 📊 Inventory Telemetry & Management
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory/status` | Public / Admin | Real-time telemetry, low-stock warnings, and health score |
| `POST` | `/api/inventory/restock` | Admin / Supplier | Restock product stock (+units), log reason, emit WebSocket alert |
| `GET` | `/api/inventory/logs` | Admin | Full audit log of all stock movements |

### 6. 💳 Payments
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments/create-intent` | Public / Auth | Create Stripe / CyberPay payment intent |
| `POST` | `/api/payments/confirm` | Public / Auth | Confirm & capture payment transaction |
| `POST` | `/api/payments/refund` | Public / Auth | Issue refund for order |

### 7. 📈 Admin Sales & Analytics
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Admin | Revenue KPI, active orders, low stock items, top selling products |
| `GET` | `/api/admin/sales-report` | Admin | Sales breakdown by status, category, and date |

### 8. 🤖 AI Agent Assistant
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/query` | Public | Conversational assistant with tool execution for order tracking, stock alerts, cancellation, and product search |

---

## 🚫 Order Cancellation Engine Logic

```
User / AI requests cancellation (POST /api/orders/:orderId/cancel)
                          │
                          ▼
            Is Order in DB & Accessible? ────► [No] ➔ Return 404
                          │
                         [Yes]
                          ▼
            Is Status "Pending" or "Processing"?
                   │                 │
                 [No]              [Yes]
                   │                 │
                   ▼                 ▼
          Return 400 Error     1. For each OrderItem:
     (Order cannot be cancelled    - Atomic Product.stock += item.quantity
      once Shipped / Delivered)    - Insert into inventory_logs (ORDER_CANCELLATION)
                               2. Set Order.status = "Cancelled"
                               3. Set Order.paymentStatus = "Refunded"
                               4. Update Payment record (Status = "Refunded")
                               5. Broadcast WebSocket 'order:cancelled' event
                               6. Return success confirmation with refund receipt
```

---

## 🚀 Quick Start (Local Development)

### 1. Run with Node.js:
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. Run Automated Tests:
```bash
cd backend
npm test
```

### 3. Run with Docker Compose 🐳:
```bash
docker compose up --build
```
*Spins up PostgreSQL container and backend API container.*