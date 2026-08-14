import { User, Category, Product, Order, InventoryLog, Payment } from '../db/models';

// Pre-hashed bcrypt passwords for demo accounts ('admin123' and 'user123')
// Fallback hash or sync hash helper
export const SEED_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@binarybrain.io',
    passwordHash: '$2a$10$wT0lG8qK8fD8pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6e', // 'admin123'
    name: 'Payal (System Admin)',
    role: 'admin',
    phone: '+1 (555) 800-9988',
    address: 'HQ Ops Suite 900, Cyber Tower, Silicon Valley, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    loyaltyPoints: 10000,
    tier: 'Administrator',
    isActive: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'usr-cust-1',
    email: 'user@binarybrain.io',
    passwordHash: '$2a$10$wT0lG8qK8fD8pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6e', // 'user123'
    name: 'Prachi Ingle',
    role: 'customer',
    phone: '+1 (555) 019-2834',
    address: '104 Binary Tower, Tech City, Silicon Valley, CA 94025',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    loyaltyPoints: 4850,
    tier: 'Cyber Elite Member',
    isActive: true,
    createdAt: '2026-02-15T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'usr-cust-2',
    email: 'bhagyashri@binarybrain.io',
    passwordHash: '$2a$10$wT0lG8qK8fD8pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6pXqX6e', // 'user123'
    name: 'Bhagyashri Khanke',
    role: 'customer',
    phone: '+1 (555) 443-8821',
    address: '77 Quantum Gate, Neo Austin, TX 78701',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    loyaltyPoints: 2100,
    tier: 'Neural Pro Member',
    isActive: true,
    createdAt: '2026-03-10T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  }
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'neural',
    name: 'Neural Hardware',
    slug: 'neural',
    icon: '🧠',
    description: 'Cortical bio-interfaces, direct neural links, and haptic feedback apparatus.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'chips',
    name: 'AI Accelerators',
    slug: 'chips',
    icon: '💾',
    description: 'High TOPS edge inference modules, tensor processors, and post-quantum cryptographic HSMs.',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'wearables',
    name: 'Smart Cyberwear',
    slug: 'wearables',
    icon: '⌚',
    description: 'Biometric telemetry rings, micro-OLED augmented reality visors, and neural implants.',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'sensors',
    name: 'Autonomous Sensors',
    slug: 'sensors',
    icon: '📡',
    description: 'Solid-state LiDAR systems, ultrasonic arrays, and multispectral vision suites.',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'drones',
    name: 'Robotic Drones',
    slug: 'drones',
    icon: '🚁',
    description: 'Autonomous delivery UAVs, high-endurance surveillance quadcopters, and swarm telemetry units.',
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'NeuralLink BCI Headset X1',
    slug: 'neurallink-bci-headset-x1',
    categoryId: 'neural',
    price: 899.99,
    rating: 4.9,
    reviewsCount: 128,
    stock: 14,
    minStockThreshold: 5,
    tag: 'AI Top Pick',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'Direct cortical interface with 1024-channel high-bandwidth signal processing for sub-millisecond AI model interaction.',
    specs: {
      'Channels': '1024 Neural Electrodes',
      'Latency': '< 1.5ms',
      'Battery Life': '24 Hours',
      'Connectivity': 'Quantum Mesh Bluetooth 5.4'
    },
    aiInsight: 'High demand product. Inventory prediction estimates stock depletion within 4 days. Recommended automated reorder.',
    isActive: true,
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'TensorCore Edge Unit 8TB',
    slug: 'tensorcore-edge-unit-8tb',
    categoryId: 'chips',
    price: 1499.00,
    rating: 4.8,
    reviewsCount: 94,
    stock: 6,
    minStockThreshold: 10,
    tag: 'Low Stock',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
    description: 'Compact 500 TOPS edge AI accelerator capable of running 70B parameter LLMs locally at 45 tokens/sec.',
    specs: {
      'Compute': '500 INT8 TOPS',
      'VRAM': '32GB LPDDR5X',
      'Power Draw': '65W Max',
      'Form Factor': 'PCIe Gen 5 Mini'
    },
    aiInsight: 'Stock trigger alerted! Current stock (6) is below minimum threshold (10). Auto-restock order pending.',
    isActive: true,
    createdAt: '2026-01-12T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'CyberHUD Smart AR Visor',
    slug: 'cyberhud-smart-ar-visor',
    categoryId: 'wearables',
    price: 499.50,
    rating: 4.7,
    reviewsCount: 210,
    stock: 32,
    minStockThreshold: 8,
    tag: 'Best Seller',
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
    description: 'Lightweight micro-OLED augmented reality visor with real-time biometric HUD and spatial audio drivers.',
    specs: {
      'Display': 'Dual 4K Micro-OLED',
      'Refresh Rate': '120Hz',
      'FOV': '110 Degrees',
      'Weight': '142 grams'
    },
    aiInsight: 'Optimal stock level maintained. Popular among enterprise field technicians and cyberware enthusiasts.',
    isActive: true,
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'OmniScan LiDAR Array v4',
    slug: 'omniscan-lidar-array-v4',
    categoryId: 'sensors',
    price: 349.99,
    rating: 4.6,
    reviewsCount: 76,
    stock: 3,
    minStockThreshold: 5,
    tag: 'Low Stock',
    badge: 'Critical Stock',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80',
    description: '360-degree solid-state LiDAR sensor with 200m range for autonomous vehicle and drone navigation.',
    specs: {
      'Range': '200 Meters',
      'FOV': '360° Horizontal x 90° Vertical',
      'Points/Sec': '1.5 Million',
      'IP Rating': 'IP67 Weatherproof'
    },
    aiInsight: 'Critical low stock level (3 remaining). Agentic supplier bot initiated auto-quote for 25 additional units.',
    isActive: true,
    createdAt: '2026-01-18T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'AeroBot Recon Drone M5',
    slug: 'aerobot-recon-drone-m5',
    categoryId: 'drones',
    price: 1299.99,
    rating: 4.9,
    reviewsCount: 88,
    stock: 18,
    minStockThreshold: 6,
    tag: 'AI Choice',
    badge: 'New',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
    description: 'Autonomous surveillance quadcopter equipped with thermal vision, AI target tracking, and 45-min flight endurance.',
    specs: {
      'Flight Time': '45 Minutes',
      'Range': '15 kilometers',
      'Camera': '4K Thermal & Optical Dual Camera',
      'Autonomous Level': 'Level 4 Autonomy'
    },
    aiInsight: 'High customer satisfaction rating (4.9/5). Low warranty claim rate of 0.2%.',
    isActive: true,
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'QuantumKey HSM Crypto Vault',
    slug: 'quantumkey-hsm-crypto-vault',
    categoryId: 'chips',
    price: 2100.00,
    rating: 5.0,
    reviewsCount: 42,
    stock: 8,
    minStockThreshold: 4,
    tag: 'Enterprise',
    badge: 'Secure',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    description: 'Post-quantum cryptographic hardware security module for zero-trust key storage and agent authorization.',
    specs: {
      'Security Level': 'FIPS 140-3 Level 4',
      'Algorithms': 'Kyber-1024, Dilithium, RSA-4096',
      'Interface': 'USB-C & PCIe x4',
      'Tamper Shield': 'Active Mesh Self-Destruct'
    },
    aiInsight: 'Enterprise favorite. Frequently purchased in bundles with TensorCore units.',
    isActive: true,
    createdAt: '2026-01-22T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Biometric Ring Sentinel Pro',
    slug: 'biometric-ring-sentinel-pro',
    categoryId: 'wearables',
    price: 299.00,
    rating: 4.5,
    reviewsCount: 154,
    stock: 25,
    minStockThreshold: 10,
    tag: 'Trending',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    description: 'Titanium biometric ring tracking continuous heart rate variability, skin temperature, and neural stress indexes.',
    specs: {
      'Material': 'Grade 5 Aerospace Titanium',
      'Sensors': 'PPG, ECG, GSR, Temp',
      'Waterproof': '100m (10 ATM)',
      'Battery': '7 Days'
    },
    aiInsight: 'Consistent steady sales velocity. Inventory turnover rate is 12 days.',
    isActive: true,
    createdAt: '2026-01-25T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'HoloLens Haptic CyberGloves',
    slug: 'hololens-haptic-cybergloves',
    categoryId: 'neural',
    price: 649.99,
    rating: 4.8,
    reviewsCount: 67,
    stock: 12,
    minStockThreshold: 5,
    tag: 'VR Tech',
    badge: 'Recommended',
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80',
    description: 'Precision force-feedback gloves delivering realistic physical touch sensation in virtual and robotic environments.',
    specs: {
      'Actuators': '20 Active Micro-Pneumatic Cells',
      'Force Output': '5N per finger',
      'Tracking Accuracy': '0.1mm Spatial Precision',
      'Weight': '210g Pair'
    },
    aiInsight: 'Recommended for robotics developers and immersive simulation labs.',
    isActive: true,
    createdAt: '2026-01-28T00:00:00.000Z',
    updatedAt: '2026-08-14T00:00:00.000Z'
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-8921',
    userId: 'usr-cust-1',
    customerName: 'Prachi Ingle',
    customerEmail: 'user@binarybrain.io',
    subtotal: 1399.49,
    taxAmount: 111.96,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 1511.45,
    status: 'Processing',
    shippingAddress: '104 Binary Tower, Tech City, Silicon Valley, CA 94025',
    paymentMethod: 'CyberPay (Crypto)',
    paymentStatus: 'Paid',
    trackingStep: 1,
    carrier: 'AeroBot Logistics #442',
    trackingNumber: 'TRK-AB-8921-99',
    estimatedDelivery: 'August 16, 2026',
    cancellationEligible: true,
    items: [
      {
        id: 'item-8921-1',
        orderId: 'ORD-8921',
        productId: 'prod-1',
        productName: 'NeuralLink BCI Headset X1',
        productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        unitPrice: 899.99,
        quantity: 1,
        totalPrice: 899.99,
        createdAt: '2026-08-10T14:30:00.000Z'
      },
      {
        id: 'item-8921-2',
        orderId: 'ORD-8921',
        productId: 'prod-3',
        productName: 'CyberHUD Smart AR Visor',
        productImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
        unitPrice: 499.50,
        quantity: 1,
        totalPrice: 499.50,
        createdAt: '2026-08-10T14:30:00.000Z'
      }
    ],
    createdAt: '2026-08-10T14:30:00.000Z',
    updatedAt: '2026-08-10T14:30:00.000Z'
  },
  {
    id: 'ORD-7643',
    userId: 'usr-cust-1',
    customerName: 'Prachi Ingle',
    customerEmail: 'user@binarybrain.io',
    subtotal: 2100.00,
    taxAmount: 168.00,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 2268.00,
    status: 'Shipped',
    shippingAddress: '104 Binary Tower, Tech City, Silicon Valley, CA 94025',
    paymentMethod: 'Credit Card (**** 8892)',
    paymentStatus: 'Paid',
    trackingStep: 3,
    carrier: 'FedEx Quantum Express',
    trackingNumber: 'FDX-99882241',
    estimatedDelivery: 'Tomorrow, 2:00 PM',
    cancellationEligible: false,
    items: [
      {
        id: 'item-7643-1',
        orderId: 'ORD-7643',
        productId: 'prod-6',
        productName: 'QuantumKey HSM Crypto Vault',
        productImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
        unitPrice: 2100.00,
        quantity: 1,
        totalPrice: 2100.00,
        createdAt: '2026-08-04T09:15:00.000Z'
      }
    ],
    createdAt: '2026-08-04T09:15:00.000Z',
    updatedAt: '2026-08-05T11:00:00.000Z'
  },
  {
    id: 'ORD-5512',
    userId: 'usr-cust-2',
    customerName: 'Bhagyashri Khanke',
    customerEmail: 'bhagyashri@binarybrain.io',
    subtotal: 649.99,
    taxAmount: 52.00,
    shippingFee: 0,
    discountAmount: 0,
    totalAmount: 701.99,
    status: 'Delivered',
    shippingAddress: '77 Quantum Gate, Neo Austin, TX 78701',
    paymentMethod: 'Credit Card (**** 4410)',
    paymentStatus: 'Paid',
    trackingStep: 4,
    carrier: 'DHL Autonomous Cargo',
    trackingNumber: 'DHL-5512-TX',
    estimatedDelivery: 'Delivered on July 30, 2026',
    cancellationEligible: false,
    items: [
      {
        id: 'item-5512-1',
        orderId: 'ORD-5512',
        productId: 'prod-8',
        productName: 'HoloLens Haptic CyberGloves',
        productImage: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80',
        unitPrice: 649.99,
        quantity: 1,
        totalPrice: 649.99,
        createdAt: '2026-07-28T16:00:00.000Z'
      }
    ],
    createdAt: '2026-07-28T16:00:00.000Z',
    updatedAt: '2026-07-30T15:30:00.000Z'
  }
];

export const SEED_INVENTORY_LOGS: InventoryLog[] = [
  {
    id: 'log-1',
    productId: 'prod-1',
    changeAmount: -1,
    previousStock: 15,
    newStock: 14,
    reason: 'ORDER_FULFILLMENT',
    orderId: 'ORD-8921',
    notes: 'Order #ORD-8921 fulfilled automatically by Agentic Dispatch',
    createdAt: '2026-08-10T14:30:00.000Z'
  },
  {
    id: 'log-2',
    productId: 'prod-2',
    changeAmount: 10,
    previousStock: 0,
    newStock: 10,
    reason: 'SUPPLIER_RESTOCK',
    notes: 'Autonomous supplier RESTOCK completed via API handshake',
    createdAt: '2026-08-01T10:00:00.000Z'
  }
];

export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-8921',
    orderId: 'ORD-8921',
    amount: 1511.45,
    currency: 'USD',
    provider: 'CyberPay',
    transactionId: 'TXN-CP-99882233',
    status: 'Completed',
    paymentDetails: { network: 'Solana', blockHeight: 284910291 },
    createdAt: '2026-08-10T14:30:05.000Z',
    updatedAt: '2026-08-10T14:30:05.000Z'
  }
];
