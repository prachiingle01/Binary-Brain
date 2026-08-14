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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PROD-001',
    name: 'AeroPulse Wireless Noise-Canceling Headphones',
    category: 'Audio & Wearables',
    price: 149.99,
    rating: 4.8,
    reviewsCount: 324,
    inStock: true,
    stockCount: 45,
    description: 'Immersive spatial audio with active noise cancellation, 40-hour battery life, and ultra-soft memory foam earcups.',
    tags: ['wireless', 'headphones', 'noise-canceling', 'bluetooth', 'audio', 'gaming'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    specs: {
      'Battery Life': '40 Hours',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm Aux',
      'Weight': '250g',
      'Noise Control': 'Adaptive ANC'
    }
  },
  {
    id: 'PROD-002',
    name: 'QuantumX 27" 4K Gaming Monitor',
    category: 'Electronics & Display',
    price: 389.50,
    rating: 4.9,
    reviewsCount: 198,
    inStock: true,
    stockCount: 18,
    description: 'Ultra-fast 165Hz refresh rate with 1ms response time, HDR600 color precision, and dual HDMI 2.1 ports.',
    tags: ['monitor', 'gaming', '4k', 'display', '165hz', 'hdr', 'computer'],
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    specs: {
      'Resolution': '3840 x 2160 (4K)',
      'Refresh Rate': '165Hz',
      'Panel Type': 'IPS',
      'Response Time': '1ms GTG'
    }
  },
  {
    id: 'PROD-003',
    name: 'LuxeMerino Cozy Winter Wool Sweater',
    category: 'Apparel & Fashion',
    price: 79.99,
    rating: 4.6,
    reviewsCount: 88,
    inStock: true,
    stockCount: 60,
    description: '100% organic Merino wool turtleneck sweater engineered for warmth, breathability, and timeless elegance.',
    tags: ['clothing', 'sweater', 'winter', 'wool', 'cozy', 'fashion', 'warm'],
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    specs: {
      'Material': '100% Organic Merino Wool',
      'Fit': 'Regular Comfort Fit',
      'Care': 'Hand Wash or Dry Clean'
    }
  },
  {
    id: 'PROD-004',
    name: 'ApexStride Pro Waterproof Running Shoes',
    category: 'Apparel & Footwear',
    price: 119.00,
    rating: 4.7,
    reviewsCount: 215,
    inStock: true,
    stockCount: 32,
    description: 'Lightweight responsive marathon running shoes featuring carbon fiber plate spring design and Gore-Tex waterproofing.',
    tags: ['shoes', 'running', 'footwear', 'sports', 'marathon', 'waterproof'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    specs: {
      'Terrain': 'Road & Trail',
      'Cushioning': 'Max Responsiveness',
      'Waterproof': 'Gore-Tex Membrane'
    }
  },
  {
    id: 'PROD-005',
    name: 'NexusPad Pro Wireless Ergonomic Keyboard',
    category: 'Computer Accessories',
    price: 89.99,
    rating: 4.5,
    reviewsCount: 142,
    inStock: true,
    stockCount: 25,
    description: 'Split mechanical feel ergonomic keyboard with customizable RGB backlighting, multi-device bluetooth pairing.',
    tags: ['keyboard', 'ergonomic', 'wireless', 'office', 'computer', 'accessory'],
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
    specs: {
      'Switch Type': 'Silent Tactile',
      'Battery': 'Rechargeable 3000mAh',
      'Layout': 'Full 104 Keys'
    }
  },
  {
    id: 'PROD-006',
    name: 'SolarTrek 50L Waterproof Hiking Backpack',
    category: 'Outdoor & Travel',
    price: 129.50,
    rating: 4.9,
    reviewsCount: 94,
    inStock: true,
    stockCount: 12,
    description: 'All-weather adventure backpack with integrated solar charging power bank panel and internal hydration bladder sleeve.',
    tags: ['backpack', 'hiking', 'outdoor', 'solar', 'travel', 'camping'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
    specs: {
      'Capacity': '50 Liters',
      'Solar Panel Output': '10W 5V USB-C',
      'Weight': '1.4 kg'
    }
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    orderId: 'ORD-1001',
    customerName: 'Alex Mercer',
    customerEmail: 'alex.mercer@example.com',
    items: [
      {
        productId: 'PROD-001',
        productName: 'AeroPulse Wireless Noise-Canceling Headphones',
        quantity: 1,
        price: 149.99
      }
    ],
    totalAmount: 149.99,
    status: 'Shipped',
    carrier: 'FedEx Express',
    trackingNumber: 'FX-984210492-US',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
    shippingAddress: '742 Evergreen Terrace, Springfield, OR 97477',
    createdAt: '2026-08-11T09:30:00Z',
    trackingHistory: [
      {
        status: 'Order Placed',
        location: 'Online Storefront',
        timestamp: '2026-08-11 09:30 AM',
        description: 'Payment processed and order confirmed.',
        completed: true
      },
      {
        status: 'Processing',
        location: 'Fulfillment Center - Seattle, WA',
        timestamp: '2026-08-11 02:15 PM',
        description: 'Items packed and verified by automated scanner.',
        completed: true
      },
      {
        status: 'Shipped',
        location: 'FedEx Regional Transit Hub - Portland, OR',
        timestamp: '2026-08-12 11:45 AM',
        description: 'Package departed carrier facility in transit.',
        completed: true
      },
      {
        status: 'Out for Delivery',
        location: 'Local Delivery Hub - Springfield, OR',
        timestamp: 'Pending',
        description: 'Package will be loaded onto delivery vehicle.',
        completed: false
      },
      {
        status: 'Delivered',
        location: '742 Evergreen Terrace',
        timestamp: 'Pending',
        description: 'Package handed off to recipient.',
        completed: false
      }
    ]
  },
  {
    orderId: 'ORD-1002',
    customerName: 'Samantha Vance',
    customerEmail: 'samantha.vance@example.com',
    items: [
      {
        productId: 'PROD-002',
        productName: 'QuantumX 27" 4K Gaming Monitor',
        quantity: 1,
        price: 389.50
      },
      {
        productId: 'PROD-005',
        productName: 'NexusPad Pro Wireless Ergonomic Keyboard',
        quantity: 1,
        price: 89.99
      }
    ],
    totalAmount: 479.49,
    status: 'Processing',
    carrier: 'UPS Ground',
    trackingNumber: '1Z9999999999999999',
    estimatedDelivery: 'August 16, 2026',
    shippingAddress: '100 Cyberpunk Way, San Francisco, CA 94105',
    createdAt: '2026-08-13T08:15:00Z',
    trackingHistory: [
      {
        status: 'Order Placed',
        location: 'Online Storefront',
        timestamp: '2026-08-13 08:15 AM',
        description: 'Payment authorized successfully.',
        completed: true
      },
      {
        status: 'Processing',
        location: 'Warehouse A - San Jose, CA',
        timestamp: '2026-08-13 10:00 AM',
        description: 'Item being picked from inventory shelf.',
        completed: true
      },
      {
        status: 'Shipped',
        location: 'UPS Sorting Facility',
        timestamp: 'Pending',
        description: 'Carrier receipt scan pending.',
        completed: false
      },
      {
        status: 'Out for Delivery',
        location: 'San Francisco Hub',
        timestamp: 'Pending',
        description: 'Scheduled for local delivery.',
        completed: false
      },
      {
        status: 'Delivered',
        location: 'Destination',
        timestamp: 'Pending',
        description: 'Final delivery destination.',
        completed: false
      }
    ]
  },
  {
    orderId: 'ORD-1003',
    customerName: 'Marcus Wright',
    customerEmail: 'marcus.w@example.com',
    items: [
      {
        productId: 'PROD-003',
        productName: 'LuxeMerino Cozy Winter Wool Sweater',
        quantity: 2,
        price: 79.99
      }
    ],
    totalAmount: 159.98,
    status: 'Delivered',
    carrier: 'DHL Express',
    trackingNumber: 'DHL-384910283',
    estimatedDelivery: 'Delivered on August 10, 2026',
    shippingAddress: '42 Wallaby Way, Sydney / NY Branch, NY 10001',
    createdAt: '2026-08-08T14:20:00Z',
    trackingHistory: [
      {
        status: 'Order Placed',
        location: 'Online Storefront',
        timestamp: '2026-08-08 02:20 PM',
        description: 'Order confirmed.',
        completed: true
      },
      {
        status: 'Processing',
        location: 'Fulfillment Center - Brooklyn, NY',
        timestamp: '2026-08-08 05:30 PM',
        description: 'Item packed in eco-friendly mailer.',
        completed: true
      },
      {
        status: 'Shipped',
        location: 'DHL Hub - JFK Airport, NY',
        timestamp: '2026-08-09 08:00 AM',
        description: 'Package in transit with carrier.',
        completed: true
      },
      {
        status: 'Out for Delivery',
        location: 'Local NYC Courier',
        timestamp: '2026-08-10 09:10 AM',
        description: 'Courier out for doorstep delivery.',
        completed: true
      },
      {
        status: 'Delivered',
        location: '42 Wallaby Way, NY',
        timestamp: '2026-08-10 01:45 PM',
        description: 'Delivered to front porch. Signature acquired.',
        completed: true
      }
    ]
  }
];

export const STORE_POLICIES = {
  returnPolicy: 'We offer a 30-day risk-free return policy for all unused items in original packaging with full refund guarantee.',
  shippingInfo: 'Standard shipping takes 3-5 business days. Express shipping delivers in 1-2 business days with free tracking on orders over $50.',
  supportEmail: 'support@binarybrain.ai',
  supportHours: '24/7 Real-Time AI Support Assistant available via instant chat.'
};
