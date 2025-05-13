import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PRODUCT_CATEGORIES = [
  { value: 'dress', label: 'Dress' },
  { value: 'top', label: 'Top' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'skirts', label: 'Skirts' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'hats', label: 'Hats' },
  { value: 'others', label: 'Others' },
];

// Main App Component
function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchProducts();

    // Handle Add Button popup
    const addButton = document.querySelector('.add-btn');
    if (addButton) {
      addButton.addEventListener('click', () => {
        setShowAddProductDialog(true);
      });
    }

    return () => {
      if (addButton) {
        addButton.removeEventListener('click', () => {});
      }
    };
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
    // Refresh products to update quantities
    await fetchProducts();
    setShowOrderForm(false);
    setSelectedProduct(null);
  };

  const handleViewOrders = (product) => {
    setSelectedProduct(product);
    setShowOrdersDialog(true);
  };

  const updateProductStock = async (product, formData) => {
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
            quantity: formData.quantity,
            size: formData.size,
            platform: formData.platform,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();
      await fetchProducts(); // Refresh the products list
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleOrderSubmit = async (result) => {
    try {
      await fetchProducts(); // Refresh the products list
      setShowOrderForm(false);
    } catch (error) {
      console.error('Error updating products:', error);
      alert('Error updating products. Please try again.');
    }
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

  const renderProducts = () => (
    <div className="px-12 pl-[62px]">
      {getFilteredProducts().map((product) => (
        <div key={product.id} className="mb-8 flex items-start gap-6">
          {/* Product Image and Info */}
          <div className="relative w-[150px] flex flex-col items-center group">
            <div
              className="w-[170px] h-[220px] flex items-center justify-center overflow-visible z-20 relative"
              style={{ marginBottom: '-20px' }}
            >
              <img
                src={
                  product.imagePath
                    ? `http://localhost:5231${product.imagePath}`
                    : '/icons/image (2).png'
                }
                alt={product.name}
                className="w-full h-full object-cover rounded-xl border border-[#65366F]/30 shadow-lg transition-transform duration-300 group-hover:scale-110 bg-white"
                style={{ zIndex: 2, position: 'relative' }}
                onError={(e) => {
                  console.log('Image load error:', product.imagePath);
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = '/icons/image (2).png'; // Fallback image
                }}
              />
            </div>
            {/* Overlay Product Name/Price */}
            <div
              className="w-[170px] h-[100px] bg-[#ffea99] rounded-xl flex flex-col items-center justify-center py-2 px-2 shadow-lg z-10 border border-yellow-200 relative"
              style={{ marginTop: '-5px' }}
            >
              <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-[15px] uppercase text-center w-full mt-[25px]">
                {product.name}
              </div>
              <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-sm text-center text-[#841c4f] italic">
                {product?.category &&
                PRODUCT_CATEGORIES.find((cat) => cat.value === product.category)
                  ? PRODUCT_CATEGORIES.find(
                      (cat) => cat.value === product.category
                    ).label
                  : 'Uncategorized'}
              </div>
              <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-center w-full">
                P {Number(product.price).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Stock Table */}
          <div
            className="flex-1 min-h-[218px] h-[218px] bg-[#f9eef5] rounded-xl flex items-stretch shadow-[0_4px_8px_rgba(101,54,111,0.2)] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            onClick={() => handleViewOrders(product)}
          >
            {/* S/M/L Panel */}
            <div className="flex flex-col items-center bg-[#65366F] text-white px-3 py-2 rounded-l-xl w-[48px] gap-[30px]">
              <div className="font-bold mt-[50px]">S</div>
              <div className="font-bold">M</div>
              <div className="font-bold">L</div>
            </div>
            {/* Table Columns */}
            <div className="flex-1 grid grid-cols-5 divide-x divide-[#e5d0e5]">
              {/* Total */}
              <div className="flex flex-col items-center gap-[30px] mt-2">
                <div className="font-bold text-[#841c4f]">TOTAL</div>
                <div>{product.sizes?.small || 0}</div>
                <div>{product.sizes?.medium || 0}</div>
                <div>{product.sizes?.large || 0}</div>
              </div>
              {/* Remaining */}
              <div className="flex flex-col items-center gap-[30px] mt-2">
                <div className="font-bold text-[#841c4f]">REMAINING</div>
                <div
                  className={getStockColorClass(
                    product.sizes?.remainingSmall || 0
                  )}
                >
                  {product.sizes?.remainingSmall || 0}
                </div>
                <div
                  className={getStockColorClass(
                    product.sizes?.remainingMedium || 0
                  )}
                >
                  {product.sizes?.remainingMedium || 0}
                </div>
                <div
                  className={getStockColorClass(
                    product.sizes?.remainingLarge || 0
                  )}
                >
                  {product.sizes?.remainingLarge || 0}
                </div>
              </div>
              {/* Facebook */}
              <div className="flex flex-col items-center gap-[30px] mt-2">
                <div className="font-bold flex items-center gap-1">
                  <img
                    src="icons/image 10.png"
                    alt="Facebook"
                    className="w-5 h-5"
                  />
                  FACEBOOK
                </div>
                <div>{product.sizes.smallFB}</div>
                <div>{product.sizes.mediumFB}</div>
                <div>{product.sizes.largeFB}</div>
              </div>
              {/* Instagram */}
              <div className="flex flex-col items-center gap-[30px] mt-2">
                <div className="font-bold flex items-center gap-1">
                  <img
                    src="icons/image 9.png"
                    alt="Instagram"
                    className="w-5 h-5"
                  />
                  INSTAGRAM
                </div>
                <div>{product.sizes.smallIG}</div>
                <div>{product.sizes.mediumIG}</div>
                <div>{product.sizes.largeIG}</div>
              </div>
              {/* Shopee */}
              <div className="flex flex-col items-center gap-[30px] mt-2">
                <div className="font-bold flex items-center gap-1">
                  <img
                    src="icons/image 8.png"
                    alt="Shopee"
                    className="w-5 h-5"
                  />
                  SHOPEE
                </div>
                <div>{product.sizes.smallShopee}</div>
                <div>{product.sizes.mediumShopee}</div>
                <div>{product.sizes.largeShopee}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 items-start justify-start h-[170px] ml-2">
            <button
              onClick={() => handleOrder(product)}
              className="bg-[#FFE2F0] text-[#841c4f] w-[120px] h-[44px] rounded-lg text-base font-semibold hover:bg-[#c599ae] hover:text-white transition-colors"
            >
              Order
            </button>
            <button
              onClick={() => handleViewOrders(product)}
              className="bg-[#FFE2F0] text-[#841c4f] w-[120px] h-[44px] rounded-lg text-base font-semibold hover:bg-[#c599ae] hover:text-white transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f9]">
      <div className="top-0 left-[80px] w-full h-[65px] bg-[#65366F] shadow-md z-10">
        <div className="flex gap-5 h-full items-center justify-center overflow-visible">
          <CategoryTab
            name="ALL"
            category="all"
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {PRODUCT_CATEGORIES.map((cat) => (
            <CategoryTab
              key={cat.value}
              name={cat.label.toUpperCase()}
              category={cat.value}
              active={activeCategory === cat.value}
              onClick={() => setActiveCategory(cat.value)}
            />
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-center mb-8 relative">
          <input
            type="text"
            className="w-[903px] h-[40px] rounded-full border border-[#65366F] px-5 py-0 text-base bg-white text-gray-900"
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src="icons/Search.png"
            alt="Search"
            className="absolute right-[195px] top-1/2 transform -translate-y-1/2 w-5 h-5"
          />
        </div>
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
          renderProducts()
        )}
      </div>
      <div className="fixed right-5 bottom-[50px] flex flex-col gap-4">
        <img
          src="icons/Group 6.png"
          alt="EDIT"
          className="w-[60px] h-[60px] transition-transform duration-300 ease-in-out hover:scale-110"
        />
        <img
          src="icons/addproduct.png"
          alt="ADD"
          className="w-[60px] h-[60px] object-cover transition-transform duration-300 ease-in-out hover:scale-110 add-btn brightness-75"
        />
      </div>
      {showOrderForm && (
        <OrderForm
          product={selectedProduct}
          onClose={() => setShowOrderForm(false)}
          onSubmit={handleOrderSubmit}
        />
      )}
      {showOrdersDialog && (
        <ViewOrdersDialog
          product={selectedProduct}
          onClose={() => setShowOrdersDialog(false)}
        />
      )}
      {showAddProductDialog && (
        <AddProductDialog
          onClose={() => setShowAddProductDialog(false)}
          fetchProducts={fetchProducts}
        />
      )}
      <ToastContainer />
    </div>
  );
}

// Main Content Component
function MainContent() {
  useEffect(() => {
    // Handle category tab activation
    const categoryTabs = document.querySelectorAll('.tab-btn');
    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach((t) => t.classList.remove('active', 'text-white'));
        tab.classList.add('active', 'text-white');
      });
    });

    // Handle Add Button popup
    const addButton = document.querySelector('.add-btn');
    const popup = document.querySelector('.dialog-overlay');
    const closeButton = document.querySelector('.close-button');

    if (popup && addButton && closeButton) {
      popup.style.display = 'none';

      addButton.addEventListener('click', () => {
        popup.style.display = 'flex';
      });

      closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
      });

      popup.addEventListener('click', (event) => {
        if (event.target === popup) {
          popup.style.display = 'none';
        }
      });
    }

    // Handle size panel popups
    const sizePanels = ['fb', 'ig', 'sp', 'overall'];
    sizePanels.forEach((key) => {
      const panel = document.getElementById(key);
      const popup = document.getElementById(`${key}-popup`);

      if (panel && popup) {
        panel.addEventListener('click', () => {
          popup.style.display = 'flex';
        });

        const closeBtn = popup.querySelector('.size-popup-close');
        closeBtn?.addEventListener('click', () => {
          popup.style.display = 'none';
        });

        popup.addEventListener('click', (event) => {
          if (event.target === popup) {
            popup.style.display = 'none';
          }
        });
      }
    });

    // Cleanup listeners on unmount
    return () => {
      // Cleanup code omitted for brevity
    };
  }, []);

  return (
    <main className="ml-0 pt-0">
      {' '}
      {/* Added padding-top to account for header + subheader */}
      <SubHeader />
      <div className="p-5">
        <SearchBar />
        <NavigationTabs />
        <div className="fixed top-0 left-[100px] w-[calc(100%-100px)] h-full bg-black bg-opacity-50 backdrop-blur-sm opacity-0 invisible transition-opacity duration-300 ease-in-out z-20"></div>
        <ProductSection />
      </div>
    </main>
  );
}

// Search Bar Component
function SearchBar() {
  const handleSearch = (e) => {
    console.log('Search:', e.target.value);
  };

  return (
    <div className="flex justify-center mb-8 relative">
      <input
        type="text"
        className="w-[903px] h-[35px] rounded-full border border-black px-5 py-0 text-base"
        placeholder="Search..."
        onChange={handleSearch}
      />
      <img
        src="icons/Search.png"
        alt="Search"
        className="absolute right-[195px] top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
    </div>
  );
}

// Navigation Tabs Component
function NavigationTabs() {
  return (
    <div className="flex justify-between px-[60px] border-b border-transparent mb-8">
      <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-black px-[27px] select-none">
        PRODUCT
      </div>
      <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-black px-[27px] select-none">
        <img
          src="icons/image 10.png"
          alt="Facebook"
          className="w-[30px] h-[30px] object-cover"
        />
        FACEBOOK
      </div>
      <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-black px-[27px] select-none">
        <img
          src="icons/image 9.png"
          alt="Instagram"
          className="w-[30px] h-[30px] object-cover"
        />
        INSTAGRAM
      </div>
      <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-black px-[27px] select-none">
        <img
          src="icons/image 8.png"
          alt="Shopee"
          className="w-[30px] h-[30px] object-cover"
        />
        SHOPEE
      </div>
      <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-black px-[27px] select-none ml-[63px]">
        OVERALL
      </div>
    </div>
  );
}

// SubHeader Component with Category Tabs - Fixed dropdown issue
function SubHeader() {
  return (
    <div className="top-0 left-[80px] w-full h-[75px] bg-gradient-to-r from-[#470f2a] via-[#9d3d69] to-[#470f2a] shadow-md z-10">
      <div className="flex gap-5 h-full items-center justify-center overflow-visible">
        <CategoryTab name="DRESS" active={true} />
        <CategoryTab name="TOP" />
        <CategoryTab name="BOTTOMS" />
        <CategoryTab name="SKIRTS" />
        <CategoryTab name="ACCESSORIES" />
        <CategoryTab name="OTHERS" />
      </div>
    </div>
  );
}

function CategoryTab({ name, category, active, onClick }) {
  return (
    <div className="relative group">
      <button
        className={`tab-btn bg-transparent border-none text-[#fada5b] text-[23px] w-[150px] cursor-pointer font-['OFL_Sorts_Mill_Goudy_TT'] ${
          active ? 'active text-white' : ''
        }`}
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
}

// Product Section Component
function ProductSection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = () => {
      const savedProducts = JSON.parse(
        localStorage.getItem('products') || '[]'
      );
      setProducts(savedProducts);
    };
    loadProducts();
    window.addEventListener('storage', loadProducts);
    return () => window.removeEventListener('storage', loadProducts);
  }, []);

  return (
    <div className="px-12">
      {products.map((product, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-start gap-6">
            {/* Product Info */}
            <div className="w-[200px]">
              <div className="relative">
                <img
                  src={product.image || 'icons/image (2).png'}
                  alt={product.name}
                  className="w-full h-[180px] object-cover rounded-lg"
                />
                <div className="bg-[#ffea99] p-3 rounded-lg mt-2">
                  <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-[13px]">
                    {product.name}
                  </div>
                  <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-sm text-center text-[#841c4f] italic">
                    {product?.category
                      ? PRODUCT_CATEGORIES.find(
                          (cat) => cat.value === product.category
                        )?.label || product.category
                      : 'Uncategorized'}
                  </div>
                  <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-xl">
                    P {Number(product.price).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Table */}
            <div className="flex-1 bg-[rgba(255,234,242,0.5)] rounded-[15px] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#841c4f] text-white">
                    <th className="py-2 px-4 w-[120px]">STOCKS</th>
                    <th className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src="icons/image 10.png"
                          alt="Facebook"
                          className="w-6 h-6"
                        />
                        FACEBOOK
                      </div>
                    </th>
                    <th className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src="icons/image 9.png"
                          alt="Instagram"
                          className="w-6 h-6"
                        />
                        INSTAGRAM
                      </div>
                    </th>
                    <th className="py-2 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src="icons/image 8.png"
                          alt="Shopee"
                          className="w-6 h-6"
                        />
                        SHOPEE
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  <tr>
                    <td className="py-2 bg-[#841c4f] text-white">S</td>
                    <td className="py-2">{product.sizes?.smallFB || 0}</td>
                    <td className="py-2">{product.sizes?.smallIG || 0}</td>
                    <td className="py-2">{product.sizes?.smallShopee || 0}</td>
                  </tr>
                  <tr>
                    <td className="py-2 bg-[#841c4f] text-white">M</td>
                    <td className="py-2">{product.sizes?.mediumFB || 0}</td>
                    <td className="py-2">{product.sizes?.mediumIG || 0}</td>
                    <td className="py-2">{product.sizes?.mediumShopee || 0}</td>
                  </tr>
                  <tr>
                    <td className="py-2 bg-[#841c4f] text-white">L</td>
                    <td className="py-2">{product.sizes?.largeFB || 0}</td>
                    <td className="py-2">{product.sizes?.largeIG || 0}</td>
                    <td className="py-2">{product.sizes?.largeShopee || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Order Buttons */}
            <div className="flex flex-col gap-2">
              <button className="bg-[#FFE2F0] text-[#841c4f] px-6 py-2 rounded-lg hover:bg-[#841c4f] hover:text-white transition-colors">
                Order
              </button>
              <button className="bg-[#FFE2F0] text-[#841c4f] px-6 py-2 rounded-lg hover:bg-[#841c4f] hover:text-white transition-colors">
                View Orders
              </button>
            </div>
          </div>
        </div>
      ))}
      <FloatingButtons />
    </div>
  );
}

// Product Card Component
function ProductCard() {
  return (
    <div className="w-[250px] relative transition-transform duration-300 ease-in-out hover:scale-110">
      <img
        src="icons/image (2).png"
        alt="Product"
        className="w-[70%] h-[230px] object-fill"
      />
      <div className="absolute bottom-0 h-[77px] w-[71%] bg-[#ffea99] p-5 rounded-[15px] text-center shadow-md">
        <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-[13px]">
          SHAKANEBALOCH
        </div>
        <div className="text-2xl font-['OFL_Sorts_Mill_Goudy_TT']">
          P 300.00
        </div>
      </div>
    </div>
  );
}

// Size Panels Component
function SizePanels() {
  return (
    <div className="flex flex-1 gap-1">
      <div className="flex flex-3 bg-[rgba(209,131,169,0.15)] rounded-[25px] overflow-hidden">
        <SizePanel id="fb" header="S( ) M( ) L( )" />
        <SizePanel id="ig" header="S( ) M( ) L( )" />
        <SizePanel id="sp" header="S( ) M( ) L( )" />
      </div>
      <div
        id="overall"
        className="w-[303px] flex-none rounded-[25px] overflow-hidden bg-[rgba(209,131,169,0.15)]"
      >
        <div className="bg-[#841c4f] h-[55px] text-white flex items-center justify-center font-['OFL_Sorts_Mill_Goudy_TT'] text-xl">
          S( ) M( ) L( )
        </div>
        <div className="ml-[10px] text-center text-[15px] flex font-['OFL_Sorts_Mill_Goudy_TT']">
          <SizeCategory items={['Item 1(Small)', 'Item 2(Small)']} />
          <SizeCategory items={['Item 1(Medium)', 'Item 2(Med)']} />
          <SizeCategory items={['Item 1(Large)', 'Item 2(Large)']} />
        </div>
      </div>
    </div>
  );
}

// Individual Size Panel Component
function SizePanel({ id, header }) {
  return (
    <div
      id={id}
      className="flex-1 text-center border-r border-[rgba(209,131,169,0.3)] last:border-r-0"
    >
      <div className="bg-[#841c4f] h-[55px] text-white flex items-center justify-center font-['OFL_Sorts_Mill_Goudy_TT'] text-xl">
        {header}
      </div>
      <div className="ml-[10px] text-center text-[15px] flex font-['OFL_Sorts_Mill_Goudy_TT']">
        <SizeCategory items={['Item 1', 'Item 2']} />
        <SizeCategory items={['Item 1', 'Item 2']} />
        <SizeCategory items={['Item 1', 'Item 2']} />
      </div>
    </div>
  );
}

// Size Category Component
function SizeCategory({ items }) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div key={index} className="p-[10px] mt-[1px]">
          {item}
        </div>
      ))}
    </div>
  );
}

// Floating Buttons Component
function FloatingButtons() {
  return (
    <div className="fixed right-5 bottom-[50px] flex flex-col gap-4">
      <img
        src="icons/Group 6.png"
        alt="EDIT"
        className="w-[60px] h-[60px] transition-transform duration-300 ease-in-out hover:scale-110"
      />
      <img
        src="icons/image 11.png"
        alt="ADD"
        className="w-[60px] h-[60px] object-cover transition-transform duration-300 ease-in-out hover:scale-110 add-btn"
      />
    </div>
  );
}

// Dialog Overlay Component
function DialogOverlay({ fetchProducts }) {
  return (
    <div className="dialog-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="max-w-[500px] w-full rounded-xl relative bg-gradient-to-b from-[#FFE2F0] to-[#FFC0DB]">
        <button className="close-button absolute top-2 right-2 text-[#841c4f] text-2xl font-bold z-10">
          ×
        </button>
        <AddProductForm fetchProducts={fetchProducts} />
      </div>
    </div>
  );
}

// Add Product Form Component
function AddProductForm({ fetchProducts }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '', // Add category field
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

      // Log the category before sending
      console.log('Category being sent:', formData.category);

      formDataToSend.append('Name', formData.name);
      formDataToSend.append('Category', formData.category);
      formDataToSend.append('Price', formData.price);
      formDataToSend.append('Small', formData.small);
      formDataToSend.append('Medium', formData.medium);
      formDataToSend.append('Large', formData.large);

      if (formData.image) {
        formDataToSend.append('Image', formData.image);
      }

      // Log the complete FormData
      console.log(
        'Form data entries:',
        Object.fromEntries(formDataToSend.entries())
      );

      const response = await fetch('http://localhost:5231/api/product', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const result = await response.json();
      // Log the response from the server
      console.log('Server response:', result);

      await fetchProducts();

      // Reset form
      setFormData({
        name: '',
        category: '',
        price: '',
        image: null,
        small: 0,
        medium: 0,
        large: 0,
      });

      // Close dialog
      const dialog = document.querySelector('.dialog-overlay');
      if (dialog) dialog.style.display = 'none';

      alert('Product added successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-[#841c4f] mb-2">Product Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 rounded border border-gray-300"
          required
        />
      </div>

      {/* Add the category dropdown */}
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
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full p-2 rounded border border-gray-300"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-[#841c4f] mb-2">Upload Image:</label>
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="w-full p-2"
          accept="image/*"
        />
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
            <label className="block text-sm text-center mb-1">Medium</label>
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
  );
}

// Form Group Component
function FormGroup({ label, type, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-['OFL_Sorts_Mill_Goudy_TT'] text-sm text-white">
        {label}
      </label>
      <input
        type={type}
        className={`h-[22px] bg-white border-none px-[6px] py-[2px] w-full text-sm ${
          type === 'file' ? 'p-0 bg-transparent text-white' : ''
        }`}
        {...props}
      />
    </div>
  );
}

// Form Section Component
function FormSection({ title, children }) {
  return (
    <div>
      <h2 className="font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-white mb-2">
        {title}
      </h2>
      <hr className="border-none h-[1px] bg-white my-2" />
      {children}
    </div>
  );
}

// Platform Icon Component
function PlatformIcon({ src, alt }) {
  return (
    <div className="platform">
      <img
        src={src}
        alt={alt}
        className="w-[60px] h-[60px] object-cover transition-transform duration-200 cursor-pointer hover:scale-105"
      />
    </div>
  );
}

// Size Group Component
function SizeGroup({ label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <label className="font-['OFL_Sorts_Mill_Goudy_TT'] text-sm text-white">
        {label}
      </label>
      <div className="w-[120px] h-10 bg-white flex items-center justify-center p-1">
        <input
          type="number"
          min="0"
          className="w-full h-[30px] border border-gray-300 rounded text-center text-sm focus:outline-none focus:border-[#531332]"
          placeholder="Enter quantity"
        />
      </div>
    </div>
  );
}

// Size Panel Popups Component
function SizePanelPopups() {
  return (
    <>
      <SizePopup id="fb-popup" title="Facebook" icon="icons/image 10.png" />
      <SizePopup id="ig-popup" title="Instagram" icon="icons/image 9.png" />
      <SizePopup id="sp-popup" title="Shopee" icon="icons/image 8.png" />
      <SizePopup id="overall-popup" title="Overall" />
    </>
  );
}

// Size Popup Component
function SizePopup({ id, title, icon }) {
  return (
    <div
      id={id}
      className="size-popup-overlay hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 justify-center items-center"
    >
      <div className="bg-white w-[772px] h-[374px] relative rounded-[25px] shadow-md overflow-hidden">
        <div className="bg-[#841c4f] h-[55px] text-white flex items-center justify-center px-5 font-['OFL_Sorts_Mill_Goudy_TT'] text-xl relative">
          {icon && (
            <img
              src={icon}
              className="w-[30px] h-[30px] mr-[10px]"
              alt={title.charAt(0).toLowerCase()}
            />
          )}
          <span>{title}</span>
          <button className="size-popup-close bg-transparent border-none text-white text-3xl cursor-pointer p-[5px] leading-[0.8] absolute right-5 top-1/2 transform -translate-y-1/2 hover:opacity-80">
            &times;
          </button>
        </div>
        <div className="p-5 flex justify-between h-[calc(100%-55px)]">
          {/* Popup content would go here */}
        </div>
      </div>
    </div>
  );
}

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
      // Update total amount when quantity changes
      if (name === 'quantity') {
        newData.totalAmount = product.price * parseInt(value || 0);
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!orderData.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (!orderData.platform) {
      alert('Please select a platform');
      return;
    }

    // Check remaining stock
    const remainingStock =
      product.sizes[
        `remaining${
          orderData.size.charAt(0).toUpperCase() + orderData.size.slice(1)
        }`
      ];

    if (parseInt(orderData.quantity) > remainingStock) {
      alert(
        `Not enough stock available! Only ${remainingStock} ${orderData.size} items remaining.`
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const result = await response.json();
      await onSubmit(result);
      onClose();
    } catch (error) {
      alert(error.message);
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
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="platform"
                value="shopee"
                checked={orderData.platform === 'shopee'}
                onChange={handleInputChange}
                className="w-6 h-6 accent-[#ffb6c1]"
                required
              />
              <img src="icons/image 8.png" alt="Shopee" className="w-8 h-8" />
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
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
        `http://localhost:5231/api/Product/orders/${selectedOrder.id}/updatePayment`,
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

      if (!response.ok) {
        throw new Error('Failed to update payment status');
      }

      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, isPaid: !o.isPaid } : o
        )
      );
      setShowPopup(false);

      // Add success toast
      toast.success(
        `Payment status changed to ${
          !selectedOrder.isPaid ? 'Paid' : 'Pending'
        }`,
        {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        }
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
      // Add error toast
      toast.error('Failed to update payment status', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
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

            {/* Payment Status Popup - Moved outside the orders table container */}
            {showPopup && selectedOrder && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
                <div className="bg-white rounded-lg shadow-xl p-6 w-80 border-2 border-[#841c4f]/20 transform scale-110">
                  <p className="text-center text-[#841c4f] text-lg mb-6 font-semibold">
                    Change status to {selectedOrder.isPaid ? 'Pending' : 'Paid'}
                    ?
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

function AddProductDialog({ onClose, fetchProducts }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '', // Added category field
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
      formDataToSend.append('Category', formData.category); // Added category
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const result = await response.json();
      await fetchProducts();
      onClose();

      // Add success toast
      toast.success('Product added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (error) {
      console.error('Error:', error);
      // Add error toast
      toast.error(error.message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
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

          {/* Added Category Dropdown */}
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
                <label className="block text-sm text-center mb-1">Medium</label>
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

// Helper for stock color
function getStockColorClass(stock) {
  if (stock >= 10) return '';
  if (stock >= 4 && stock <= 5) return 'text-yellow-500 font-bold';
  if (stock >= 0 && stock <= 3) return 'text-red-500 font-bold';
  return '';
}

export default Inventory;
