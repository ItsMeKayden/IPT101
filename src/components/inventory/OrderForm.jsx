import { useState } from 'react';
import { toast } from 'react-toastify';

function OrderForm({ product, onClose, onSubmit }) {
  const [orderData, setOrderData] = useState({
    customerName: '',
    quantity: 1,
    size: 'small',
    platform: '',
    totalAmount: product.price,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'quantity') {
        newData.totalAmount = product.price * parseInt(value || 1);
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderData.customerName.trim()) {
      toast.error('❌ Please enter customer name', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#f44336',
          color: 'white',
        },
      });
      return;
    }

    if (!orderData.platform) {
      toast.error('❌ Please select a platform', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#f44336',
          color: 'white',
        },
      });
      return;
    }

    const remainingStock =
      product.sizes[
        `remaining${
          orderData.size.charAt(0).toUpperCase() + orderData.size.slice(1)
        }`
      ];

    if (parseInt(orderData.quantity) > remainingStock) {
      toast.warning(
        `⚠️ Not enough stock available! Only ${remainingStock} ${orderData.size} items remaining.`,
        {
          position: 'top-right',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
          style: {
            backgroundColor: '#ff9800',
            color: 'white',
          },
        }
      );
      return;
    }

    try {
      const requestBody = {
        customerName: orderData.customerName,
        quantity: parseInt(orderData.quantity),
        size: orderData.size.toLowerCase(),
        platform: orderData.platform.toLowerCase(),
      };

      const response = await fetch(
        `http://localhost:5231/api/product/${product.id}/updateStock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      await onSubmit(result);
      onClose();

      toast.success('🎉 Order placed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#4CAF50',
          color: 'white',
        },
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(`❌ ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#f44336',
          color: 'white',
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-[#e7d6f7] to-[#f7d6d0] rounded-lg p-6 w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#841c4f] text-xl font-bold">Place Order</h2>
          <button
            onClick={onClose}
            className="text-[#841c4f] text-2xl hover:text-red-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#841c4f] mb-1">Customer Name:</label>
            <input
              type="text"
              name="customerName"
              value={orderData.customerName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-white/80 backdrop-blur-sm border-[#d2679f]/30 focus:border-[#d2679f] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[#841c4f] mb-1">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={orderData.quantity}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-white/80 backdrop-blur-sm border-[#d2679f]/30 focus:border-[#d2679f] focus:outline-none"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-[#841c4f] mb-1">Size:</label>
            <select
              name="size"
              value={orderData.size}
              onChange={handleInputChange}
              className="w-full p-3 border rounded bg-white/80 backdrop-blur-sm border-[#d2679f]/30 focus:border-[#d2679f] focus:outline-none text-[#841c4f] text-lg"
              required
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex gap-6 justify-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="platform"
                value="facebook"
                checked={orderData.platform === 'facebook'}
                onChange={handleInputChange}
                className="w-6 h-6 accent-[#ffb6c1]"
                required
              />
              <img
                src="icons/image 10.png"
                alt="Facebook"
                className="w-8 h-8"
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="platform"
                value="instagram"
                checked={orderData.platform === 'instagram'}
                onChange={handleInputChange}
                className="w-6 h-6 accent-[#ffb6c1]"
                required
              />
              <img
                src="icons/image 9.png"
                alt="Instagram"
                className="w-8 h-8"
              />
            </label>
          </div>

          <div className="text-center text-[#841c4f] font-bold">
            Total Amount: ₱{orderData.totalAmount.toFixed(2)}
          </div>

          <button
            type="submit"
            className="w-full bg-[#ffea99] text-[#841c4f] py-2 rounded font-bold hover:bg-[#f0dc8e]"
          >
            ORDER
          </button>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
