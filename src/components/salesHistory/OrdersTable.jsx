import React from 'react';
import { TABLE_COLUMNS } from './constants';

export default function OrdersTable({
  filteredOrders,
  sortConfig,
  totalAmount,
  onSort
}) {
  return (
    <div>
      <div className="overflow-x-auto rounded-xl shadow-[0_4px_8px_rgba(101,54,111,0.2)]">
        <table className="min-w-full bg-white">
          <thead className="bg-[#65366F] text-white">
            <tr>
              {TABLE_COLUMNS.map(column => (
                <th key={column.key} className="p-4 text-center border-b border-[#841c4f]/30">
                  <button
                    className="font-semibold flex items-center justify-center gap-1 w-full hover:opacity-80"
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                    {sortConfig.key === column.key && (sortConfig.direction === 'ascending' ? ' ▲' : ' ▼')}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <tr
                  key={idx}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9eef5]'} hover:bg-[#FFE2F0]/50 transition-colors`}
                >
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.customerName}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.productName}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.productCategory}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.quantity}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.size}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.platform}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                  </td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">{order.isPaid ? 'Paid' : 'Pending'}</td>
                  <td className="p-4 text-center border-b border-[#841c4f]/30">₱{order.totalAmount.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-8 text-center text-[#841c4f]">
                  No sales data found for the selected criteria
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-[#FFE2F0] text-[#841c4f]">
            <tr>
              <td colSpan="8" className="p-4 text-right font-semibold border-t border-[#841c4f]/30">
                Total:
              </td>
              <td className="p-4 text-center font-bold border-t border-[#841c4f]/30">
                ₱{totalAmount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Results summary */}
      <div className="mt-4 text-sm text-[#841c4f]">
        Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} for the selected period
      </div>
    </div>
  );
}
