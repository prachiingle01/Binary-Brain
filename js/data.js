// Mock Data Store for Binary-Brain E-Commerce & Inventory Ecosystem

export const MOCK_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '⚡' },
  { id: 'neural', name: 'Neural Hardware', icon: '🧠' },
  { id: 'chips', name: 'AI Accelerators', icon: '💾' },
  { id: 'wearables', name: 'Smart Cyberwear', icon: '⌚' },
  { id: 'sensors', name: 'Autonomous Sensors', icon: '📡' },
  { id: 'drones', name: 'Robotic Drones', icon: '🚁' }
];

export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'NeuralLink BCI Headset X1',
    category: 'neural',
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
    aiInsight: 'High demand product. Inventory prediction estimates stock depletion within 4 days. Recommended automated reorder.'
  },
  {
    id: 'prod-2',
    name: 'TensorCore Edge Unit 8TB',
    category: 'chips',
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
    aiInsight: 'Stock trigger alerted! Current stock (6) is below minimum threshold (10). Auto-restock order pending.'
  },
  {
    id: 'prod-3',
    name: 'CyberHUD Smart AR Visor',
    category: 'wearables',
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
    aiInsight: 'Optimal stock level maintained. Popular among enterprise field technicians and cyberware enthusiasts.'
  },
  {
    id: 'prod-4',
    name: 'OmniScan LiDAR Array v4',
    category: 'sensors',
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
    aiInsight: 'Critical low stock level (3 remaining). Agentic supplier bot initiated auto-quote for 25 additional units.'
  },
  {
    id: 'prod-5',
    name: 'AeroBot Recon Drone M5',
    category: 'drones',
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
    aiInsight: 'High customer satisfaction rating (4.9/5). Low warranty claim rate of 0.2%.'
  },
  {
    id: 'prod-6',
    name: 'QuantumKey HSM Crypto Vault',
    category: 'chips',
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
    aiInsight: 'Enterprise favorite. Frequently purchased in bundles with TensorCore units.'
  },
  {
    id: 'prod-7',
    name: 'Biometric Ring Sentinel Pro',
    category: 'wearables',
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
    aiInsight: 'Consistent steady sales velocity. Inventory turnover rate is 12 days.'
  },
  {
    id: 'prod-8',
    name: 'HoloLens Haptic CyberGloves',
    category: 'neural',
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
    aiInsight: 'Recommended for robotics developers and immersive simulation labs.'
  }
];

export const MOCK_USER = {
  name: 'Prachi Ingle',
  email: 'user@binarybrain.io',
  role: 'customer', // 'customer' or 'admin'
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  address: '104 Binary Tower, Tech City, Silicon Valley, CA 94025',
  phone: '+1 (555) 019-2834',
  loyaltyPoints: 4850,
  tier: 'Cyber Elite Member'
};

export const MOCK_ADMIN_USER = {
  name: 'Payal (System Admin)',
  email: 'admin@binarybrain.io',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  department: 'Autonomous Inventory Operations'
};

export const INITIAL_ORDERS = [
  {
    id: 'ORD-8921',
    date: '2026-08-10',
    total: 1399.49,
    status: 'Processing', // 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    items: [
      { id: 'prod-1', name: 'NeuralLink BCI Headset X1', price: 899.99, quantity: 1, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
      { id: 'prod-3', name: 'CyberHUD Smart AR Visor', price: 499.50, quantity: 1, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80' }
    ],
    shippingAddress: '104 Binary Tower, Tech City, Silicon Valley, CA 94025',
    paymentMethod: 'CyberPay (Crypto)',
    trackingStep: 1, // 0: Placed, 1: Processing, 2: Shipped, 3: Out for Delivery, 4: Delivered
    estimatedDelivery: 'August 16, 2026',
    cancellationEligible: true
  },
  {
    id: 'ORD-7643',
    date: '2026-08-04',
    total: 2100.00,
    status: 'Shipped',
    items: [
      { id: 'prod-6', name: 'QuantumKey HSM Crypto Vault', price: 2100.00, quantity: 1, image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' }
    ],
    shippingAddress: '104 Binary Tower, Tech City, Silicon Valley, CA 94025',
    paymentMethod: 'Credit Card (**** 8892)',
    trackingStep: 3,
    estimatedDelivery: 'Tomorrow, 2:00 PM',
    cancellationEligible: false
  },
  {
    id: 'ORD-5512',
    date: '2026-07-28',
    total: 649.99,
    status: 'Delivered',
    items: [
      { id: 'prod-8', name: 'HoloLens Haptic CyberGloves', price: 649.99, quantity: 1, image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80' }
    ],
    shippingAddress: '104 Binary Tower, Tech City, Silicon Valley, CA 94025',
    paymentMethod: 'Credit Card (**** 8892)',
    trackingStep: 4,
    estimatedDelivery: 'Delivered on July 30, 2026',
    cancellationEligible: false
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Order Status Update',
    message: 'Order #ORD-7643 has been dispatched and is out for final delivery!',
    time: '10 minutes ago',
    read: false,
    type: 'order'
  },
  {
    id: 'notif-2',
    title: 'AI Auto-Restock Warning',
    message: 'OmniScan LiDAR Array stock dropped below threshold (3 remaining). Supplier bot triggered.',
    time: '1 hour ago',
    read: false,
    type: 'admin'
  },
  {
    id: 'notif-3',
    title: 'Cyber Sale Bonus',
    message: 'You earned 150 bonus loyalty points for your recent review on NeuralLink BCI Headset.',
    time: 'Yesterday',
    read: true,
    type: 'promo'
  }
];

export const ADMIN_STATS = {
  totalRevenue: '$148,920.00',
  revenueGrowth: '+18.4% vs last month',
  activeOrders: 24,
  lowStockItems: 2,
  agentAutomationsCount: 142,
  inventoryHealthScore: '96%'
};
