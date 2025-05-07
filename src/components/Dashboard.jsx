import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import salesData from './SampleData/salesData.json';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function Dashboard() {
  const { salesOverview, revenueData, salesChannels } = salesData;

  return (
    <div className="ml-0 mt-1 p-5 font-['cinzel'] overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-[#841C4F] text-4xl font-bold">DASHBOARD</h1>
        <div className="bg-white rounded-full px-4 py-2 shadow">
          <span className="text-[#841C4F] font-bold">DATE: </span>
          <span className="text-[#841C4F]">APRIL 4, 2024</span>
        </div>
      </div>

      {/* Total Stocks Section */}
      <div className="bg-[#841C4F] rounded-[25px] p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="text-white">
              <div className="text-2xl font-bold">TOTAL STOCKS</div>
              <div className="text-4xl font-bold">300</div>
            </div>
          </div>
          <div className="flex items-center gap-12 bg-[rgba(255,255,255,0.15)] px-8 py-4 rounded-[20px]">
            {['facebook', 'instagram', 'shopee'].map((platform, index) => (
              <div key={platform} className="flex items-center gap-4">
                <img
                  src={`/icons/${platform}.png`}
                  alt={platform}
                  className="w-[40px] h-[40px]"
                />
                <span className="text-white text-3xl font-bold">100</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Card */}
        <div className="bg-[#FFE2F0] rounded-[25px] overflow-hidden">
          <div className="p-6">
            <div className="text-[#841C4F] text-4xl font-bold text-center">
              P 4,500.00
            </div>
          </div>
          <div className="bg-[#841C4F] p-4">
            <div className="text-white text-xl font-bold text-center">
              TOTAL REVENUE
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="bg-[#FFE2F0] rounded-[25px] overflow-hidden">
          <div className="p-6">
            <div className="text-[#841C4F] text-4xl font-bold text-center">
              P 4,500.00
            </div>
          </div>
          <div className="bg-[#841C4F] p-4">
            <div className="text-white text-xl font-bold text-center">
              NET PROFIT
            </div>
          </div>
        </div>

        {/* Sales Card */}
        <div className="bg-[#FFE2F0] rounded-[25px] p-6">
          <h2 className="text-[#841C4F] text-2xl font-bold mb-6">SALES:</h2>
          <div className="space-y-4">
            {['shopee', 'instagram', 'facebook'].map((platform) => (
              <div key={platform} className="flex items-center gap-4">
                <img
                  src={`/icons/${platform}.png`}
                  alt={platform}
                  className="w-[30px] h-[30px]"
                />
                <span className="text-[#841C4F] text-xl font-bold">
                  P 4,500.00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Overview Chart */}
        <div className="col-span-2 bg-white rounded-[25px] p-6">
          <h2 className="text-[#841C4F] text-2xl font-bold mb-6">
            SALES OVERVIEW
          </h2>
          <div className="flex">
            <div className="w-1/2">
              <Doughnut
                data={salesOverview.chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    datalabels: {
                      color: '#fff',
                      font: { weight: 'bold' },
                    },
                  },
                }}
              />
            </div>
            <div className="w-1/2 pl-8">
              {/* Product List */}
              {[
                'SHAKANEBALOCK',
                'SHAKANEBALOCK',
                'SHAKANEBALOCK',
                'SHAKANEBALOCK',
              ].map((product, index) => (
                <div key={index} className="text-[#841C4F] mb-2">
                  - {product}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
