import React, { useState } from 'react';

const OrderForm = ({ product, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    quantity: 1,
    size: 'small', // Must match exactly what the API expects (lowercase)
    platform: '', // Must be 'facebook', 'instagram', or 'shopee'
    totalAmount: product.price,
  });

  // Add form validation
  const validateForm = () => {
    if (!formData.customerName.trim()) {
      alert('Please enter customer name');
      return false;
    }
    if (formData.quantity < 1) {
      alert('Quantity must be at least 1');
      return false;
    }
    if (!formData.platform) {
      alert('Please select a platform');
      return false;
    }
    return true;
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value) || 0;
    setFormData({
      ...formData,
      quantity,
      totalAmount: quantity * product.price,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there's enough remaining stock
    const remainingStock =
      product.sizes[
        `remaining${
          formData.size.charAt(0).toUpperCase() + formData.size.slice(1)
        }`
      ];

    if (formData.quantity > remainingStock) {
      alert(
        `Not enough stock available! Only ${remainingStock} ${formData.size} items remaining.`
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5231/api/product/${product.id}/updateStock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: formData.customerName,
            quantity: parseInt(formData.quantity),
            size: formData.size,
            platform: formData.platform,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();
      onSubmit(result);
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#FFE2F0] p-6 rounded-xl w-[400px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#841c4f] mb-1">Customer Name:</label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="w-full p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-[#841c4f] mb-1">Quantity:</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={handleQuantityChange}
              className="w-full p-2 rounded"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-[#841c4f] mb-1">Size:</label>
            <select
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              className="w-full p-2 rounded"
              required
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="text-[#841c4f] mb-4">
            <label className="block text-center mb-2">PLATFORM</label>
            <div className="flex justify-center gap-8">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="platform"
                  value="facebook"
                  checked={formData.platform === 'facebook'}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
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
                  checked={formData.platform === 'instagram'}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                />
                <img
                  src="icons/image 9.png"
                  alt="Instagram"
                  className="w-8 h-8"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="platform"
                  value="shopee"
                  checked={formData.platform === 'shopee'}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                />
                <img src="icons/image 8.png" alt="Shopee" className="w-8 h-8" />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[#841c4f] mb-1">Total Amount:</label>
            <input
              type="text"
              value={`₱ ${formData.totalAmount.toFixed(2)}`}
              className="w-full p-2 rounded bg-white"
              disabled
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-[#ffea99] text-[#841c4f] px-8 py-2 rounded-lg hover:bg-[#841c4f] hover:text-white transition-colors"
            >
              ORDER
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
