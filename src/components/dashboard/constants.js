// API Endpoints
export const API_BASE_URL = 'http://localhost:5231/api';
export const PRODUCTS_ENDPOINT = '/product';
export const ORDERS_ENDPOINT = '/product/orders';

// Platform names
export const PLATFORMS = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  SHOPEE: 'shopee'
};

// Platform display names
export const PLATFORM_DISPLAY_NAMES = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  shopee: 'Shopee'
};

// Stock icons mapping
export const STOCK_ICONS = ['pisbok.png', 'shopee.png', 'instagram.png'];

// Platform icon mapping
export const PLATFORM_ICON_MAP = {
  'Facebook': 'pisbok.png',
  'Instagram': 'instagram.png',
  'Shopee': 'shopee.png'
};

// Default dashboard data structure
export const DEFAULT_DASHBOARD_DATA = {
  totalStocks: 0,
  totalRevenue: 0,
  netProfit: 0,
  salesByCategory: [],
  salesByPlatform: [],
  topProducts: [],
  stocksByPlatform: {
    facebook: 0,
    instagram: 0,
    shopee: 0
  },
  ordersByPlatform: {
    facebook: 0,
    instagram: 0,
    shopee: 0
  }
};

// Chart colors
export const CHART_COLORS = {
  backgroundColor: [
    'rgba(239, 68, 68, 0.8)',
    'rgba(251, 146, 60, 0.8)',
    'rgba(250, 204, 21, 0.8)',
    'rgba(74, 222, 128, 0.8)',
    'rgba(96, 165, 250, 0.8)'
  ],
  borderColor: [
    'rgba(239, 68, 68, 1)',
    'rgba(251, 146, 60, 1)',
    'rgba(250, 204, 21, 1)',
    'rgba(74, 222, 128, 1)',
    'rgba(96, 165, 250, 1)'
  ]
};

// Profit margin percentage
export const PROFIT_MARGIN = 0.3; // 30%

// Top products display limit
export const TOP_PRODUCTS_LIMIT = 4;
