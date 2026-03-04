import React from 'react';

export default function StatCard({ value, label, subtitle }) {
  return (
    <div className="flex-1 group">
      <div className="bg-[#EED2E0] rounded-[20px] h-[135px] flex flex-col justify-end shadow-[inset_0_4px_4px_rgba(0,0,0,0.3)]">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-[#280A4F] text-3xl md:text-4xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
            {value}
          </div>
          <div className="text-[#280A4F] text-sm opacity-70 mt-1">
            {subtitle || label}
          </div>
        </div>
        <div className="bg-[#65366F] rounded-[20px] p-3 h-[55px] flex items-center justify-center">
          <div className="text-white text-base md:text-lg font-semibold">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
