import React, { useEffect, useState } from 'react';

// Main App Component
function Inventory() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainContent />
      <DialogOverlay />
      <SizePanelPopups />
    </div>
  );
}

// Main Content Component
function MainContent() {
  useEffect(() => {
    // Handle category tab activation
    const categoryTabs = document.querySelectorAll('.tab-btn');
    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach(t => t.classList.remove('active', 'text-white'));
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
    sizePanels.forEach(key => {
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
    <main className="ml-0 pt-0"> {/* Added padding-top to account for header + subheader */}
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
        <img src="icons/image 10.png" alt="Facebook" className="w-[30px] h-[30px] object-cover" />
        FACEBOOK
      </div>
      <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-black px-[27px] select-none">
        <img src="icons/image 9.png" alt="Instagram" className="w-[30px] h-[30px] object-cover" />
        INSTAGRAM
      </div>
      <div className="flex items-center gap-[5px] font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-black px-[27px] select-none">
        <img src="icons/image 8.png" alt="Shopee" className="w-[30px] h-[30px] object-cover" />
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
        className={`tab-btn bg-transparent border-none text-[#fada5b] text-[23px] w-[150px] cursor-pointer font-['OFL_Sorts_Mill_Goudy_TT'] ${active ? 'active text-white' : ''}`} 
        data-tab={name.toLowerCase()}
      >
        {name}
      </button>
      <ul className="hidden absolute top-full left-0 bg-white border border-gray-300 z-30 w-full p-0 m-0 list-none group-hover:block shadow-lg">
        <li className="p-[10px] cursor-pointer hover:bg-[#c45d9c] hover:text-white">{name} 1</li>
        <li className="p-[10px] cursor-pointer hover:bg-[#c45d9c] hover:text-white">{name} 2</li>
        <li className="p-[10px] cursor-pointer hover:bg-[#c45d9c] hover:text-white">{name} 3</li>
      </ul>
    </div>
  );
}

// Product Section Component
function ProductSection() {
  return (
    <div className="px-12">
      <div className="flex gap-1 mb-6">
        <ProductCard />
        <SizePanels />
        <FloatingButtons />
      </div>
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
        <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-[13px]">SHAKANEBALOCH</div>
        <div className="text-2xl font-['OFL_Sorts_Mill_Goudy_TT']">P 300.00</div>
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
      <div id="overall" className="w-[303px] flex-none rounded-[25px] overflow-hidden bg-[rgba(209,131,169,0.15)]">
        <div className="bg-[#841c4f] h-[55px] text-white flex items-center justify-center font-['OFL_Sorts_Mill_Goudy_TT'] text-xl">
          S( ) M( ) L( )
        </div>
        <div className="ml-[10px] text-center text-[15px] flex font-['OFL_Sorts_Mill_Goudy_TT']">
          <SizeCategory items={["Item 1(Small)", "Item 2(Small)"]} />
          <SizeCategory items={["Item 1(Medium)", "Item 2(Med)"]} />
          <SizeCategory items={["Item 1(Large)", "Item 2(Large)"]} />
        </div>
      </div>
    </div>
  );
}

// Individual Size Panel Component
function SizePanel({ id, header }) {
  return (
    <div id={id} className="flex-1 text-center border-r border-[rgba(209,131,169,0.3)] last:border-r-0">
      <div className="bg-[#841c4f] h-[55px] text-white flex items-center justify-center font-['OFL_Sorts_Mill_Goudy_TT'] text-xl">
        {header}
      </div>
      <div className="ml-[10px] text-center text-[15px] flex font-['OFL_Sorts_Mill_Goudy_TT']">
        <SizeCategory items={["Item 1", "Item 2"]} />
        <SizeCategory items={["Item 1", "Item 2"]} />
        <SizeCategory items={["Item 1", "Item 2"]} />
      </div>
    </div>
  );
}

// Size Category Component
function SizeCategory({ items }) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div key={index} className="p-[10px] mt-[1px]">{item}</div>
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
function DialogOverlay() {
  return (
    <div className="dialog-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#531332] max-w-[600px] w-4/5 p-4 rounded-xl relative mt-[125px]">
        <button className="close-button absolute top-2 right-2 bg-transparent border-none cursor-pointer text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
        
        <AddProductForm />
      </div>
    </div>
  );
}

// Add Product Form Component
function AddProductForm() {
  return (
    <div className="flex flex-col gap-3 max-w-[500px] mx-auto">
      <FormGroup label="Product Name" type="text" pattern="[A-Za-z ]+" title="Only letters and spaces allowed" />
      <FormGroup label="Product Price:" type="number" min="0" step="0.01" title="Please enter a valid price" />
      <FormGroup label="Upload Image:" type="file" accept="image/*" />
      
      <FormSection title="Platform:">
        <div className="flex justify-center gap-10 py-3">
          <PlatformIcon src="icons/image 10.png" alt="Facebook" />
          <PlatformIcon src="icons/image 9.png" alt="Instagram" />
          <PlatformIcon src="icons/image 8.png" alt="Shopee" />
        </div>
      </FormSection>
      
      <FormSection title="Sizes:">
        <div className="flex justify-center gap-[30px] py-3">
          <SizeGroup label="Small" />
          <SizeGroup label="Medium" />
          <SizeGroup label="Large" />
        </div>
      </FormSection>
      
      <button className="w-[240px] h-10 bg-[#e7c84a] border-none rounded-[18px] text-black text-lg mx-auto mt-4 cursor-pointer font-['OFL_Sorts_Mill_Goudy_TT'] transition-colors duration-200 hover:bg-[#d4b73d]">
        ADD PRODUCT
      </button>
    </div>
  );
}

// Form Group Component
function FormGroup({ label, type, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-['OFL_Sorts_Mill_Goudy_TT'] text-sm text-white">{label}</label>
      <input 
        type={type} 
        className={`h-[22px] bg-white border-none px-[6px] py-[2px] w-full text-sm ${type === 'file' ? 'p-0 bg-transparent text-white' : ''}`}
        {...props} 
      />
    </div>
  );
}

// Form Section Component
function FormSection({ title, children }) {
  return (
    <div>
      <h2 className="font-['OFL_Sorts_Mill_Goudy_TT'] text-xl text-white mb-2">{title}</h2>
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
      <label className="font-['OFL_Sorts_Mill_Goudy_TT'] text-sm text-white">{label}</label>
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
    <div id={id} className="size-popup-overlay hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 justify-center items-center">
      <div className="bg-white w-[772px] h-[374px] relative rounded-[25px] shadow-md overflow-hidden">
        <div className="bg-[#841c4f] h-[55px] text-white flex items-center justify-center px-5 font-['OFL_Sorts_Mill_Goudy_TT'] text-xl relative">
          {icon && <img src={icon} className="w-[30px] h-[30px] mr-[10px]" alt={title.charAt(0).toLowerCase()} />}
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

export default Inventory;