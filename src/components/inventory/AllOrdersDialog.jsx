import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AllOrdersDialog({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await fetch('http://localhost:5231/api/product/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentToggle = async (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const confirmPaymentChange = async () => {
    try {
      const response = await fetch(
        `http://localhost:5231/api/product/orders/${selectedOrder.id}/updatePayment`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isPaid: !selectedOrder.isPaid,
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to update payment status');

      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, isPaid: !o.isPaid } : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, isPaid: !prev.isPaid } : prev
      );

      setShowPopup(false);
      toast.success(
        `✅ Status updated to ${!selectedOrder.isPaid ? 'Paid' : 'Pending'}!`,
        {
          position: 'top-right',
          autoClose: 3000,
          theme: 'colored',
        }
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const getFilteredOrders = () => {
    let filtered = orders;
    
    // Filter by tab (pending/paid)
    if (activeTab === 'pending') {
      filtered = filtered.filter((order) => !order.isPaid);
    } else {
      filtered = filtered.filter((order) => order.isPaid);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customerName.toLowerCase().includes(term) ||
          order.productName.toLowerCase().includes(term) ||
          order.platform.toLowerCase().includes(term) ||
          order.size.toLowerCase().includes(term)
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-[#e7d6f7] to-[#f7d6d0] rounded-lg p-6 w-[1000px] max-h-[600px] shadow-lg flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#841c4f] text-xl font-bold">ALL ORDERS</h2>
          <button
            onClick={onClose}
            className="text-[#841c4f] text-2xl hover:text-red-600"
          >
            ×
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by customer name, product, platform, or size..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[#c99ab5] bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#841c4f]"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-4 border-b border-[#c99ab5]">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 font-semibold transition-all ${
              activeTab === 'pending'
                ? 'text-[#841c4f] border-b-2 border-[#841c4f]'
                : 'text-gray-600 hover:text-[#841c4f]'
            }`}
          >
            Pending ({orders.filter((o) => !o.isPaid).length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-6 py-2 font-semibold transition-all ${
              activeTab === 'paid'
                ? 'text-[#841c4f] border-b-2 border-[#841c4f]'
                : 'text-gray-600 hover:text-[#841c4f]'
            }`}
          >
            Paid ({orders.filter((o) => o.isPaid).length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            {searchTerm.trim()
              ? `No ${activeTab} orders found matching "${searchTerm}"`
              : `No ${activeTab} orders found`}
          </div>
        ) : (
          <div className="overflow-y-auto flex-1">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#d4b5d4]">
                <tr>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-left text-[#841c4f] font-bold">
                    Customer Name
                  </th>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-left text-[#841c4f] font-bold">
                    Product
                  </th>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-center text-[#841c4f] font-bold">
                    Quantity
                  </th>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-center text-[#841c4f] font-bold">
                    Size
                  </th>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-center text-[#841c4f] font-bold">
                    Platform
                  </th>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-right text-[#841c4f] font-bold">
                    Amount
                  </th>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-left text-[#841c4f] font-bold">
                    Date
                  </th>
                  <th className="border border-[#b8a0b8] px-4 py-2 text-center text-[#841c4f] font-bold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#f9f4f9]'}
                  >
                    <td className="border border-[#d4b5d4] px-4 py-2 text-gray-800">
                      {order.customerName}
                    </td>
                    <td className="border border-[#d4b5d4] px-4 py-2 text-gray-800">
                      {order.productName}
                    </td>
                    <td className="border border-[#d4b5d4] px-4 py-2 text-center text-gray-800">
                      {order.quantity}
                    </td>
                    <td className="border border-[#d4b5d4] px-4 py-2 text-center text-gray-800">
                      {order.size}
                    </td>
                    <td className="border border-[#d4b5d4] px-4 py-2 text-center text-gray-800">
                      {order.platform}
                    </td>
                    <td className="border border-[#d4b5d4] px-4 py-2 text-right text-gray-800 font-semibold">
                      ₱{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="border border-[#d4b5d4] px-4 py-2 text-gray-600 text-sm">
                      {formatDate(order.orderDate)}
                    </td>
                    <td className="border border-[#d4b5d4] px-4 py-2 text-center">
                      <button
                        onClick={() => handlePaymentToggle(order)}
                        className={`px-3 py-1 rounded text-white font-semibold transition-all ${
                          order.isPaid
                            ? 'bg-green-500 hover:bg-green-600'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Popup */}
      {showPopup && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 text-center shadow-lg w-80">
            <h3 className="text-xl font-bold text-[#841c4f] mb-4">
              Confirm Status Change
            </h3>
            <p className="text-gray-700 mb-6">
              Change order status from{' '}
              <span className="font-semibold">
                {selectedOrder.isPaid ? 'Paid' : 'Pending'}
              </span>{' '}
              to{' '}
              <span className="font-semibold">
                {selectedOrder.isPaid ? 'Pending' : 'Paid'}
              </span>
              ?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmPaymentChange}
                className="px-4 py-2 rounded bg-[#841c4f] text-white font-semibold hover:bg-[#5d1535]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllOrdersDialog;
