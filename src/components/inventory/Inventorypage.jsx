import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import CategoryTabs from './CategoryTabs';
import SearchBar from './SearchBar';
import ProductDisplay from './ProductDisplay';
import FloatingButtons from './FloatingButtons';
import OrderForm from './OrderForm';
import ViewOrdersDialog from './ViewOrdersDialog';
import AllOrdersDialog from './AllOrdersDialog';
import AddProductDialog from './AddProductDialog';
import EditProductDialog from './EditProductDialog';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);
  const [showAllOrdersDialog, setShowAllOrdersDialog] = useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showEditMode, setShowEditMode] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5231/api/product', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = (product) => {
    setSelectedProduct(product);
    setShowOrderForm(true);
  };

  const handleOrderComplete = async () => {
    await fetchProducts();
    setShowOrderForm(false);
    setSelectedProduct(null);
  };

  const handleViewOrders = (product) => {
    setSelectedProduct(product);
    setShowOrdersDialog(true);
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        activeCategory === 'all' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  };

  const toggleEditMode = () => {
    setShowEditMode(!showEditMode);
    if (showEditMode) {
      setSelectedProductForEdit(null);
    }
  };

  const handleProductSelect = (product) => {
    if (showEditMode) {
      setSelectedProductForEdit(product);
      setShowEditMode(false);
    }
  };

  const handleShowAddProductDialog = () => {
    setShowAddProductDialog(true);
  };

  const handleShowAllOrdersDialog = () => {
    setShowAllOrdersDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f9]">
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="p-5">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <div className="flex justify-between px-[45px] border-b border-transparent mb-5 font-medium">
          <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-gray-900 px-[40px] select-none">
            PRODUCTS
          </div>
          <div className="flex items-center font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-gray-900 px-[27px] mr-[500px] select-none">
            STOCKS
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-800">
            Loading products...
          </div>
        ) : (
          <ProductDisplay
            products={getFilteredProducts()}
            showEditMode={showEditMode}
            onProductSelect={handleProductSelect}
            onOrder={handleOrder}
            onViewOrders={handleViewOrders}
          />
        )}
      </div>
      <FloatingButtons
        onEditToggle={toggleEditMode}
        onAddProduct={handleShowAddProductDialog}
        onViewAllOrders={handleShowAllOrdersDialog}
        showEditMode={showEditMode}
      />
      {showOrderForm && (
        <OrderForm
          product={selectedProduct}
          onClose={() => setShowOrderForm(false)}
          onSubmit={handleOrderComplete}
        />
      )}
      {showOrdersDialog && (
        <ViewOrdersDialog
          product={selectedProduct}
          onClose={() => setShowOrdersDialog(false)}
        />
      )}
      {showAllOrdersDialog && (
        <AllOrdersDialog
          onClose={() => setShowAllOrdersDialog(false)}
        />
      )}
      {showAddProductDialog && (
        <AddProductDialog
          onClose={() => setShowAddProductDialog(false)}
          fetchProducts={fetchProducts}
        />
      )}
      {selectedProductForEdit && (
        <EditProductDialog
          product={selectedProductForEdit}
          onClose={() => setSelectedProductForEdit(null)}
          fetchProducts={fetchProducts}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default Inventory;
