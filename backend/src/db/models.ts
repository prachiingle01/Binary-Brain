// TypeScript Domain Models & Relational Entity Definitions

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  loyaltyPoints: number;
  tier: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  minStockThreshold: number;
  tag: string;
  badge: string;
  image: string;
  description: string;
  specs: Record<string, string>;
  aiInsight?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  trackingStep: number; // 0 to 4
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  cancellationEligible: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export type InventoryLogReason =
  | 'ORDER_FULFILLMENT'
  | 'ORDER_CANCELLATION'
  | 'MANUAL_RESTOCK'
  | 'SUPPLIER_RESTOCK'
  | 'ADJUSTMENT';

export interface InventoryLog {
  id: string;
  productId: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: InventoryLogReason;
  orderId?: string;
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  provider: 'Stripe' | 'CyberPay' | 'Card' | 'Mock';
  transactionId: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
  paymentDetails?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'stock' | 'newest' | 'relevance';
  page?: number;
  limit?: number;
}
