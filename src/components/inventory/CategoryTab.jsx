function CategoryTab({ name, category, active, onClick }) {
  return (
    <div className="relative group">
      <button
        className={`tab-btn bg-transparent border-none text-[#fada5b] text-[23px] w-[130px] cursor-pointer font-['OFL_Sorts_Mill_Goudy_TT'] ${
          active ? 'active text-white' : ''
        }`}
        onClick={onClick}
      >
        {name}
      </button>
    </div>
  );
}

export default CategoryTab;
