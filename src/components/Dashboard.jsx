import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import salesData from './SampleData/salesData.json';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Define the stock icons that were missing
const stockIcons = ['stock1.png', 'stock2.png', 'stock3.png'];

export default function Dashboard() {
  const { salesOverview, revenueData, salesChannels } = salesData;

  return (
    <div className="ml-0 mt-1 p-4 font-['cinzel'] overflow-x-hidden">
      {/* Total Stocks Section - Unchanged as per request */}
      <div className="relative w-full max-w-[1150px] h-[145px] left-[50px] bg-[#280a4f] rounded-[25px] overflow-hidden mb-6 hover:shadow-lg transition-all duration-300">
        <div className="absolute top-[10px] left-[45px] font-bold text-[#ffe2f0] text-[30px] hover:text-[#fff] transition-colors duration-200">
          TOTAL STOCKS
        </div>
        <div className="absolute top-[50px] left-[120px] font-bold text-[#ffe2f0] text-[50px] hover:scale-105 transition-transform duration-200">
          300
        </div>
        <div className="absolute top-[10px] right-[10px] w-[70%] h-[125px] bg-[#65366F] rounded-[20px] flex items-center justify-center gap-4 md:gap-20 shadow-[inset_0_4px_4px_rgba(0,0,0,0.25)] hover:bg-[#7a4488] transition-all duration-300">
          {stockIcons.map((icon, index) => (  
            <div key={index} className="flex items-center group">
              <img
                className="w-[45px] h-[45px] md:w-[70px] md:h-[70px] object-contain group-hover:scale-110 transition-transform duration-300"
                src={`/icons/${icon}`}
                alt={`Stock ${index}`}
              />
              <div className="ml-2 md:ml-4 font-bold text-[#ffe2f0] text-[40px] md:text-[50px] group-hover:text-white transition-colors duration-300">
                100
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area - Exactly matching width of TOTAL STOCKS section */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1150px] ml-[50px]">
        {/* Left Column - Revenue/Profit */}
        <div className="flex flex-col gap-6 w-full lg:w-[60%]">
          {/* Revenue/Profit Row */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Revenue Card */}
            <div className="flex-1 group">
              <div className="bg-[#EED2E0] rounded-[20px] h-[135px] flex flex-col justify-end shadow-[inset_0_4px_4px_rgba(0,0,0,0.3)]">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-[#280A4F] text-2xl md:text-3xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
                    {revenueData.totalRevenue}
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
                    {revenueData.netProfit}
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

          {/* Doughnut Graph Section */}
          <div className="bg-white rounded-[20px] p-4 md:p-5 h-[370px] shadow-[inset_0_4px_4px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300">
            <h2 className="mb-3 font-bold text-[#270a4e] text-2xl md:text-3xl hover:text-[#3a1a6b] transition-colors duration-200">
              {salesOverview.title}
            </h2>
            
            <div className="flex flex-col md:flex-row h-[calc(100%-80px)]">
              <div className="w-full md:w-[55%] h-full flex items-center justify-center relative">
                <Doughnut 
                  data={salesOverview.chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: window.innerWidth < 768 ? 'bottom' : 'right',
                        labels: {
                          font: {
                            size: 12,
                            family: "'Inter', sans-serif",
                            weight: 'bold'
                          },
                          color: '#270a4e',
                          padding: 15,
                          usePointStyle: true,
                          pointStyle: 'circle'
                        }
                      },
                      datalabels: {
                        color: '#fff',
                        font: {
                          weight: 'bold',
                          size: 12
                        },
                        formatter: (value, context) => {
                          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${percentage}%`;
                        }
                      }
                    }
                  }}
                />
              </div>

              <div className="flex-1 pl-0 md:pl-6 mt-3 md:mt-0">
                <h3 className="text-lg font-bold text-[#270a4e] mb-3">Top Products</h3>
                {salesOverview.topProducts.map((product, index) => (
                  <div 
                    key={index} 
                    className="mb-3 font-bold text-[#270a4e] text-base hover:text-[#4F46E5] hover:translate-x-2 transition-all duration-300"
                  >
                    <div className="flex justify-between">
                      <span>- {product.name}</span>
                      <span className="text-xs font-normal">{product.sales} units</span>
                    </div>
                    <div className="text-xs font-normal text-gray-500">Category: {product.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - SALES - Left-aligned content but centered horizontally */}
        <div className="w-full lg:w-[40%] bg-gradient-to-b from-[#D183A9] to-[#9D0A52] rounded-[20px] shadow-lg flex items-center justify-center p-4">
          <div className="flex flex-col justify-center w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-10 text-center">
              SALES:
            </h2>
            <div className="flex flex-col space-y-6 md:space-y-8 w-full px-6 md:px-8">
              {salesChannels.map((channel, i) => (
                <div key={i} className="flex items-center gap-4 md:gap-6 group">
                  <div className="w-[50px] h-[50px] md:w-[55px] md:h-[55px] flex items-center justify-center">
                    <img 
                      src={`/icons/${channel.icon}`} 
                      className="w-[40px] h-[40px] md:w-[45px] md:h-[45px] object-contain" 
                      alt={channel.platform} 
                    />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <div className="text-xl md:text-2xl font-semibold font-['sintony'] text-white group-hover:translate-x-2 transition-transform duration-300">
                      {channel.amount}
                    </div>
                  </div>
                  <div className="text-sm md:text-base text-white/80 ml-2 leading-tight">
                    ({channel.platform})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}