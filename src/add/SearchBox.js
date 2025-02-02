import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { zoomToLocation } from './Zoomin';
import '../css/App.css';
import { FaSpinner } from 'react-icons/fa';

const SearchBox = ({ handleCopyClick, copySuccess, onSearch }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [locationDetails, setLocationDetails] = useState({ placeName: '', city: '', country: '' });
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);

  const map = useMapEvents({
    zoomend: () => {
      if (isCurrentLocation && currentLocation && markerRef.current) {
        markerRef.current.openPopup();
        setIsCurrentLocation(false);
      }
    }
  });
  const markerRef = useRef();

  const stopPropagation = (e) => e.stopPropagation();

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setIsWaiting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coords = [latitude, longitude];
          setCurrentLocation(coords);
          setErrorMsg('');
          setSuccessMsg('');
          setIsActive(true);
          setIsWaiting(false);
          setIsCurrentLocation(true);
          zoomToLocation(map, coords, 15);


          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            setLocationDetails({
              placeName: data.display_name,
              city: data.address.city || data.address.town || data.address.village || '',
              country: data.address.country || '',
            });
          } catch (error) {
            console.error('Error fetching location details:', error);
          }
        },
        () => {
          setErrorMsg('Unable to retrieve your location');
          setIsWaiting(false);
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by your browser');
    }
  };

  const handleImageLoad = () => setImageLoaded(true);

  const handleCopy = () => {
    if (currentLocation) {
      const formattedCoords = `[${currentLocation[0]}, ${currentLocation[1]}]`;
      navigator.clipboard.writeText(formattedCoords);
      handleCopyClick();
    }
  };

  const handleSearch = useCallback(async () => {
    if (searchTerm.trim() === '') return;

    setIsSearching(true);
    const provider = new OpenStreetMapProvider();
    try {
      const results = await provider.search({ query: searchTerm });
      if (results.length > 0) {
        const { x, y } = results[0];
        zoomToLocation(map, [y, x], 15);
        onSearch([y, x]);
        setSuccessMsg('The place was found');
        setErrorMsg('');
      } else {
        setErrorMsg('No results found');
        setSuccessMsg('');
      }
    } catch (error) {
      setErrorMsg('Error fetching geocoding data');
      setSuccessMsg('');
      console.error('Error fetching geocoding data:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, map, onSearch]);

  const handleSearchClick = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const handleInputChange = useCallback((e) => setSearchTerm(e.target.value), []);

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setSuccessMsg('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const resetScale = (element) => requestAnimationFrame(() => element.style.transform = 'scale(1)');

  const handleLocationClickAnimation = (e) => {
    if (e.currentTarget) {
      const targetElement = e.currentTarget;
      targetElement.style.transform = 'scale(0.8)';
      setTimeout(() => resetScale(targetElement), 200);
      handleLocationClick();
    }
  };

  const glowStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    boxShadow: isActive
      ? '0 0 20px rgba(0, 0, 255, 0.7), 0 0 5px rgba(255, 255, 255, 0.5)'
      : '0 0 20px rgba(255, 0, 0, 0.7), 0 0 5px rgba(255, 255, 255, 0.5)',
    transition: 'box-shadow 1.5s ease-in-out',
  };

  const spinnerStyle = {
    animation: 'spin 1s linear infinite',
  };

  return (
    <>
      <div className="search-box" onClick={stopPropagation}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search for a place..."
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          {isSearching ? <FaSpinner className="spinner-search" /> : 'Search'}
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '10px',
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          if (e.currentTarget) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0)';
          }
        }}
        onMouseLeave={(e) => {
          if (e.currentTarget) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        onClick={(e) => {
          stopPropagation(e);
          handleLocationClickAnimation(e);
        }}
        onTouchStart={(e) => {
          stopPropagation(e);
          handleLocationClickAnimation(e);
        }}
        title="Where am I? 📌"
      >
        {isWaiting ? (
          <FaSpinner className="spinner-live" style={spinnerStyle} />
        ) : (
          <img
            src={isActive ? `${process.env.PUBLIC_URL}/img/live_red.png` : `${process.env.PUBLIC_URL}/img/live.png`}
            alt="Live Location"
            style={glowStyle}
          />
        )}
      </div>

      {currentLocation && (
        <Marker
          position={currentLocation}
          icon={L.divIcon({
            html: `<span class="unicode-icon">💎</span>`,
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          })}
          ref={markerRef}
        >
          <Popup>
            <div className="cont">
              <h2>Your Current Location</h2>
              <p>{locationDetails.placeName}</p>
              <p>{locationDetails.city}, {locationDetails.country}</p>
              <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src={`${process.env.PUBLIC_URL}/img/here.jpg`}
                  alt="Your Location"
                  className="place-image"
                  onLoad={handleImageLoad}
                  style={{ display: imageLoaded ? 'block' : 'none' }}
                />
              </a>
              {`Latitude: ${currentLocation[0]}, Longitude: ${currentLocation[1]}`}
              <button
                className={`copy-button ${copySuccess ? 'copied' : ''}`}
                onClick={(e) => {
                  stopPropagation(e);
                  handleCopy();
                }}
              >
                {copySuccess ? 'Copied 😁!' : 'Copy Coords 🏌🏻‍♂️'}
              </button>
            </div>
          </Popup>
        </Marker>
      )}

      {errorMsg && (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
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

      {successMsg && (
        <div
          style={{
            position: 'absolute',
            bottom: '100px',
            right: '10px',
            padding: '8px',
            backgroundColor: 'green',
            color: 'white',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          {successMsg}
        </div>
      )}
    </>
  );
};

export default SearchBox;

