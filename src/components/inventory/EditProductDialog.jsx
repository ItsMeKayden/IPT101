import { useState } from 'react';
import { toast } from 'react-toastify';
import { PRODUCT_CATEGORIES } from './constants';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

function EditProductDialog({ product, onClose, fetchProducts }) {
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    image: null,
    small: product.sizes.small,
    medium: product.sizes.medium,
    large: product.sizes.large,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

      const response = await fetch(
        `http://localhost:5231/api/product/${product.id}`,
        {
          method: 'PUT',
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      await fetchProducts();
      onClose();

      toast.success('✅ Product updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
        style: {
          backgroundColor: '#4CAF50',
          color: 'white',
        },
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(`❌ ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
        theme: 'colored',
        style: {
          backgroundColor: '#f44336',
          color: 'white',
        },
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:5231/api/product/${product.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      await fetchProducts();
      onClose();

      toast.success('🗑️ Product deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        theme: 'colored',
        style: {
          backgroundColor: '#4CAF50',
          color: 'white',
        },
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(`❌ ${error.message}`, {
        position: 'top-right',
        autoClose: 5000,
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
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#841c4f]">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Product
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#841c4f] text-white rounded-lg hover:bg-[#621c3f] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
        <DeleteConfirmationDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            handleDelete();
            setShowDeleteConfirm(false);
          }}
        />
      </div>
    </div>
  );
}

export default EditProductDialog;
