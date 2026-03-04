import * as XLSX from 'xlsx';

/**
 * Fetches all products from the API
 */
export const fetchProducts = async () => {
  const response = await fetch('http://localhost:5231/api/product', {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return await response.json();
};

/**
 * Fetches all orders for a specific product
 */
export const fetchProductOrders = async (productId) => {
  const response = await fetch(
    `http://localhost:5231/api/product/orders/${productId}`
  );
  
  if (response.ok) {
    return await response.json();
  }
  return [];
};

/**
 * Enriches orders with product information
 */
export const enrichOrdersWithProductInfo = (orders, product) => {
  return orders.map(order => ({
    ...order,
    productId: product.id,
    productName: product.name,
    productCategory: product.category,
    productPrice: product.price,
    totalAmount: order.totalAmount || (order.quantity * product.price),
    orderDate: order.orderDate || order.createdAt,
    platform: order.platform || 'Unknown',
    customerName: order.customerName || 'Unknown Customer',
    isPaid: order.isPaid
  }));
};

/**
 * Calculates date range based on period and selected date
 */
export const calculateDateRange = (date, period) => {
  const selectedDate = new Date(date);
  
  if (period === 'day') {
    return {
      start: date,
      end: date
    };
  }
  
  if (period === 'week') {
    const current = new Date(selectedDate);
    const first = current.getDate() - current.getDay();
    const weekStart = new Date(current.setDate(first));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    return {
      start: weekStart.toISOString().split('T')[0],
      end: weekEnd.toISOString().split('T')[0]
    };
  }
  
  if (period === 'month') {
    return {
      start: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        .toISOString().split('T')[0],
      end: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
        .toISOString().split('T')[0]
    };
  }
  
  return { start: date, end: date };
};

/**
 * Filters orders based on date range, platform, category, and search query
 */
export const filterOrders = (orders, dateRange, platformFilter, categoryFilter, searchQuery, sortConfig) => {
  let filtered = orders.filter(order => {
    const orderDate = new Date(order.orderDate).toISOString().split('T')[0];
    const inDateRange = orderDate >= dateRange.start && orderDate <= dateRange.end;
    const matchesPlatform = platformFilter === 'All' || order.platform === platformFilter;
    const matchesCategory = categoryFilter === 'All' || order.productCategory === categoryFilter;
    const matchesSearch = 
      !searchQuery ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.productCategory.toLowerCase().includes(searchQuery.toLowerCase());
    
    return inDateRange && matchesPlatform && matchesCategory && matchesSearch;
  });

  if (sortConfig.key) {
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'ascending'
        ? aValue - bValue
        : bValue - aValue;
    });
  }

  return filtered;
};

/**
 * Calculates summary statistics
 */
export const calculateSummary = (paidOrders, dateRange) => {
  const totalAmount = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalItems = paidOrders.reduce((sum, order) => sum + order.quantity, 0);
  const averageOrderValue = paidOrders.length > 0 ? totalAmount / paidOrders.length : 0;

  const platformSummary = {};
  const categorySummary = {};

  paidOrders.forEach(order => {
    platformSummary[order.platform] = (platformSummary[order.platform] || 0) + order.totalAmount;
    categorySummary[order.productCategory] = (categorySummary[order.productCategory] || 0) + order.totalAmount;
  });

  const dailySales = [];
  const current = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);

  while (current <= endDate) {
    const dateStr = current.toISOString().split('T')[0];
    const dayOrders = paidOrders.filter(order => order.orderDate.split('T')[0] === dateStr);
    dailySales.push({
      date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: dayOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    });
    current.setDate(current.getDate() + 1);
  }

  return {
    totalAmount,
    totalItems,
    averageOrderValue,
    platformSummary: Object.entries(platformSummary).map(([platform, value]) => ({
      name: platform,
      value
    })),
    categorySummary: Object.entries(categorySummary).map(([category, value]) => ({
      name: category,
      value
    })),
    dailySales
  };
};

/**
 * Gets unique filter options from orders
 */
export const getFilterOptions = (orders) => {
  const platforms = [...new Set(orders.map(order => order.platform))].sort();
  const categories = [...new Set(orders.map(order => order.productCategory))].sort();
  
  return { platforms, categories };
};

/**
 * Handles sort column requests
 */
export const handleSort = (key, currentSortConfig) => {
  let direction = 'ascending';
  if (currentSortConfig.key === key && currentSortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  return { key, direction };
};

/**
 * Gets sort indicator for table headers
 */
export const getSortIndicator = (key, sortConfig) => {
  if (sortConfig.key !== key) return '';
  return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
};

/**
 * Exports data to Excel
 */
export const exportToExcel = (data, filename, sheetName = 'Sales') => {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, filename);
  } catch (error) {
    console.error('Export error:', error);
    alert('Failed to export to Excel. Please try again.');
  }
};

/**
 * Formats date for display
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Formats currency
 */
export const formatCurrency = (amount) => {
  return `₱${amount.toLocaleString()}`;
};
