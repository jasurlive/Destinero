import React, { useState, useCallback, useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { zoomToLocation } from './zoomin'; // Import your zoomToLocation function
import '../styles/App.css'; // Adjust the path to your App.css file

const SearchBox = ({ handleCopyClick, copySuccess, onSearch }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false); // Track if location is active
  const [searchTerm, setSearchTerm] = useState('');

  const map = useMapEvents({
    click: () => {
      setSearchTerm('');
    }
  });

  // Handle fetching live location
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setCurrentLocation(coords);
          setErrorMsg('');
          setIsActive(true); // Change image to active (red) when location is found

          // Trigger zoomToLocation for current location
          zoomToLocation(map, coords, 15); // Zoom to user's current location with desired zoom level
        },
        () => {
          setErrorMsg('Unable to retrieve your location');
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by your browser');
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCopy = () => {
    if (currentLocation) {
      const formattedCoords = `coords: [${currentLocation[0]}, ${currentLocation[1]}]`;
      navigator.clipboard.writeText(formattedCoords);
      handleCopyClick(); // Trigger state change or feedback for copy success
    }
  };

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

  // Effect to clear error message after 2 seconds
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
      }, 2000); // 2 seconds timeout

      return () => clearTimeout(timer); // Cleanup the timer on unmount or if errorMsg changes
    }
  }, [errorMsg]);

  // Function to handle scale reset after click or touch
  const resetScale = (element) => {
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)'; // Reset to default scale
    });
  };

  const handleLocationClickAnimation = (e) => {
    // Safely check if currentTarget exists before modifying the style
    if (e.currentTarget) {
      const targetElement = e.currentTarget;

      targetElement.style.transform = 'scale(0.8)'; // Shrink on click to simulate press
      setTimeout(() => {
        resetScale(targetElement); // Return to normal size after a short delay
      }, 200); // 200ms for the press effect

      // Trigger the location click function
      handleLocationClick(); // Call your function to get the location
    }
  };

  // Define inline styles for the glow effect
  const glowStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    boxShadow: isActive
      ? '0 0 20px rgba(0, 0, 255, 0.7), 0 0 5px rgba(255, 255, 255, 0.5)' // Blue glow when active
      : '0 0 20px rgba(255, 0, 0, 0.7), 0 0 5px rgba(255, 255, 255, 0.5)', // Red glow when not active
    transition: 'box-shadow 1.5s ease-in-out',
  };

  return (
    <>
      {/* Search Box */}
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

      {/* Image button for getting live location */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '10px',
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover transition
        }}
        onMouseEnter={(e) => {
          if (e.currentTarget) {  // Ensure currentTarget exists
            e.currentTarget.style.transform = 'scale(1.1)'; // Scale up slightly on hover
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0)'; // Add shadow on hover
          }
        }}
        onMouseLeave={(e) => {
          if (e.currentTarget) {  // Ensure currentTarget exists
            e.currentTarget.style.transform = 'scale(1)'; // Reset size on hover out
            e.currentTarget.style.boxShadow = 'none'; // Remove shadow on hover out
          }
        }}
        onClick={handleLocationClickAnimation} // Handle the click animation and geolocation
        onTouchStart={handleLocationClickAnimation} // Support touch devices
        title="Where am I? 📌"
      >
        <img
          src={isActive ? `${process.env.PUBLIC_URL}/img/live_red.png` : `${process.env.PUBLIC_URL}/img/live.png`}
          alt="Live Location"
          style={glowStyle}
        />
      </div>

      {/* Marker and Popup for live location */}
      {currentLocation && (
        <Marker
          position={currentLocation}
          icon={L.divIcon({
            html: `<span class="unicode-icon">💎</span>`,
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          })}
        >
          <Popup>
            <div className="cont">
              <h2>Your Current Location</h2>
              <br />
              <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer"> {/* Static link */}
                <img
                  src={`${process.env.PUBLIC_URL}/img/here.jpg`} // Replace with your image link for the popup
                  alt="Your Location"
                  className="place-image"
                  onLoad={handleImageLoad}
                  style={{ display: imageLoaded ? 'block' : 'none' }}
                />
              </a>
              <br />
              {`Latitude: ${currentLocation[0]}, Longitude: ${currentLocation[1]}`}
              <br />
              <button
                className={`copy-button ${copySuccess ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copySuccess ? 'Copied 😁!' : 'Copy Coords 🏌🏻‍♂️'}
              </button>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Error message if geolocation fails */}
      {errorMsg && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            right: '10px',
            padding: '8px',
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          {errorMsg}
        </div>
      )}
    </>
  );
};

export default SearchBox;
