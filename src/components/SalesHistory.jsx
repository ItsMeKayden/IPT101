import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SalesHistory() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewPeriod, setViewPeriod] = useState('day');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    salesByPlatform: [],
    salesByCategory: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await fetch('http://localhost:5231/api/product', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products');
      }

      const productsData = await productsResponse.json();
      setProducts(productsData);

      // Fetch all orders for all products
      const allOrders = [];
      let totalRevenue = 0;
      const platformSales = {
        facebook: 0,
        instagram: 0,
        shopee: 0
      };
      const categorySales = {};

      for (const product of productsData) {
        const ordersResponse = await fetch(
          `http://localhost:5231/api/product/orders/${product.id}`
        );
        
        if (ordersResponse.ok) {
          const productOrders = await ordersResponse.json();
          // Add product information to each order
          const ordersWithProductInfo = productOrders.map(order => ({
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
          allOrders.push(...ordersWithProductInfo);
        }
      }
      
      // Update dashboard data
      setDashboardData({
        totalRevenue,
        salesByPlatform: Object.entries(platformSales).map(([platform, amount]) => ({
          name: platform.charAt(0).toUpperCase() + platform.slice(1),
          value: amount
        })),
        salesByCategory: Object.entries(categorySales).map(([category, amount]) => ({
          name: category,
          value: amount
        }))
      });
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized date range calculations
  const getDateRange = useMemo(() => ({
    day: (date) => ({ start: date, end: date }),
    week: (date) => {
      const currentDate = new Date(date);
      const dayOfWeek = currentDate.getDay();
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return { 
        start: startOfWeek.toISOString().split('T')[0], 
        end: endOfWeek.toISOString().split('T')[0] 
      };
    },
    month: (date) => {
      const currentDate = new Date(date);
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return { 
        start: startOfMonth.toISOString().split('T')[0], 
        end: endOfMonth.toISOString().split('T')[0] 
      };
    }
  }), []);

  // Get the date range based on current selections
  const currentDateRange = useMemo(() => {
    return getDateRange[viewPeriod](selectedDate);
  }, [getDateRange, viewPeriod, selectedDate]);

  // Advanced filtering and sorting
  const filteredOrders = useMemo(() => {
    const { start, end } = currentDateRange;
    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);
    let filtered = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Apply platform filter
    if (platformFilter !== 'All') {
      filtered = filtered.filter(order => 
        order.platform.toLowerCase() === platformFilter.toLowerCase()
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(order => 
        order.productCategory.toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    
    // Apply search query (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.customerName.toLowerCase().includes(query) ||
        order.productName.toLowerCase().includes(query) ||
        order.productCategory.toLowerCase().includes(query) ||
        order.platform.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [orders, currentDateRange, platformFilter, categoryFilter, searchQuery, sortConfig]);

  // Only paid orders for all analytics and totals
  const paidFilteredOrders = useMemo(() => filteredOrders.filter(order => order.isPaid), [filteredOrders]);

  // Handle column sorting
  const requestSort = useCallback((key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  // Get sort indicator for table headers
  const getSortIndicator = useCallback((key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  }, [sortConfig]);

  // Memoized calculations for summary and analytics
  const {
    totalAmount,
    totalItems,
    averageOrderValue,
    platformSummary,
    categorySummary,
    dailySales
  } = useMemo(() => {
    const totalAmount = paidFilteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalItems = paidFilteredOrders.reduce((sum, order) => sum + order.quantity, 0);
    const averageOrderValue = paidFilteredOrders.length ? Math.round(totalAmount / paidFilteredOrders.length) : 0;
    
    // Platform distribution
    const platformCount = {};
    paidFilteredOrders.forEach(order => {
      platformCount[order.platform] = (platformCount[order.platform] || 0) + order.totalAmount;
    });
    const platformSummary = Object.entries(platformCount).map(([name, value]) => ({ name, value }));
    
    // Category distribution
    const categoryCount = {};
    paidFilteredOrders.forEach(order => {
      categoryCount[order.productCategory] = (categoryCount[order.productCategory] || 0) + order.totalAmount;
    });
    const categorySummary = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
    
    // Daily sales for the period
    const dailySales = {};
    const { start, end } = currentDateRange;
    let current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      dailySales[dateStr] = 0;
      current.setDate(current.getDate() + 1);
    }
    
    paidFilteredOrders.forEach(order => {
      dailySales[order.date] = (dailySales[order.date] || 0) + order.totalAmount;
    });
    
    const dailySalesArray = Object.entries(dailySales).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount
    }));

    return {
      totalAmount,
      totalItems,
      averageOrderValue,
      platformSummary,
      categorySummary,
      dailySales: dailySalesArray
    };
  }, [paidFilteredOrders, currentDateRange]);

  // Memoized filter options
  const filterOptions = useMemo(() => {
    const platforms = [...new Set(orders.map(order => order.platform).filter(Boolean))];
    const categories = [...new Set(orders.map(order => order.productCategory).filter(Boolean))];
    
    return { 
      platforms: platforms.length > 0 ? platforms : ['Facebook', 'Instagram', 'Shopee'],
      categories: categories.length > 0 ? categories : ['Dress', 'Top', 'Bottoms', 'Skirts', 'Accessories', 'Hats', 'Others']
    };
  }, [orders]);

  // Export functions with better error handling
  const exportToExcel = useCallback(() => {
    try {
      const dataToExport = paidFilteredOrders.map(({ date, ...rest }) => ({
        Date: date,
        ...rest
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SalesData");
      
      // Add some basic styling to the header row
      const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "8E325E" } }
      };
      
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        worksheet[cellAddress].s = headerStyle;
      }
      
      XLSX.writeFile(workbook, `sales_${viewPeriod}_${selectedDate}.xlsx`);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel. Please try again.");
    }
  }, [paidFilteredOrders, viewPeriod, selectedDate]);

  const exportAllToExcel = useCallback(() => {
    try {
      const allPaidOrders = orders.filter(order => order.isPaid).map(order => ({
        Date: order.date,
        Customer: order.customerName,
        Product: order.productName,
        Category: order.productCategory,
        Quantity: order.quantity,
        Size: order.size,
        Platform: order.platform,
        Amount: order.totalAmount,
        Status: order.isPaid ? 'Paid' : 'Pending'
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(allPaidOrders);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "AllSales");
      
      XLSX.writeFile(workbook, "sales_all_data.xlsx");
    } catch (error) {
      console.error("Error exporting all to Excel:", error);
      alert("Failed to export all data to Excel. Please try again.");
    }
  }, [orders]);

  // Colors for charts
  const CHART_COLORS = ['#65366F', '#841c4f', '#c45d9c', '#FFE2F0', '#ffea99', '#f9eef5'];

  if (loading) {
    return (
      <div className="p-6 text-gray-800 max-w-7xl mx-auto ml-[80px]">
        <div className="text-center py-8 text-gray-800">
          Loading sales data...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-800 max-w-7xl mx-auto ml-[80px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#841c4f] font-['OFL_Sorts_Mill_Goudy_TT']">Sales History</h1>
        
        {/* Analytics Toggle */}
        <button 
          onClick={() => setShowAnalytics(prev => !prev)}
          className="px-4 py-2 bg-[#65366F] text-white rounded-lg hover:bg-[#7d468a] transition-colors"
        >
          {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
        </button>
      </div>
      
      {/* Filters Section */}
      <div className="bg-gradient-to-b from-[#e7d6f7] to-[#f7d6d0] p-6 rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)] mb-6">
        <h2 className="text-lg font-semibold text-[#841c4f] mb-4 font-['OFL_Sorts_Mill_Goudy_TT']">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label htmlFor="datePicker" className="text-sm font-medium text-[#841c4f] mb-2">Date:</label>
            <input
              id="datePicker"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-[#65366F]/30 px-3 py-2 rounded-lg text-[#841c4f] focus:ring-2 focus:ring-[#65366F] focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white/90"
            />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="periodSelect" className="text-sm font-medium text-[#841c4f] mb-2">View Period:</label>
            <select
              id="periodSelect"
              value={viewPeriod}
              onChange={(e) => setViewPeriod(e.target.value)}
              className="border border-[#65366F]/30 px-3 py-2 rounded-lg text-[#841c4f] focus:ring-2 focus:ring-[#65366F] focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="platformSelect" className="text-sm font-medium text-[#841c4f] mb-2">Platform:</label>
            <select
              id="platformSelect"
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="border border-[#65366F]/30 px-3 py-2 rounded-lg text-[#841c4f] focus:ring-2 focus:ring-[#65366F] focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <option value="All">All Platforms</option>
              {filterOptions.platforms.map((platform, idx) => (
                <option key={idx} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="categorySelect" className="text-sm font-medium text-[#841c4f] mb-2">Category:</label>
            <select
              id="categorySelect"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-[#65366F]/30 px-3 py-2 rounded-lg text-[#841c4f] focus:ring-2 focus:ring-[#65366F] focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white/90"
            >
              <option value="All">All Categories</option>
              {filterOptions.categories.map((category, idx) => (
                <option key={idx} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Search Box */}
        <div className="mt-4">
          <label htmlFor="searchBox" className="text-sm font-medium text-[#841c4f] mb-2">Search:</label>
          <input
            id="searchBox"
            type="text"
            placeholder="Search by customer, product, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-[#65366F]/30 px-3 py-2 rounded-lg text-[#841c4f] focus:ring-2 focus:ring-[#65366F] focus:border-transparent bg-white/80 backdrop-blur-sm hover:bg-white/90"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#FFE2F0] p-6 rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)] transition-transform duration-300 hover:scale-105">
          <h3 className="text-lg font-semibold text-[#841c4f] font-['OFL_Sorts_Mill_Goudy_TT']">Total Sales</h3>
          <p className="text-sm text-[#841c4f]">
            {viewPeriod === 'day' ? `Daily: ${selectedDate}` : 
             viewPeriod === 'week' ? `Weekly: ${currentDateRange.start} to ${currentDateRange.end}` : 
             `Monthly: ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
          </p>
          <p className="text-2xl font-bold text-[#841c4f] mt-2">₱{totalAmount.toLocaleString()}</p>
        </div>
        
        <div className="bg-[#FFE2F0] p-6 rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)] transition-transform duration-300 hover:scale-105">
          <h3 className="text-lg font-semibold text-[#841c4f] font-['OFL_Sorts_Mill_Goudy_TT']">Total Items Sold</h3>
          <p className="text-sm text-[#841c4f]">Quantity across all orders</p>
          <p className="text-2xl font-bold text-[#841c4f] mt-2">{totalItems} items</p>
        </div>
        
        <div className="bg-[#FFE2F0] p-6 rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)] transition-transform duration-300 hover:scale-105">
          <h3 className="text-lg font-semibold text-[#841c4f] font-['OFL_Sorts_Mill_Goudy_TT']">Average Order Value</h3>
          <p className="text-sm text-[#841c4f]">Per transaction</p>
          <p className="text-2xl font-bold text-[#841c4f] mt-2">₱{averageOrderValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#841c4f] mb-4 font-['OFL_Sorts_Mill_Goudy_TT']">Sales Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Distribution Chart */}
            <div className="bg-[#f9eef5] p-6 rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)]">
              <h3 className="text-lg font-medium text-[#841c4f] mb-3 font-['OFL_Sorts_Mill_Goudy_TT']">Sales by Platform</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformSummary}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {platformSummary.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Category Distribution Chart */}
            <div className="bg-[#f9eef5] p-6 rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)]">
              <h3 className="text-lg font-medium text-[#841c4f] mb-3 font-['OFL_Sorts_Mill_Goudy_TT']">Sales by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categorySummary}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {categorySummary.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Daily Sales Trend */}
            {viewPeriod !== 'day' && (
              <div className="bg-[#f9eef5] p-6 rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)] lg:col-span-2">
                <h3 className="text-lg font-medium text-[#841c4f] mb-3 font-['OFL_Sorts_Mill_Goudy_TT']">Daily Sales Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailySales}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="amount" name="Sales Amount" fill="#65366F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={exportToExcel} 
          className="bg-[#65366F] hover:bg-[#7d468a] text-white px-6 py-3 rounded-lg shadow-[0_4px_8px_rgba(101,54,111,0.2)] transition-colors flex items-center justify-center gap-2"
        >
          <span>Export {viewPeriod.charAt(0).toUpperCase() + viewPeriod.slice(1)} to Excel</span>
        </button>
        <button 
          onClick={exportAllToExcel} 
          className="bg-[#65366F] hover:bg-[#7d468a] text-white px-6 py-3 rounded-lg shadow-[0_4px_8px_rgba(101,54,111,0.2)] transition-colors flex items-center justify-center gap-2"
        >
          <span>Export All Data to Excel</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)]">
        <table className="min-w-full bg-white">
          <thead className="bg-[#65366F] text-white">
            <tr>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('customerName')}>
                  Customer{getSortIndicator('customerName')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('productName')}>
                  Product{getSortIndicator('productName')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('productCategory')}>
                  Category{getSortIndicator('productCategory')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('quantity')}>
                  Qty{getSortIndicator('quantity')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('size')}>
                  Size{getSortIndicator('size')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('platform')}>
                  Platform{getSortIndicator('platform')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('orderDate')}>
                  Date{getSortIndicator('orderDate')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('isPaid')}>
                  Status{getSortIndicator('isPaid')}
                </button>
              </th>
              <th className="p-4 text-center border-b border-[#841c4f]/30">
                <button className="font-semibold flex items-center justify-center gap-1 w-full"
                  onClick={() => requestSort('totalAmount')}>
                  Amount (₱){getSortIndicator('totalAmount')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <tr 
                  key={idx} 
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9eef5]'} hover:bg-[#FFE2F0]/50 transition-colors`}
                >
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.customerName}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.productName}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.productCategory}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.quantity}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.size}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.platform}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{new Date(order.orderDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.isPaid ? 'Paid' : 'Pending'}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">₱{order.totalAmount.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-8 text-center text-[#841c4f]">
                  No sales data found for the selected criteria
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-[#FFE2F0] text-[#841c4f]">
            <tr>
              <td colSpan="8" className="p-4 text-right font-semibold border-t border-[#841c4f]/30">
                Total:
              </td>
              <td className="p-4 text-center font-bold border-t border-[#841c4f]/30">
                ₱{totalAmount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Results summary */}
      <div className="mt-4 text-sm text-[#841c4f]">
        Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} for the selected period
      </div>
    </div>
  );
}