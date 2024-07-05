import React, { useState } from 'react';

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      onSearch([parseFloat(lat), parseFloat(lon)]);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-box">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBox;
