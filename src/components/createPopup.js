import React, { useState } from 'react'; // Removed useEffect
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { zoomToLocation } from './zoomin'; // Import your zoomToLocation function

const CreatePopup = ({ place, mapRef, handleCopyClick, copySuccess }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const isClicked = place.type === 'clicked';

  const handleCopy = () => {
    const formattedCoords = `[${place.coords[0]}, ${place.coords[1]}]`;
    navigator.clipboard.writeText(formattedCoords);
    handleCopyClick(); // Trigger state change or feedback for copy success
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Marker
      key={`${place.type}-${place.coords.join(',')}`} // Unique key for each marker
      position={place.coords}
      icon={L.divIcon({
        html: `<span class="unicode-icon">${place.type === 'visited' ? '🚩' : place.type === 'planned' ? '✈️' : '📍'
          }</span>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })}
    >
      <Popup
        onOpen={() => {
          // Fly to the clicked coordinates and zoom in
          if (mapRef.current) {
            zoomToLocation(mapRef.current, place.coords, 15); // Zoom level can be adjusted
          }
        }}
      >
        <div className="cont">
          <h2>{isClicked ? 'Clicked Location' : place.name}</h2>
          <br />
          {!isClicked && place.imageLink && (
            <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer"> {/* Static link */}
              <img
                src={place.imageLink}
                alt={place.name}
                className="place-image"
                onLoad={handleImageLoad}
                style={{ display: imageLoaded ? 'block' : 'none' }} // Show image once loaded
              />
            </a>
          )}
          {isClicked && (
            <>
              {`Place: ${place.name}`}
              <br />
              {place.flag && <span>{place.flag}</span>}
              <br />
              {`Latitude: ${place.coords[0]}, Longitude: ${place.coords[1]}`}
              <br />
              <button className={`copy-button ${copySuccess ? 'copied' : ''}`} onClick={handleCopy}>
                {copySuccess ? 'Copied 😁!' : 'Copy Coords 🏌🏻‍♂️'}
              </button>
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default CreatePopup;
