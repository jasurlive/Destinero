import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ visitedPlaces, plannedPlaces }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPlaceIndex, setEditPlaceIndex] = useState(null);
  const [password, setPassword] = useState('');
  const [tempPlaceData, setTempPlaceData] = useState({});
  const [places, setPlaces] = useState({ visited: visitedPlaces, planned: plannedPlaces });

  const handleEdit = (index, placeType) => {
    setEditPlaceIndex(index);
    setIsEditing(true);
    setTempPlaceData({ ...places[placeType][index], placeType, coords: places[placeType][index].coords.join(',') });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'maymun') { // Replace 'maymun' with your actual password
      setIsEditing(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempPlaceData({ ...tempPlaceData, [name]: value });
  };

  const handleSave = () => {
    const { placeType, name, coords, imageLink } = tempPlaceData;
    const updatedPlaces = [...places[placeType]];
    updatedPlaces[editPlaceIndex] = { name, coords: coords.split(',').map(Number), imageLink };
    setPlaces({ ...places, [placeType]: updatedPlaces });
    setIsEditing(false);
    setEditPlaceIndex(null);
  };

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
              {isEditing && editPlaceIndex === index ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={tempPlaceData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Place Name"
                  />
                  <input
                    type="text"
                    name="coords"
                    value={tempPlaceData.coords || ''}
                    onChange={handleInputChange}
                    placeholder="Coordinates"
                  />
                  <input
                    type="text"
                    name="imageLink"
                    value={tempPlaceData.imageLink || ''}
                    onChange={handleInputChange}
                    placeholder="Image Link"
                  />
                  <button onClick={handleSave}>Save</button>
                </div>
              ) : (
                <div>
                  <strong>{place.name}</strong>
                  <br />
                  {place.imageLink && (
                    <a href={place.imageLink} target="_blank" rel="noopener noreferrer">
                      <img src={place.imageLink} alt={place.name} style={{ width: '100px', height: 'auto' }} />
                    </a>
                  )}
                  <button onClick={() => handleEdit(index, type)}>Edit</button>
                </div>
              )}
            </Popup>
          </Marker>
        ))
      )}
      {!isEditing && (
        <form onSubmit={handlePasswordSubmit} style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to edit"
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </MapContainer>
  );
};

export default Map;
