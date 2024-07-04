import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Unicode characters for visited and planned places
const unicodeVisited = '✅'; // Unicode character for visited places
const unicodePlanned = '📍'; // Unicode character for planned places

const createCustomIcon = (unicodeChar) => {
  return L.divIcon({
    html: `<span class="unicode-icon">${unicodeChar}</span>`,
    className: 'custom-div-icon',
    iconSize: [30, 30], // Adjust icon size as needed
    iconAnchor: [15, 15], // Adjust anchor point as needed
  });
};

const Map = ({ visitedPlaces, plannedPlaces }) => {
  const places = { visited: visitedPlaces, planned: plannedPlaces };

  // Default center and zoom level
  const defaultCenter = [41.505, -10.09]; // Original center
  const defaultZoom = 3;

  // Adjust the longitude to shift the map slightly to the right
  const adjustedCenter = [defaultCenter[0], defaultCenter[1] + 50.05]; // Adjust longitude

  return (
    <div className="map-container"> {/* Apply CSS class for styling */}
      <MapContainer center={adjustedCenter} zoom={defaultZoom} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
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
                  <span className="unicode-icon">
                    {type === 'visited' ? unicodeVisited : unicodePlanned}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
