import { useState } from 'react';
import { toast } from 'react-toastify';
import { PRODUCT_CATEGORIES } from './constants';

function AddProductDialog({ onClose, fetchProducts }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    image: null,
    small: 0,
    medium: 0,
    large: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Category', formData.category);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Small', formData.small);
      formDataToSend.append('Medium', formData.medium);
      formDataToSend.append('Large', formData.large);

      if (formData.image) {
        formDataToSend.append('Image', formData.image);
      }

      const response = await fetch('http://localhost:5231/api/product', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      await fetchProducts();

      setFormData({
        name: '',
        category: '',
        price: '',
        image: null,
        small: 0,
        medium: 0,
        large: 0,
      });

      onClose();

      toast.success('🎉 Product added successfully!', {
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
      console.error('Error submitting form:', error);
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
      <div className="max-w-[500px] w-full rounded-xl relative bg-gradient-to-b from-[#e7d6f7] to-[#f7d6d0] shadow-lg">
        <button
          onClick={onClose}
          className="close-button absolute top-2 right-2 text-[#841c4f] text-2xl font-bold z-10"
        >
          ×
        </button>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-[#841c4f] mb-2">Product Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-300"
              required
            />
          </div>

          <div>
            <label className="block text-[#841c4f] mb-2">Category:</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-300"
              required
            >
              <option value="">Select a category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#841c4f] mb-2">Product Price:</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-2 rounded border border-gray-300"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-[#841c4f] mb-2">Product Image:</label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="product-image-upload"
                className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white/80 border border-gray-300 rounded-lg shadow hover:bg-pink-100 transition"
              >
                <img src="/icons/addimage.png" alt="Add" className="w-6 h-6" />
                <span className="text-[#841c4f] font-semibold">Add Image</span>
                <input
                  id="product-image-upload"
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  className="hidden"
                  accept="image/*"
                />
              </label>
              {formData.image && (
                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                  {formData.image.name}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between gap-4">
              <div>
                <label className="block text-sm text-center mb-1">Small</label>
                <input
                  type="number"
                  value={formData.small}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      small: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 rounded border border-gray-300"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-center mb-1">
                  Medium
                </label>
                <input
                  type="number"
                  value={formData.medium}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      medium: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 rounded border border-gray-300"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-center mb-1">Large</label>
                <input
                  type="number"
                  value={formData.large}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      large: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full p-2 rounded border border-gray-300"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            ADD PRODUCT
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductDialog;
