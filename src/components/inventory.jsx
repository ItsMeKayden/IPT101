import React, { useEffect, useState } from 'react';

const PRODUCT_CATEGORIES = [
  { value: 'dress', label: 'Dress' },
  { value: 'top', label: 'Top' },
  { value: 'bottoms', label: 'Bottoms' },
  { value: 'skirts', label: 'Skirts' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'others', label: 'Others' },
];

// Main App Component
function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrdersDialog, setShowOrdersDialog] = useState(false);

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

  const renderProducts = () => (
    <div className="px-12">
      {products.map((product) => (
        <div key={product.id} className="mb-6">
          <div className="flex items-start gap-4">
            {/* Product Image and Info */}
            <div className="w-[120px]">
              <div className="bg-white rounded-lg">
                <img
                  src={
                    `http://localhost:5231${product.imagePath}` ||
                    'icons/image (2).png'
                  }
                  alt={product.name}
                  className="w-full h-[120px] object-cover"
                />
              </div>
              <div className="bg-[#ffea99] p-3 rounded-lg mt-2">
                <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-[13px]">
                  {product.name}
                </div>
                <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-sm text-center text-[#841c4f] italic">
                  {product?.category &&
                  PRODUCT_CATEGORIES.find(
                    (cat) => cat.value === product.category
                  )
                    ? PRODUCT_CATEGORIES.find(
                        (cat) => cat.value === product.category
                      ).label
                    : 'Uncategorized'}
                </div>
                <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-xl">
                  P {Number(product.price).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex flex-1 bg-[#FFE2F0]/30 rounded-xl overflow-hidden">
              {/* Stock Display */}
              <div className="flex">
                {/* Purple section with S M L */}
                <div className="w-20 bg-[#841c4f] text-white">
                  <div className="py-2 text-center font-bold invisible">.</div>
                  <div className="py-2 text-center">S</div>
                  <div className="py-2 text-center">M</div>
                  <div className="py-2 text-center">L</div>
                </div>

                {/* Total Stocks numbers */}
                <div className="w-24 bg-white text-[#841c4f]">
                  <div className="py-2 text-center bg-[#841c4f] text-white">
                    TOTAL
                  </div>
                  <div className="py-2 text-center">
                    {product.sizes?.small || 0}
                  </div>
                  <div className="py-2 text-center">
                    {product.sizes?.medium || 0}
                  </div>
                  <div className="py-2 text-center">
                    {product.sizes?.large || 0}
                  </div>
                </div>

                {/* Remaining Stocks numbers */}
                <div className="w-24 bg-white text-[#841c4f]">
                  <div className="py-2 text-center bg-[#841c4f] text-white">
                    REMAINING
                  </div>
                  <div className="py-2 text-center">
                    {product.sizes?.remainingSmall || 0}
                  </div>
                  <div className="py-2 text-center">
                    {product.sizes?.remainingMedium || 0}
                  </div>
                  <div className="py-2 text-center">
                    {product.sizes?.remainingLarge || 0}
                  </div>
                </div>
              </div>

              {/* Platform columns */}
              <div className="flex-1">
                <div className="grid grid-cols-3">
                  <div className="py-2 bg-[#841c4f] text-white text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="icons/image 10.png"
                        alt="Facebook"
                        className="w-5 h-5"
                      />
                      FACEBOOK
                    </div>
                  </div>
                  <div className="py-2 bg-[#841c4f] text-white text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="icons/image 9.png"
                        alt="Instagram"
                        className="w-5 h-5"
                      />
                      INSTAGRAM
                    </div>
                  </div>
                  <div className="py-2 bg-[#841c4f] text-white text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src="icons/image 8.png"
                        alt="Shopee"
                        className="w-5 h-5"
                      />
                      SHOPEE
                    </div>
                  </div>

                  {/* Facebook Column */}
                  <div>
                    <div className="py-2 text-center">
                      {product.sizes.smallFB}
                    </div>
                    <div className="py-2 text-center">
                      {product.sizes.mediumFB}
                    </div>
                    <div className="py-2 text-center">
                      {product.sizes.largeFB}
                    </div>
                  </div>

                  {/* Instagram Column */}
                  <div>
                    <div className="py-2 text-center">
                      {product.sizes.smallIG}
                    </div>
                    <div className="py-2 text-center">
                      {product.sizes.mediumIG}
                    </div>
                    <div className="py-2 text-center">
                      {product.sizes.largeIG}
                    </div>
                  </div>

                  {/* Shopee Column */}
                  <div>
                    <div className="py-2 text-center">
                      {product.sizes.smallShopee}
                    </div>
                    <div className="py-2 text-center">
                      {product.sizes.mediumShopee}
                    </div>
                    <div className="py-2 text-center">
                      {product.sizes.largeShopee}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleOrder(product)}
                className="bg-[#FFE2F0] text-[#841c4f] px-4 py-1 rounded-lg text-sm hover:bg-[#841c4f] hover:text-white transition-colors"
              >
                Order
              </button>
              <button
                onClick={() => handleViewOrders(product)}
                className="bg-[#FFE2F0] text-[#841c4f] px-4 py-1 rounded-lg text-sm hover:bg-[#841c4f] hover:text-white transition-colors"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainContent />
      <DialogOverlay fetchProducts={fetchProducts} />
      <SizePanelPopups />
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        renderProducts()
      )}
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

function CategoryTab({ name, active = false }) {
  return (
    <div className="relative group">
      <button
        className={`tab-btn bg-transparent border-none text-[#fada5b] text-[23px] w-[150px] cursor-pointer font-['OFL_Sorts_Mill_Goudy_TT'] ${
          active ? 'active text-white' : ''
        }`}
        data-tab={name.toLowerCase()}
      >
        {name}
      </button>
      <ul className="hidden absolute top-full left-0 bg-white border border-gray-300 z-30 w-full p-0 m-0 list-none group-hover:block shadow-lg">
        <li className="p-[10px] cursor-pointer hover:bg-[#c45d9c] hover:text-white">
          {name} 1
        </li>
        <li className="p-[10px] cursor-pointer hover:bg-[#c45d9c] hover:text-white">
          {name} 2
        </li>
        <li className="p-[10px] cursor-pointer hover:bg-[#c45d9c] hover:text-white">
          {name} 3
        </li>
      </ul>
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
      // Create the request body with the exact properties the API expects
      const requestBody = {
        customerName: orderData.customerName,
        quantity: parseInt(orderData.quantity),
        size: orderData.size.toLowerCase(),
        platform: orderData.platform.toLowerCase(),
      };

      console.log('Sending order:', requestBody); // Debug log

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pink-100 rounded-lg p-6 w-96">
        <div className="flex justify-between mb-4">
          <h2 className="text-[#841c4f] text-xl font-bold">Place Order</h2>
          <button onClick={onClose} className="text-[#841c4f]">
            &times;
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
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
              className="w-full p-2 border rounded"
              required
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="flex gap-4 justify-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="platform"
                value="facebook"
                checked={orderData.platform === 'facebook'}
                onChange={handleInputChange}
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
  const [confirmDialog, setConfirmDialog] = useState(null);

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

  const handlePaymentToggle = (order) => {
    setConfirmDialog({
      orderId: order.id,
      currentStatus: order.isPaid,
      customerName: order.customerName,
    });
  };

  const confirmStatusChange = async () => {
    try {
      const response = await fetch(
        `http://localhost:5231/api/Product/orders/${confirmDialog.orderId}/updatePayment`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            isPaid: !confirmDialog.currentStatus,
          }),
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.log('Error response:', errorData);
        throw new Error(
          `Failed to update payment status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('Update successful:', data);

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === confirmDialog.orderId
            ? { ...order, isPaid: !confirmDialog.currentStatus }
            : order
        )
      );

      setConfirmDialog(null);
    } catch (error) {
      console.error('Error details:', error);
      alert(`Failed to update payment status: ${error.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pink-100 rounded-lg p-6 w-[800px]">
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
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FFE2F0] text-[#841c4f]">
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
                  <tr key={order.id} className="border-b border-pink-200">
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
                        className={`px-3 py-1 rounded-full transition-colors ${
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
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-bold text-[#841c4f] mb-4">
              Confirm Status Change
            </h3>
            <p className="mb-6">
              Are you sure you want to mark the order for{' '}
              <span className="font-semibold">
                {confirmDialog.customerName}
              </span>{' '}
              as {confirmDialog.currentStatus ? 'pending' : 'paid'}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="px-4 py-2 bg-[#841c4f] text-white rounded hover:bg-[#6a183f]"
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

export default Inventory;
