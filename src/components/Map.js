import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ visitedPlaces, plannedPlaces }) => {
  const places = { visited: visitedPlaces, planned: plannedPlaces };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={3} style={{ height: '100vh', width: '100%' }}>
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
                    <img src={place.imageLink} alt={place.name} style={{ width: '100px', height: 'auto' }} />
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
};

export default Map;
