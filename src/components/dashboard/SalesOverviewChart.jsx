import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export default function SalesOverviewChart({ salesByCategory, topProducts }) {
  return (
    <div className="w-full lg:w-[60%] bg-white rounded-[20px] p-4 md:p-5 h-[370px] shadow-[inset_0_4px_4px_rgba(0,0,0,0.1),0_4px_4px_rgba(0,0,0,0.25)] transition-all duration-300">
      <h2 className="mb-3 font-bold text-[#270a4e] text-2xl md:text-3xl hover:text-[#3a1a6b] transition-colors duration-200">
        Sales Overview
      </h2>
      
      <div className="flex flex-col md:flex-row h-[calc(100%-80px)]">
        {/* Top Products List */}
        <div className="flex-1 pl-0 md:pl-6 mt-3 md:mt-0">
          <h3 className="text-lg font-bold text-[#270a4e] mb-3">Top Products</h3>
          {topProducts.map((product, index) => (
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
              labels: salesByCategory.map(item => item.name),
              datasets: [{
                data: salesByCategory.map(item => item.value),
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
  );
}
