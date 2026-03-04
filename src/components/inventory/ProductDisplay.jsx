import { PRODUCT_CATEGORIES } from './constants';
import { getStockColorClass } from './helpers';

function ProductDisplay({
  products,
  showEditMode,
  onProductSelect,
  onOrder,
  onViewOrders,
}) {
  return (
    <div className="px-12 pl-[62px]">
      {products.map((product) => (
        <div
          key={product.id}
          className={`mb-8 flex items-start gap-6 ${
            showEditMode
              ? 'cursor-pointer hover:bg-yellow-50 p-2 rounded-lg'
              : ''
          }`}
          onClick={(e) => {
            if (showEditMode) {
              onProductSelect(product);
            }
          }}
        >
          {/* Product Image and Info */}
          <div className="flex flex-col items-center gap-2 min-w-[200px]">
            {/* Product Image */}
            <div
              className="w-[170px] h-[220px] flex items-center justify-center overflow-visible relative rounded-xl border border-[#65366F]/30 shadow-lg bg-white group"
            >
              <img
                src={
                  product.imagePath
                    ? `http://localhost:5231${product.imagePath}`
                    : '/icons/image (2).png'
                }
                alt={product.name}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/icons/image (2).png';
                }}
              />
            </div>
            
            {/* Product Info Card - More Flexible */}
            <div className="w-[170px] bg-[#ffea99] rounded-xl shadow-lg border border-yellow-200 p-3 flex flex-col gap-2">
              {/* Product Name - Wrapped Text */}
              <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-[13px] uppercase text-center text-[#841c4f] font-semibold leading-tight line-clamp-3 break-words">
                {product.name}
              </div>
              
              {/* Category */}
              <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-xs text-center text-[#841c4f] italic opacity-80 line-clamp-2">
                {product?.category &&
                PRODUCT_CATEGORIES.find((cat) => cat.value === product.category)
                  ? PRODUCT_CATEGORIES.find(
                      (cat) => cat.value === product.category
                    ).label
                  : 'Uncategorized'}
              </div>
              
              {/* Divider */}
              <div className="h-px bg-[#d4a574] opacity-50"></div>
              
              {/* Price */}
              <div className="font-['OFL_Sorts_Mill_Goudy_TT'] text-lg font-bold text-center text-[#841c4f]">
                ₱ {Number(product.price).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Stock Table */}
          <div className="flex-1 bg-[#f9eef5] rounded-xl flex items-stretch shadow-[0_4px_8px_rgba(101,54,111,0.2)] overflow-hidden group hover:shadow-[0_6px_12px_rgba(101,54,111,0.3)] transition-all duration-300 min-h-[230px]">
            {/* S/M/L Panel */}
            <div className="flex flex-col items-center justify-start bg-[#65366F] text-white px-3 py-3 rounded-l-xl w-[50px] gap-4 group-hover:bg-[#4f2956] transition-colors duration-300">
              <div className="text-xs font-bold h-[40px] flex items-center">SIZES</div>
              <div className="font-bold text-lg group-hover:scale-105 transition-transform duration-300">
                S
              </div>
              <div className="font-bold text-lg group-hover:scale-105 transition-transform duration-300">
                M
              </div>
              <div className="font-bold text-lg group-hover:scale-105 transition-transform duration-300">
                L
              </div>
            </div>
            
            {/* Table Columns */}
            <div className="flex-1 grid grid-cols-4 divide-x divide-[#e5d0e5]">
              {/* Total */}
              <div className="flex flex-col items-center py-3 px-2 gap-3 hover:bg-[#f5e5f0] transition-colors duration-300">
                <div className="font-bold text-[11px] text-[#841c4f] uppercase whitespace-nowrap">Total</div>
                <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    {product.sizes?.small || 0}
                  </div>
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    {product.sizes?.medium || 0}
                  </div>
                  <div className="group-hover:scale-105 transition-transform duration-300">
                    {product.sizes?.large || 0}
                  </div>
                </div>
              </div>
              
              {/* Remaining */}
              <div className="flex flex-col items-center py-3 px-2 gap-3 hover:bg-[#f5e5f0] transition-colors duration-300">
                <div className="font-bold text-[11px] text-[#841c4f] uppercase whitespace-nowrap">Remaining</div>
                <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                  <div
                    className={`${getStockColorClass(
                      product.sizes?.remainingSmall || 0
                    )} group-hover:scale-105 transition-transform duration-300`}
                  >
                    {product.sizes?.remainingSmall || 0}
                  </div>
                  <div
                    className={`${getStockColorClass(
                      product.sizes?.remainingMedium || 0
                    )} group-hover:scale-105 transition-transform duration-300`}
                  >
                    {product.sizes?.remainingMedium || 0}
                  </div>
                  <div
                    className={`${getStockColorClass(
                      product.sizes?.remainingLarge || 0
                    )} group-hover:scale-105 transition-transform duration-300`}
                  >
                    {product.sizes?.remainingLarge || 0}
                  </div>
                </div>
              </div>
              
              {/* Facebook */}
              <div className="flex flex-col items-center py-3 px-1 gap-3 hover:bg-[#f5e5f0] transition-colors duration-300">
                <div className="font-bold text-[10px] flex flex-col items-center gap-1">
                  <img
                    src="icons/image 10.png"
                    alt="Facebook"
                    className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="uppercase whitespace-nowrap">FB</span>
                </div>
                <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                  <div className="text-sm group-hover:scale-105 transition-transform duration-300">
                    {product.sizes.smallFB}
                  </div>
                  <div className="text-sm group-hover:scale-105 transition-transform duration-300">
                    {product.sizes.mediumFB}
                  </div>
                  <div className="text-sm group-hover:scale-105 transition-transform duration-300">
                    {product.sizes.largeFB}
                  </div>
                </div>
              </div>
              
              {/* Instagram */}
              <div className="flex flex-col items-center py-3 px-1 gap-3 hover:bg-[#f5e5f0] transition-colors duration-300">
                <div className="font-bold text-[10px] flex flex-col items-center gap-1">
                  <img
                    src="icons/image 9.png"
                    alt="Instagram"
                    className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="uppercase whitespace-nowrap">IG</span>
                </div>
                <div className="flex flex-col items-center gap-3 flex-1 justify-center">
                  <div className="text-sm group-hover:scale-105 transition-transform duration-300">
                    {product.sizes.smallIG}
                  </div>
                  <div className="text-sm group-hover:scale-105 transition-transform duration-300">
                    {product.sizes.mediumIG}
                  </div>
                  <div className="text-sm group-hover:scale-105 transition-transform duration-300">
                    {product.sizes.largeIG}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 items-stretch justify-start py-3 min-w-[120px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOrder(product);
              }}
              className="bg-[#FFE2F0] text-[#841c4f] px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#c599ae] hover:text-white transition-colors hover:shadow-md"
            >
              Order
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewOrders(product);
              }}
              className="bg-[#FFE2F0] text-[#841c4f] px-4 py-3 rounded-lg text-sm font-semibold hover:bg-[#c599ae] hover:text-white transition-colors hover:shadow-md"
            >
              View Orders
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductDisplay;
