/* eslint-disable react/prop-types */
function SearchItem({ searchQuery, setSearchQuery }) {
  return (
    <input
      type="text"
      placeholder="Search items..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="p-2 border rounded w-full"
    />
  );
}

export default SearchItem;
