import React, { useState, useEffect } from 'react';
import InventoryHeader from './InventoryHeader';
import StatCard from './StatCard';
import PaymentStatusCard from './PaymentStatusCard';
import SalesOverviewChart from './SalesOverviewChart';
import SalesByPlatformCard from './SalesByPlatformCard';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalStocks: 0,
    totalRevenue: 0,
    netProfit: 0,
    salesByCategory: [],
    salesByPlatform: [],
    topProducts: [],
    stocksByPlatform: {
      facebook: 0,
      instagram: 0
    },
    ordersByPlatform: {
      facebook: 0,
      instagram: 0
    }
  });

  useEffect(() => {
    fetchProductsAndOrders();
  }, []);

  const fetchProductsAndOrders = async () => {
    try {
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
            productPrice: product.price
          }));
          allOrders.push(...ordersWithProductInfo);
        }
      }
      
      setOrders(allOrders);
      
      // Calculate dashboard data with products and orders
      calculateDashboardData(productsData, allOrders);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDashboardData = (products, orders) => {
    // initially filter out any shopee orders from global list
    const visibleOrders = orders.filter(o => o.platform?.toLowerCase() !== 'shopee');

    // Filter to only include paid/pending on visible dataset
    const paidOrders = visibleOrders.filter(order => order.isPaid);
    const pendingOrders = visibleOrders.filter(order => !order.isPaid);
    
    // Calculate total stocks
    const totalStocks = products.reduce((total, product) => {
      return total + (product.sizes?.small || 0) + (product.sizes?.medium || 0) + (product.sizes?.large || 0);
    }, 0);

    // Calculate stocks by platform
    const stocksByPlatform = {
      facebook: 0,
      instagram: 0
    };
    
    // Count total orders by platform (both paid and pending)
    const ordersByPlatform = {
      facebook: 0,
      instagram: 0
    };
    
    // Count orders by platform (only facebook/instagram now)
    visibleOrders.forEach(order => {
      switch(order.platform?.toLowerCase()) {
        case 'facebook':
          ordersByPlatform.facebook += 1;
          break;
        case 'instagram':
          ordersByPlatform.instagram += 1;
          break;
        default:
          break;
      }
    });
    
    // Calculate total orders stats using filtered list
    const totalOrders = visibleOrders.length;
    const totalPaidOrders = visibleOrders.filter(o => o.isPaid).length;
    const totalPendingOrders = visibleOrders.filter(o => !o.isPaid).length;

    // Track product sales for paid orders only
    const filteredPaid = visibleOrders.filter(o => o.isPaid);
    const productSalesMap = {};
    const categorySales = {};
    const platformSales = {
      facebook: 0,
      instagram: 0
    };

    // Initialize product sales tracking
    products.forEach(product => {
      productSalesMap[product.id] = {
        id: product.id,
        name: product.name,
        category: product.category,
        units: 0,
        amount: 0
      };
      
      // Initialize category sales
      if (!categorySales[product.category]) {
        categorySales[product.category] = 0;
      }
      
      // Calculate remaining stocks for each platform
      const fbTotal = (product.sizes?.small || 0) - (product.sizes?.smallFB || 0);
      const igTotal = (product.sizes?.medium || 0) - (product.sizes?.mediumIG || 0);
      
      // Add to platform stock totals
      stocksByPlatform.facebook += fbTotal;
      stocksByPlatform.instagram += igTotal;
    });

    // Process paid orders to calculate sales
    filteredPaid.forEach(order => {
      // Update product sales data
      if (productSalesMap[order.productId]) {
        productSalesMap[order.productId].units += order.quantity;
        productSalesMap[order.productId].amount += order.totalAmount;
        
        // Update category sales
        categorySales[order.productCategory] += order.quantity;
        
        // Update platform sales
        switch(order.platform.toLowerCase()) {
          case 'facebook':
            platformSales.facebook += order.totalAmount;
            break;
          case 'instagram':
            platformSales.instagram += order.totalAmount;
            break;
          default:
            break;
        }
      }
    });

    // Convert product sales map to array and sort to get top products
    const productSalesArray = Object.values(productSalesMap);
    const topProducts = productSalesArray
      .sort((a, b) => b.units - a.units)
      .slice(0, 4);

    // Calculate total revenue from paid orders
    const totalRevenue = filteredPaid.reduce((total, order) => total + order.totalAmount, 0);
    const netProfit = totalRevenue * 0.3; // 30% profit margin

    setDashboardData({
      totalStocks,
      totalRevenue,
      netProfit,
      salesByCategory: Object.entries(categorySales).map(([category, sales]) => ({
        name: category,
        value: sales
      })),
      salesByPlatform: Object.entries(platformSales).map(([platform, sales]) => ({
        name: platform.charAt(0).toUpperCase() + platform.slice(1),
        value: sales
      })),
      topProducts,
      stocksByPlatform,
      ordersByPlatform,
      totalOrders,
      totalPaidOrders,
      totalPendingOrders
    });
  };

  if (loading) {
    return (
      <div className="mt-1 p-4 font-['cinzel'] overflow-x-hidden">
        <div className="w-full max-w-[1220px] ml-[60px]">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1 p-4 font-['cinzel'] overflow-x-hidden">
      <div className="w-full max-w-[1220px] ml-[60px]">
        {/* Inventory Header with Orders by Platform */}
        <InventoryHeader 
          totalStocks={dashboardData.totalStocks}
          ordersByPlatform={dashboardData.ordersByPlatform}
        />

        {/* Row with 4 Cards - Order Statistics, Payment Status, Total Revenue, Net Profit */}
        <div className="flex flex-col sm:flex-row gap-6 w-full mb-6">
          <StatCard 
            value={dashboardData.totalOrders || 0}
            label="ORDER STATISTICS"
            subtitle="Total Orders"
          />
          
          <PaymentStatusCard 
            totalPaidOrders={dashboardData.totalPaidOrders}
            totalPendingOrders={dashboardData.totalPendingOrders}
          />
          
          <StatCard 
            value={`₱${dashboardData.totalRevenue.toLocaleString()}`}
            label="TOTAL REVENUE"
          />
          
          <StatCard 
            value={`₱${dashboardData.netProfit.toLocaleString()}`}
            label="NET PROFIT"
          />
        </div>

        {/* Final Row with Charts - Sales Overview and Sales by Platform */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          <SalesOverviewChart 
            salesByCategory={dashboardData.salesByCategory}
            topProducts={dashboardData.topProducts}
          />

          <SalesByPlatformCard 
            salesByPlatform={dashboardData.salesByPlatform}
          />
        </div>
      </div>
    </div>
  );
}
