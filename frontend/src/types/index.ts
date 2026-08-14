export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  tags: string[];
  imageUrl: string;
  specs: Record<string, string>;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface TrackingStep {
  status: string;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  shippingAddress: string;
  createdAt: string;
  trackingHistory: TrackingStep[];
}

export interface ToolCallExecution {
  toolName: string;
  parameters: Record<string, any>;
  resultSummary: string;
}

export interface AgentResponse {
  text: string;
  intent: 'ORDER_LOOKUP' | 'PRODUCT_SEARCH' | 'RECOMMENDATION' | 'ORDER_UPDATE' | 'STORE_POLICY' | 'GENERAL';
  toolCallsExecuted: ToolCallExecution[];
  payload?: {
    products?: Product[];
    order?: Order;
    orders?: Order[];
    recommendations?: Product[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  toolCalls?: ToolCallExecution[];
  payload?: AgentResponse['payload'];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  orderId?: string;
  timestamp: string;
  read?: boolean;
}
