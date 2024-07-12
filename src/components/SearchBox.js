import React, { useState, useCallback } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMapEvents } from 'react-leaflet';
import { zoomToLocation } from './zoomin'; // Import your zoomToLocation function
import '../styles/App.css'; // Adjust the path to your App.css file

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const map = useMapEvents({
    click: () => {
      setSearchTerm('');
    }
  });

  const handleSearch = useCallback(async () => {
    if (searchTerm.trim() === '') return;

    const provider = new OpenStreetMapProvider();
    try {
      const results = await provider.search({ query: searchTerm });
      console.log('Search results:', results);
      if (results.length > 0) {
        const { x, y } = results[0];
        console.log('Coordinates:', x, y);

        // Call your zoomToLocation function here
        zoomToLocation(map, [y, x], 15); // Adjust zoom level as needed
        onSearch([y, x]); // Pass the search coordinates to the parent component (Map)
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
    }
  }, [searchTerm, map, onSearch]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="search-box">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="Search for a location..."
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBox;
