import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SearchBox from './SearchBox';
import MapEvents from './MapEvents';
import useHandleClick from './HandleClick';
import CreatePopup from './CreatePopup';
import { zoomToLocation } from './Zoomin';
import { useMediaQuery } from '@mui/material';
import { getCountryFlag } from './CountryFlags';

const Map = ({ visitedPlaces, plannedPlaces }) => {
  const [searchCoords, setSearchCoords] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const mapRef = useRef(null);
  const { handleMapClick } = useHandleClick();

  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultCenter = isMobile ? [41.505, -0.09] : [41.505, -0.09];
  const defaultZoom = isMobile ? 2.5 : 3.3;
  const adjustedCenter = [defaultCenter[0], defaultCenter[1] + (isMobile ? 32 : 65.05)];

  const [locationDetails, setLocationDetails] = useState({ placeName: '', city: '', country: '', countryCode: '' }); // Reintroduce setLocationDetails

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
    navigator.clipboard.writeText(`[${coords[0]}, ${coords[1]}]`);
    handleCopyClick();
  };

  useEffect(() => {
    if (searchCoords) {
      zoomToLocation(mapRef.current, searchCoords);

      fetchLocationDetails(searchCoords).then(details => {
        setLocationDetails(details);
      });
    }
  }, [searchCoords]);

  const fetchLocationDetails = async (coords) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`);
    const data = await response.json();
    return {
      placeName: data.display_name,
      city: data.address.city || data.address.town || data.address.village || '',
      country: data.address.country,
      countryCode: data.address.country_code.toUpperCase()
    };
  };

  const places = [
    ...visitedPlaces.map((place) => ({ ...place, type: 'visited' })),
    ...plannedPlaces.map((place) => ({ ...place, type: 'planned' })),
  ];

  const handlePlaceClick = (coords) => {
    zoomToLocation(mapRef.current, coords);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={adjustedCenter}
        zoom={defaultZoom}
        className="leaflet-map"
        zoomSnap={0.5}
        zoomDelta={0.5}
        zoomControl={false}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=iQtt3mhP0bDaBKFSImNM"
          attribution="&copy; <a href='https://www.maptiler.com/'>MapTiler</a>"
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
              html: `<span class="unicode-icon">📍</span>`,
              className: 'custom-div-icon',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>
              <div className="cont">
                <h2>Searched Location</h2>
                <br />
                <p>{locationDetails.placeName}</p>
                <p>{locationDetails.city}, {locationDetails.country} {getCountryFlag(locationDetails.countryCode)}</p>
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
      </MapContainer>
    </div>
  );
};

export default Map;
