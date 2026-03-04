function FloatingButtons({ onEditToggle, onAddProduct, onViewAllOrders, showEditMode }) {
  return (
    <div className="fixed right-5 bottom-[50px] flex flex-col gap-4">
      {/* Edit Button */}
      <div className="relative group">
        <img
          src="icons/Group 6.png"
          alt="EDIT"
          className={`w-[60px] h-[60px] transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer ${
            showEditMode ? 'ring-4 ring-yellow-400 rounded-full' : ''
          }`}
          onClick={onEditToggle}
        />
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-[#841c4f] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Edit Products
          <div className="absolute top-full right-2 w-2 h-2 bg-[#841c4f] transform rotate-45"></div>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="relative group">
        <img
          src="icons/addproduct.png"
          alt="ADD"
          className="w-[60px] h-[60px] object-cover transition-transform duration-300 ease-in-out hover:scale-110 add-btn brightness-75 cursor-pointer"
          onClick={onAddProduct}
        />
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-[#841c4f] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Add New Product
          <div className="absolute top-full right-2 w-2 h-2 bg-[#841c4f] transform rotate-45"></div>
        </div>
      </div>

      {/* View All Orders Button */}
      <div className="relative group">
        <button
          onClick={onViewAllOrders}
          className="w-[60px] h-[60px] bg-gradient-to-br from-[#c99ab5] to-[#d9a5be] rounded-full flex items-center justify-center transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer shadow-lg"
        >
          <span className="text-white font-bold text-2xl">📋</span>
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-[#841c4f] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          View All Orders
          <div className="absolute top-full right-2 w-2 h-2 bg-[#841c4f] transform rotate-45"></div>
        </div>
      </div>
    </div>
  );
}

export default FloatingButtons;
