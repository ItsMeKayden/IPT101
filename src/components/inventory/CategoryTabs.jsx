import CategoryTab from './CategoryTab';
import { PRODUCT_CATEGORIES } from './constants';

function CategoryTabs({ activeCategory, onCategoryChange }) {
  return (
    <div className="top-0 left-[80px] w-full h-[65px] bg-[#65366F] shadow-md z-10">
      <div className="flex gap-5 h-full items-center justify-center overflow-visible">
        <CategoryTab
          name="ALL"
          category="all"
          active={activeCategory === 'all'}
          onClick={() => onCategoryChange('all')}
        />
        {PRODUCT_CATEGORIES.map((cat) => (
          <CategoryTab
            key={cat.value}
            name={cat.label.toUpperCase()}
            category={cat.value}
            active={activeCategory === cat.value}
            onClick={() => onCategoryChange(cat.value)}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryTabs;
