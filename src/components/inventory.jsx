import React, { useEffect, useState } from 'react';

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

  const handleViewOrders = (product) => {
    setSelectedProduct(product);
    setShowOrdersDialog(true);
  };

  const updateProductStock = async (productId, orderData) => {
    try {
      const response = await fetch(
        `http://localhost:5231/api/product/${productId}/updateStock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName: orderData.customerName,
            size: orderData.size,
            quantity: parseInt(orderData.quantity),
            platform: orderData.platform,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update stock');
      }

      await fetchProducts(); // Refresh products list
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error updating stock:', error);
      alert(error.message || 'Failed to update stock');
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
              <div className="bg-[#ffea99] p-2 rounded-lg mt-2">
                <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-[12px] uppercase">
                  {product.name}
                </div>
                <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-lg">
                  P {Number(product.price).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex flex-1 bg-[#FFE2F0]/30 rounded-xl overflow-hidden">
              {/* Stock Display */}
              <div className="flex">
                {/* Purple section with S M L */}
                <div className="w-20 bg-[#841c4f] text-white">
                  <div className="py-2 text-center font-bold">STOCKS</div>
                  <div className="py-2 text-center">S</div>
                  <div className="py-2 text-center">M</div>
                  <div className="py-2 text-center">L</div>
                </div>

                {/* Stock numbers */}
                <div className="w-16 bg-white text-[#841c4f]">
                  <div className="py-2 text-center invisible">.</div>
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
    price: '',
    image: null,
    sizes: {
      small: 0,
      medium: 0,
      large: 0,
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSizeChange = (size, value) => {
    setFormData((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [size]: parseInt(value) || 0,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('price', formData.price);

    // Append original stock quantities
    formDataToSend.append('small', formData.sizes.small);
    formDataToSend.append('medium', formData.sizes.medium);
    formDataToSend.append('large', formData.sizes.large);

    // Initialize platform stocks to 0
    formDataToSend.append('smallFB', 0);
    formDataToSend.append('mediumFB', 0);
    formDataToSend.append('largeFB', 0);
    formDataToSend.append('smallIG', 0);
    formDataToSend.append('mediumIG', 0);
    formDataToSend.append('largeIG', 0);
    formDataToSend.append('smallShopee', 0);
    formDataToSend.append('mediumShopee', 0);
    formDataToSend.append('largeShopee', 0);

    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:5231/api/product', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product');
      }

      const result = await response.json();
      console.log('Product added:', result);

      // Reset form
      setFormData({
        name: '',
        price: '',
        image: null,
        sizes: {
          small: 0,
          medium: 0,
          large: 0,
        },
      });

      await fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Connection error:', error);
      alert(error.message || 'Failed to add product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div>
        <label className="block text-[#841c4f] mb-2">Product Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 rounded border border-[#841c4f] bg-white/70"
          required
        />
      </div>

      <div>
        <label className="block text-[#841c4f] mb-2">Product Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full p-2 rounded border border-[#841c4f] bg-white/70"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-[#841c4f] mb-2">Upload Image:</label>
        <input
          type="file"
          name="image"
          onChange={handleInputChange}
          className="w-full p-2"
          accept="image/*"
        />
      </div>

      {/* Size inputs */}
      <div className="bg-white/50 p-4 rounded-lg">
        <label className="block text-[#841c4f] mb-2 font-bold">
          Stock Quantities:
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['small', 'medium', 'large'].map((size) => (
            <div key={size}>
              <label className="block text-[#841c4f] text-sm mb-1">
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </label>
              <input
                type="number"
                value={formData.sizes[size]}
                onChange={(e) => handleSizeChange(size, e.target.value)}
                className="w-full p-2 rounded border border-[#841c4f] bg-white/70 text-center"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#ffea99] text-[#841c4f] py-3 px-4 rounded font-semibold hover:bg-[#f0dc8e] transition-colors"
      >
        Add Product
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
    quantity: 0,
    size: 'small',
    platform: 'facebook',
    totalAmount: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'quantity') {
        newData.totalAmount = parseFloat(product.price) * parseInt(value || 0);
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (orderData.quantity > product.sizes[orderData.size]) {
      alert('Not enough stock available!');
      return;
    }

    await onSubmit(product.id, orderData);
    onClose();
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

  useEffect(() => {
    fetchOrders();
  }, []);

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-pink-100 rounded-lg p-6 w-[600px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-[#841c4f] text-xl font-bold">Order History</h2>
          <button onClick={onClose} className="text-[#841c4f]">
            &times;
          </button>
        </div>

        {loading ? (
          <div className="text-center">Loading orders...</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-[#841c4f] text-white">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Platform</th>
                  <th className="p-2">Size</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-2">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="p-2">{order.customerName}</td>
                    <td className="p-2">{order.platform}</td>
                    <td className="p-2">{order.size}</td>
                    <td className="p-2">{order.quantity}</td>
                    <td className="p-2">₱{order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
