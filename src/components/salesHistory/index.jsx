import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FilterSection from './FilterSection';
import SummaryCards from './SummaryCards';
import AnalyticsSection from './AnalyticsSection';
import OrdersTable from './OrdersTable';
import {
  fetchProducts,
  fetchProductOrders,
  enrichOrdersWithProductInfo,
  calculateDateRange,
  filterOrders,
  calculateSummary,
  getFilterOptions,
  handleSort,
  exportToExcel
} from './helpers';
import { DEFAULT_FILTERS } from './constants';

export default function SalesHistoryPage() {
  const [selectedDate, setSelectedDate] = useState(DEFAULT_FILTERS.selectedDate);
  const [viewPeriod, setViewPeriod] = useState(DEFAULT_FILTERS.viewPeriod);
  const [platformFilter, setPlatformFilter] = useState(DEFAULT_FILTERS.platformFilter);
  const [categoryFilter, setCategoryFilter] = useState(DEFAULT_FILTERS.categoryFilter);
  const [sortConfig, setSortConfig] = useState(DEFAULT_FILTERS.sortConfig);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_FILTERS.searchQuery);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const productsData = await fetchProducts();
      setProducts(productsData);

      const allOrders = [];
      for (const product of productsData) {
        const productOrders = await fetchProductOrders(product.id);
        const enrichedOrders = enrichOrdersWithProductInfo(productOrders, product);
        allOrders.push(...enrichedOrders);
      }
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Memoized date range calculation
  const currentDateRange = useMemo(
    () => calculateDateRange(selectedDate, viewPeriod),
    [selectedDate, viewPeriod]
  );

  // Memoized filtered orders
  const filteredOrders = useMemo(
    () => filterOrders(orders, currentDateRange, platformFilter, categoryFilter, searchQuery, sortConfig),
    [orders, currentDateRange, platformFilter, categoryFilter, searchQuery, sortConfig]
  );

  // Only paid orders for analytics
  const paidFilteredOrders = useMemo(
    () => filteredOrders.filter(order => order.isPaid),
    [filteredOrders]
  );

  // Memoized summary calculations
  const {
    totalAmount,
    totalItems,
    averageOrderValue,
    platformSummary,
    categorySummary,
    dailySales
  } = useMemo(
    () => calculateSummary(paidFilteredOrders, currentDateRange),
    [paidFilteredOrders, currentDateRange]
  );

  // Memoized filter options
  const filterOptions = useMemo(() => getFilterOptions(orders), [orders]);

  // Handle sorting
  const requestSort = useCallback((key) => {
    setSortConfig(handleSort(key, sortConfig));
  }, [sortConfig]);

  // Export handlers
  const handleExportPeriod = useCallback(() => {
    const exportData = paidFilteredOrders.map(order => ({
      Customer: order.customerName,
      Product: order.productName,
      Category: order.productCategory,
      Quantity: order.quantity,
      Size: order.size,
      Platform: order.platform,
      Date: new Date(order.orderDate).toLocaleDateString(),
      Status: order.isPaid ? 'Paid' : 'Pending',
      Amount: order.totalAmount
    }));
    
    const filename = `Sales_${viewPeriod}_${selectedDate}.xlsx`;
    exportToExcel(exportData, filename);
  }, [paidFilteredOrders, viewPeriod, selectedDate]);

  const handleExportAll = useCallback(() => {
    // ignore legacy shopee orders
    const paidOrders = orders.filter(order => order.isPaid && order.platform?.toLowerCase() !== 'shopee');
    const exportData = paidOrders.map(order => ({
      Customer: order.customerName,
      Product: order.productName,
      Category: order.productCategory,
      Quantity: order.quantity,
      Size: order.size,
      Platform: order.platform,
      Date: new Date(order.orderDate).toLocaleDateString(),
      Status: order.isPaid ? 'Paid' : 'Pending',
      Amount: order.totalAmount
    }));
    
    const filename = `Sales_All_${new Date().toISOString().split('T')[0]}.xlsx`;
    exportToExcel(exportData, filename);
  }, [orders]);

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
      <FilterSection
        selectedDate={selectedDate}
        viewPeriod={viewPeriod}
        platformFilter={platformFilter}
        categoryFilter={categoryFilter}
        searchQuery={searchQuery}
        filterOptions={filterOptions}
        onDateChange={setSelectedDate}
        onPeriodChange={setViewPeriod}
        onPlatformChange={setPlatformFilter}
        onCategoryChange={setCategoryFilter}
        onSearchChange={setSearchQuery}
      />

      {/* Summary Cards */}
      <SummaryCards
        totalAmount={totalAmount}
        totalItems={totalItems}
        averageOrderValue={averageOrderValue}
        viewPeriod={viewPeriod}
        selectedDate={selectedDate}
        currentDateRange={currentDateRange}
      />

      {/* Analytics Section */}
      {showAnalytics && (
        <AnalyticsSection
          platformSummary={platformSummary}
          categorySummary={categorySummary}
          dailySales={dailySales}
          viewPeriod={viewPeriod}
        />
      )}

      {/* Export Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <button 
          onClick={handleExportPeriod}
          className="bg-[#65366F] hover:bg-[#7d468a] text-white px-6 py-3 rounded-lg shadow-[0_4px_8px_rgba(101,54,111,0.2)] transition-colors flex items-center justify-center gap-2"
        >
          <span>Export {viewPeriod.charAt(0).toUpperCase() + viewPeriod.slice(1)} to Excel</span>
        </button>
        <button 
          onClick={handleExportAll}
          className="bg-[#65366F] hover:bg-[#7d468a] text-white px-6 py-3 rounded-lg shadow-[0_4px_8px_rgba(101,54,111,0.2)] transition-colors flex items-center justify-center gap-2"
        >
          <span>Export All Data to Excel</span>
        </button>
      </div>

      {/* Orders Table */}
      <OrdersTable
        filteredOrders={filteredOrders}
        sortConfig={sortConfig}
        totalAmount={totalAmount}
        onSort={requestSort}
      />
    </div>
  );
}
