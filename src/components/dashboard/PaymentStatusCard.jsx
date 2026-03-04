import React from 'react';

export default function PaymentStatusCard({ totalPaidOrders, totalPendingOrders }) {
  return (
    <div className="flex-1">
      <div className="bg-[#EED2E0] rounded-[20px] h-[135px] flex flex-col justify-end shadow-[inset_0_4px_4px_rgba(0,0,0,0.3)]">
        <div className="flex-1 flex flex-row justify-center items-center gap-6">
          {/* Paid Orders */}
          <div className="flex flex-col items-center group">
            <div className="text-green-600 text-2xl md:text-3xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
              {totalPaidOrders || 0}
            </div>
            <div className="text-green-600 text-sm font-medium">
              Paid
            </div>
          </div>
          
          {/* Pending Orders */}
          <div className="flex flex-col items-center group">
            <div className="text-yellow-600 text-2xl md:text-3xl font-bold font-['sintony'] group-hover:scale-105 transition-transform duration-200">
              {totalPendingOrders || 0}
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
  );
}
