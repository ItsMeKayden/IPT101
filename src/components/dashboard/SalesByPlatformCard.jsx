import React from 'react';

const platformIconMap = {
  'Facebook': 'pisbok.png',
  'Instagram': 'instagram.png'
};

export default function SalesByPlatformCard({ salesByPlatform }) {
  return (
    <div className="w-full lg:w-[40%] rounded-[20px] shadow-lg flex items-center justify-center p-4 h-[370px]" style={{ background: 'linear-gradient(135deg, #D1C6F3 0%, #E9BCAC 100%)' }}>
      <div className="flex flex-col justify-center w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-[#280A4F] mb-8 md:mb-10 text-center">
          SALES BY PLATFORM:
        </h2>
        <div className="flex flex-col space-y-6 md:space-y-8 w-full px-6 md:px-8">
          {salesByPlatform.map((platform, i) => (
            <div key={i} className="flex items-center gap-4 md:gap-6 group">
              <div className="w-[50px] h-[50px] md:w-[55px] md:h-[55px] flex items-center justify-center">
                <img 
                  src={`/icons/${platformIconMap[platform.name]}`} 
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
  );
}
