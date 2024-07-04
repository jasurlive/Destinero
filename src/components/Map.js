import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ visitedPlaces, plannedPlaces }) => {
  const places = { visited: visitedPlaces, planned: plannedPlaces };
  const defaultCenter = [51.505, -0.09]; // Example default center
  const defaultZoom = 3; // Example default zoom level

  return (
    <div className="map-container"> {/* Apply CSS class for styling */}
      <MapContainer center={defaultCenter} zoom={defaultZoom} className="leaflet-map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {['visited', 'planned'].map((type) =>
          places[type].map((place, index) => (
            <Marker key={index} position={place.coords}>
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
      </MapContainer>
    </div>
  );
};

export default Map;
