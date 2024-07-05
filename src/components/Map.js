import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'leaflet/dist/leaflet.css';
import MapEvents from './MapEvents';
import SearchBox from './SearchBox';
import { getCountryFlag } from './countryFlags';
import { zoomToLocation } from './zoomin';

const unicodeVisited = '🚩';
const unicodePlanned = '✈️';
const unicodeSearched = '🔍';

const createCustomIcon = (unicodeChar) => {
  return L.divIcon({
    html: `<span class="unicode-icon">${unicodeChar}</span>`,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const Map = ({ visitedPlaces, plannedPlaces }) => {
  const [clickedCoords, setClickedCoords] = useState(null);
  const [searchCoords, setSearchCoords] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [placeInfo, setPlaceInfo] = useState(null);
  const places = { visited: visitedPlaces, planned: plannedPlaces };
  const mapRef = useRef(null);

  const defaultCenter = [41.505, -10.09];
  const defaultZoom = 3;
  const adjustedCenter = [defaultCenter[0], defaultCenter[1] + 50.05];

  const handleMapClick = async (coords) => {
    setClickedCoords(coords);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords[0]}&lon=${coords[1]}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      const { city, town, village, country_code, country, state, county, suburb, neighbourhood } = data.address;
      const placeName = city || town || village || suburb || neighbourhood || 'Unknown Place';
      const areaName = suburb || neighbourhood || state || county || '';
      const countryCode = country_code.toUpperCase();
      const countryFlag = getCountryFlag(countryCode);
      const fullPlaceName = areaName ? `${placeName} (${areaName}), ${country}` : `${placeName}, ${country}`;

      setPlaceInfo({
        name: fullPlaceName,
        flag: countryFlag,
      });
    }
  };

  const handleCopyClick = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  };

  const copyText = `coords: [${clickedCoords ? clickedCoords[0] : ''}, ${clickedCoords ? clickedCoords[1] : ''}]`;

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.on('click', (e) => {
        handleMapClick([e.latlng.lat, e.latlng.lng]);
      });
    }
  }, []);

  useEffect(() => {
    console.log('searchCoords changed', searchCoords);
    if (searchCoords) {
      console.log('Map reference:', mapRef.current);
      zoomToLocation(mapRef.current, searchCoords);
    }
  }, [searchCoords]);

  return (
    <div className="map-container">
      <MapContainer center={adjustedCenter} zoom={defaultZoom} className="leaflet-map" whenCreated={mapInstance => mapRef.current = mapInstance}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution=''
        />
        <SearchBox map={mapRef.current} onSearch={setSearchCoords} />
        <MapEvents onClick={handleMapClick} />
        {['visited', 'planned'].map((type) =>
          places[type].map((place, index) => (
            <Marker
              key={index}
              position={place.coords}
              icon={createCustomIcon(type === 'visited' ? unicodeVisited : unicodePlanned)}
            >
              <Popup>
                <div>
                  <strong>{place.name}</strong>
                  <br />
                  {place.imageLink && (
                    <a href={place.imageLink} target="_blank" rel="noopener noreferrer">
                      <img src={place.imageLink} alt={place.name} className="place-image" />
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))
        )}
        {clickedCoords && placeInfo && (
          <Marker position={clickedCoords} icon={createCustomIcon('📍')}>
            <Popup>
              <div>
                <strong>Clicked Location</strong>
                <br />
                {`Place: ${placeInfo.name}`}
                <br />
                {placeInfo.flag && <span>{placeInfo.flag}</span>}
                <br />
                {`Latitude: ${clickedCoords[0]}, Longitude: ${clickedCoords[1]}`}
                <br />
                <CopyToClipboard text={copyText}>
                  <button className={`copy-button ${copySuccess ? 'copied' : ''}`} onClick={handleCopyClick}>
                    {copySuccess ? 'Copied!' : 'Copy Coords'}
                  </button>
                </CopyToClipboard>
              </div>
            </Popup>
          </Marker>
        )}
        {searchCoords && (
          <Marker position={searchCoords} icon={createCustomIcon(unicodeSearched)}>
            <Popup>
              <div>
                <strong>Searched Location</strong>
                <br />
                {`Latitude: ${searchCoords[0]}, Longitude: ${searchCoords[1]}`}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
