import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function ViewOrdersDialog({ product, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [product.id]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:5231/api/product/orders/${product.id}`
      );
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

      // the server may not return the modified object immediately, so perform an
      // optimistic local update to keep the UI in sync without requiring a
      // refresh/close-open cycle.
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, isPaid: !o.isPaid } : o
        )
      );
      // also update selectedOrder so the popup text toggles correctly
      setSelectedOrder((prev) =>
        prev ? { ...prev, isPaid: !prev.isPaid } : prev
      );

      // if you prefer to trust the backend response you could re-fetch:
      // await fetchOrders();

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-[#e7d6f7] to-[#f7d6d0] rounded-lg p-6 w-[800px] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#841c4f] text-xl font-bold">ORDERS</h2>
          <button
            onClick={onClose}
            className="text-[#841c4f] text-2xl hover:text-red-600"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading orders...</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto relative">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/80 backdrop-blur-sm text-[#841c4f]">
                  <th className="py-2 px-4 text-left">Names</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Size</th>
                  <th className="py-2 px-4">Platform</th>
                  <th className="py-2 px-4">Total Amount</th>
                  <th className="py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#d2679f]/30 bg-white/60 backdrop-blur-sm"
                  >
                    <td className="py-2 px-4">{order.customerName}</td>
                    <td className="py-2 px-4 text-center">{order.quantity}</td>
                    <td className="py-2 px-4 text-center">{order.size}</td>
                    <td className="py-2 px-4 text-center">{order.platform}</td>
                    <td className="py-2 px-4 text-center">
                      ₱{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handlePaymentToggle(order)}
                        className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                          order.isPaid
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {showPopup && selectedOrder && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
                <div className="bg-white rounded-lg shadow-xl p-6 w-80 border-2 border-[#841c4f]/20 transform scale-110">
                  <p className="text-center text-[#841c4f] text-lg mb-6 font-semibold">
                    Change status to {selectedOrder.isPaid ? 'Pending' : 'Paid'}?
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={confirmPaymentChange}
                      className="px-8 py-2 bg-[#841c4f] text-white rounded-lg hover:bg-[#641c3f] transition-colors font-semibold"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShowPopup(false)}
                      className="px-8 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewOrdersDialog;
