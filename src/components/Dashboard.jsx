import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Define the stock icons that were missing
const stockIcons = ['fb.png', 'shopee.png', 'instagram.png'];

export default function Dashboard() {
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
      instagram: 0,
      shopee: 0
    },
    ordersByPlatform: {
      facebook: 0,
      instagram: 0,
      shopee: 0
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
    // Filter to only include paid orders
    const paidOrders = orders.filter(order => order.isPaid);
    const pendingOrders = orders.filter(order => !order.isPaid);
    
    // Calculate total stocks
    const totalStocks = products.reduce((total, product) => {
      return total + (product.sizes?.small || 0) + (product.sizes?.medium || 0) + (product.sizes?.large || 0);
    }, 0);

    // Calculate stocks by platform
    const stocksByPlatform = {
      facebook: 0,
      instagram: 0,
      shopee: 0
    };
    
    // Count total orders by platform (both paid and pending)
    const ordersByPlatform = {
      facebook: 0,
      instagram: 0,
      shopee: 0
    };
    
    // Count orders by platform
    orders.forEach(order => {
      switch(order.platform?.toLowerCase()) {
        case 'facebook':
          ordersByPlatform.facebook += 1;
          break;
        case 'instagram':
          ordersByPlatform.instagram += 1;
          break;
        case 'shopee':
          ordersByPlatform.shopee += 1;
          break;
        default:
          break;
      }
    });
    
    // Calculate total orders stats
    const totalOrders = orders.length;
    const totalPaidOrders = paidOrders.length;
    const totalPendingOrders = pendingOrders.length;

    // Track product sales for paid orders only
    const productSalesMap = {};
    const categorySales = {};
    const platformSales = {
      facebook: 0,
      instagram: 0,
      shopee: 0
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
      const shopeeTotal = (product.sizes?.large || 0) - (product.sizes?.largeShopee || 0);
      
      // Add to platform stock totals
      stocksByPlatform.facebook += fbTotal;
      stocksByPlatform.instagram += igTotal;
      stocksByPlatform.shopee += shopeeTotal;
    });

    // Process paid orders to calculate sales
    paidOrders.forEach(order => {
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
          case 'shopee':
            platformSales.shopee += order.totalAmount;
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
    const totalRevenue = paidOrders.reduce((total, order) => total + order.totalAmount, 0);
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
        {/* Total Stocks and Orders Section */}
        <div className="relative w-full h-[135px] bg-[#65366F] rounded-[25px] overflow-hidden mb-6 hover:shadow-lg transition-all duration-300">
          <div className="absolute top-[10px] left-[45px] font-bold text-[#ffe2f0] text-[24px] hover:text-[#fff] transition-colors duration-200">
            TOTAL INVENTORY
          </div>
          <div className="absolute top-[50px] left-[100px] font-bold text-[#ffe2f0] text-[50px] hover:scale-105 transition-transform duration-200">
            {dashboardData.totalStocks}
          </div>
          <div className="absolute top-[10px] right-[10px] w-[70%] h-[115px] bg-[#EED2E0] rounded-[20px] flex items-center justify-center gap-4 md:gap-20 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#d6b9d6] transition-all duration-300">
            {/* Title for orders */}
            <div className="absolute top-[8px] left-[20px] font-bold text-[#65366F] text-[18px]">
              TOTAL ORDERS BY PLATFORM
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-4">
              {stockIcons.map((icon, index) => (  
                <div key={index} className="flex items-center group">
                  <img
                    className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] object-contain group-hover:scale-110 transition-transform duration-300"
                    src={`/icons/${icon}`}
                    alt={`Platform ${index}`}
                  />
                  <div className="ml-2 md:ml-4 font-bold text-[#65366F] text-[32px] md:text-[40px] group-hover:text-[#552e5e] transition-colors duration-300">
                    {index === 0 ? dashboardData.ordersByPlatform.facebook : 
                     index === 1 ? dashboardData.ordersByPlatform.shopee : 
                     dashboardData.ordersByPlatform.instagram}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row with 4 Cards - Order Statistics, Payment Status, Total Revenue, Net Profit */}
        <div className="flex flex-col sm:flex-row gap-6 w-full mb-6">
          {/* Order Statistics Card */}
          <div className="flex-1 group">
            <div className="bg-[#EED2E0] rounded-[20px] h-[135px] flex flex-col justify-end shadow-[inset_0_4px_4px_rgba(0,0,0,0.3)]">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-[#280A4F] text-3xl md:text-4xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
                  {dashboardData.totalOrders || 0}
                </div>
                <div className="text-[#280A4F] text-sm opacity-70 mt-1">
                  Total Orders
                </div>
              </div>
              <div className="bg-[#65366F] rounded-[20px] p-3 h-[55px] flex items-center justify-center">
                <div className="text-white text-base md:text-lg font-semibold">
                  ORDER STATISTICS
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Status Card */}
          <div className="flex-1">
            <div className="bg-[#EED2E0] rounded-[20px] h-[135px] flex flex-col justify-end shadow-[inset_0_4px_4px_rgba(0,0,0,0.3)]">
              <div className="flex-1 flex flex-row justify-center items-center gap-6">
                {/* Paid Orders */}
                <div className="flex flex-col items-center group">
                  <div className="text-green-600 text-2xl md:text-3xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
                    {dashboardData.totalPaidOrders || 0}
                  </div>
                  <div className="text-green-600 text-sm font-medium">
                    Paid
                  </div>
                </div>
                
                {/* Pending Orders */}
                <div className="flex flex-col items-center group">
                  <div className="text-yellow-600 text-2xl md:text-3xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
                    {dashboardData.totalPendingOrders || 0}
                  </div>
                  <div className="text-yellow-600 text-sm font-medium">
                    Pending
                  </div>
                </div>
              </div>
              <div className="bg-[#65366F] rounded-[20px] p-3 h-[55px] flex items-center justify-center">
                <div className="text-white text-base md:text-lg font-semibold">
                  PAYMENT STATUS
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue Card */}
          <div className="flex-1 group">
            <div className="bg-[#EED2E0] rounded-[20px] h-[135px] flex flex-col justify-end shadow-[inset_0_4px_4px_rgba(0,0,0,0.3)]">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-[#280A4F] text-2xl md:text-3xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
                  ₱{dashboardData.totalRevenue.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#65366F] rounded-[20px] p-3 h-[55px] flex items-center justify-center">
                <div className="text-white text-base md:text-lg font-semibold">
                  TOTAL REVENUE
                </div>
              </div>
            </div>
          </div>
          
          {/* Profit Card */}
          <div className="flex-1 group">
            <div className="bg-[#EED2E0] rounded-[20px] h-[135px] flex flex-col justify-end shadow-[inset_0_4px_4px_rgba(0,0,0,0.3)]">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-[#280A4F] text-2xl md:text-3xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
                  ₱{dashboardData.netProfit.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#65366F] rounded-[20px] p-3 h-[55px] flex items-center justify-center">
                <div className="text-white text-base md:text-lg font-semibold">
                  NET PROFIT
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Row with Charts - Sales Overview and Sales by Platform */}
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Sales Overview Chart */}
          <div className="w-full lg:w-[60%] bg-white rounded-[20px] p-4 md:p-5 h-[370px] shadow-[inset_0_4px_4px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300">
            <h2 className="mb-3 font-bold text-[#270a4e] text-2xl md:text-3xl hover:text-[#3a1a6b] transition-colors duration-200">
              Sales Overview
            </h2>
            
            <div className="flex flex-col md:flex-row h-[calc(100%-80px)]">
              {/* Top Products List */}
              <div className="flex-1 pl-0 md:pl-6 mt-3 md:mt-0">
                <h3 className="text-lg font-bold text-[#270a4e] mb-3">Top Products</h3>
                {dashboardData.topProducts.map((product, index) => (
                  <div 
                    key={index} 
                    className="mb-3 font-bold text-[#270a4e] text-base hover:text-[#4F46E5] hover:translate-x-2 transition-all duration-300"
                  >
                    <div className="flex justify-between">
                      <span>- {product.name}</span>
                      <span className="text-xs font-normal">{product.units} sold</span>
                    </div>
                    <div className="text-xs font-normal text-gray-500">Category: {product.category}</div>
                  </div>
                ))}
              </div>

              {/* Doughnut Chart */}
              <div className="w-full md:w-[55%] h-full flex items-center justify-center relative">
                <Doughnut 
                  data={{
                    labels: dashboardData.salesByCategory.map(item => item.name),
                    datasets: [{
                      data: dashboardData.salesByCategory.map(item => item.value),
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
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          font: {
                            family: 'sintony'
                          }
                        }
                      },
                      datalabels: {
                        color: '#fff',
                        font: {
                          weight: 'bold'
                        },
                        formatter: (value, ctx) => {
                          const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = (value * 100 / sum).toFixed(1) + '%';
                          return percentage;
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sales by Platform */}
          <div className="w-full lg:w-[40%] rounded-[20px] shadow-lg flex items-center justify-center p-4 h-[370px]" style={{ background: 'linear-gradient(135deg, #D1C6F3 0%, #E9BCAC 100%)' }}>
            <div className="flex flex-col justify-center w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-[#280A4F] mb-8 md:mb-10 text-center">
                SALES BY PLATFORM:
              </h2>
              <div className="flex flex-col space-y-6 md:space-y-8 w-full px-6 md:px-8">
                {dashboardData.salesByPlatform.map((platform, i) => (
                  <div key={i} className="flex items-center gap-4 md:gap-6 group">
                    <div className="w-[50px] h-[50px] md:w-[55px] md:h-[55px] flex items-center justify-center">
                      <img 
                        src={`/icons/${platform.name.toLowerCase()}.png`} 
                        className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] object-contain" 
                        alt={platform.name} 
                      />
                    </div>
                    <div className="flex flex-col leading-tight">
                      <div className="text-xl md:text-2xl font-semibold font-['sintony'] text-[#280A4F] group-hover:translate-x-2 transition-transform duration-300">
                        ₱{platform.value.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm md:text-base text-[#280A4F]/80 ml-2 leading-tight">
                      ({platform.name})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}