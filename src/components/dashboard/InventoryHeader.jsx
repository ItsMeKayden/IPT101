import React from 'react';

const stockIcons = ['pisbok.png', 'instagram.png'];

export default function InventoryHeader({ totalStocks, ordersByPlatform }) {
  return (
    <div className="relative w-full h-[135px] bg-[#65366F] rounded-[25px] overflow-hidden mb-6 hover:shadow-lg transition-all duration-300">
      <div className="absolute top-[10px] left-[45px] font-bold text-[#ffe2f0] text-[24px] hover:text-[#fff] transition-colors duration-200">
        TOTAL INVENTORY
      </div>
      <div className="absolute top-[50px] left-[100px] font-bold text-[#ffe2f0] text-[50px] hover:scale-105 transition-transform duration-200">
        {totalStocks}
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
                {index === 0 ? ordersByPlatform.facebook : 
                 ordersByPlatform.instagram}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
