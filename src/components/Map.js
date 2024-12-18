import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBox from './SearchBox';
import MapEvents from './MapEvents';
import useHandleClick from './handleClick';
import CreatePopup from './createPopup';
import { zoomToLocation } from './zoomin';
import { useMediaQuery } from '@mui/material';
import { FaSun, FaMoon } from 'react-icons/fa';

const Map = ({ visitedPlaces, plannedPlaces }) => {
  const [searchCoords, setSearchCoords] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [theme, setTheme] = useState('light'); // State for theme
  const mapRef = useRef(null);
  const { clickedCoords, handleMapClick, placeInfo } = useHandleClick();

  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultCenter = isMobile ? [41.505, -0.09] : [41.505, -0.09];
  const defaultZoom = isMobile ? 2.5 : 3.3;
  const adjustedCenter = [defaultCenter[0], defaultCenter[1] + (isMobile ? 32 : 65.05)];

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.on('click', (e) => {
        handleMapClick([e.latlng.lat, e.latlng.lng], mapRef);
      });
    }

    return () => {
      if (map) {
        map.off('click');
      }
    };
  }, [handleMapClick]);

  const handleCopyClick = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const copyCoordsToClipboard = (coords) => {
    navigator.clipboard.writeText(`coords: [${coords[0]}, ${coords[1]}]`);
    handleCopyClick();
  };

  useEffect(() => {
    if (searchCoords) {
      zoomToLocation(mapRef.current, searchCoords);
    }
  }, [searchCoords]);

  const places = [
    ...visitedPlaces.map((place) => ({ ...place, type: 'visited' })),
    ...plannedPlaces.map((place) => ({ ...place, type: 'planned' })),
    clickedCoords && placeInfo
      ? {
        coords: clickedCoords,
        type: 'clicked',
        name: placeInfo.name,
        flag: placeInfo.flag,
      }
      : null,
  ].filter(Boolean);

  const handlePlaceClick = (coords) => {
    zoomToLocation(mapRef.current, coords);
  };

  // Function to toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="map-container">
      <MapContainer
        center={adjustedCenter}
        zoom={defaultZoom}
        className={`leaflet-map ${theme}`} // Dynamically apply theme class
        zoomSnap={0.5}
        zoomDelta={0.5}
        zoomControl={false}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        {/* Conditional TileLayer with `key` prop */}
        <TileLayer
          key={theme} // React will force the TileLayer to re-render when theme changes
          url={theme === 'light' ? "https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=iQtt3mhP0bDaBKFSImNM" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"}
          attribution={theme === 'light' ? "&copy; <a href='https://www.maptiler.com/'>MapTiler</a>" : "&copy; <a href='https://www.carto.com/'>CARTO</a>"}
          subdomains="abcd"
        />

        <SearchBox
          map={mapRef.current}
          onSearch={setSearchCoords}
          handleCopyClick={handleCopyClick}
          copySuccess={copySuccess}
        />

        <MapEvents onClick={handleMapClick} />
        {places.map((place) => (
          <CreatePopup
            key={`${place.type}-${place.coords.join(',')}`}
            place={place}
            mapRef={mapRef}
            handleCopyClick={handleCopyClick}
            copySuccess={copySuccess}
            onPlaceClick={handlePlaceClick}
          />
        ))}

        {searchCoords && (
          <Marker
            position={searchCoords}
            icon={L.divIcon({
              html: `<span class="unicode-icon">🔍</span>`,
              className: 'custom-div-icon',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>
              <div className="cont">
                <h2>Searched Location</h2>
                <br />
                {`Latitude: ${searchCoords[0]}, Longitude: ${searchCoords[1]}`}
                <br />
                <button
                  className={`copy-button ${copySuccess ? 'copied' : ''}`}
                  onClick={() => copyCoordsToClipboard(searchCoords)}
                >
                  {copySuccess ? 'Copied 😁!' : 'Copy Coords 🏌🏻‍♂️'}
                </button>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Theme Toggle Button */}
        <div className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <FaSun size={30} color="yellow" /> : <FaMoon size={30} color="lightgray" />}
        </div>
      </MapContainer>
    </div>
  );
};

export default Map;
