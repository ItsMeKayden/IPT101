function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="flex justify-center mb-8 relative">
      <input
        type="text"
        className="w-[903px] h-[40px] rounded-full border border-[#65366F] px-5 py-0 text-base bg-white text-gray-900"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <img
        src="icons/Search.png"
        alt="Search"
        className="absolute right-[195px] top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
    </div>
  );
}

export default SearchBar;
