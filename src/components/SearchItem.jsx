// src/components/SearchBar.js
import { useState } from 'react';

function SearchItem() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    setQuery(e.target.value);
    // Add search functionality
  };

  return (
    <div className="w-full p-2">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        className="w-full p-3 border rounded-lg"
        placeholder="Search for items..."
      />
    </div>
  );
}

export default SearchItem;
