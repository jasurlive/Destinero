import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createPopup = (place, mapRef, handleCopyClick, copySuccess) => {
  const isClicked = place.type === 'clicked';

  const handleCopy = () => {
    // Format coordinates as coords: [latitude, longitude]
    const formattedCoords = `coords: [${place.coords[0]}, ${place.coords[1]}]`;

    // Copy formatted coordinates to clipboard
    navigator.clipboard.writeText(formattedCoords);
    handleCopyClick(); // Trigger state change or feedback for copy success
  };

  return (
    <Marker
      key={`${place.type}-${place.coords.join(',')}`}
      position={place.coords}
      icon={L.divIcon({
        html: `<span class="unicode-icon">${
          place.type === 'visited' ? '🚩' : place.type === 'planned' ? '✈️' : '📍'
        }</span>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })}
    >
      <Popup
        onOpen={() => {
          // Adjust the map view to center on the clicked coordinates
          if (mapRef.current) {
            mapRef.current.setView(place.coords, mapRef.current.getZoom());
          }
        }}
      >
        <div className="cont">
          <h2>{isClicked ? 'Clicked Location' : place.name}</h2>
          <br />
          {!isClicked && place.imageLink && (
            <a href={place.imageLink} target="_blank" rel="noopener noreferrer">
              <img src={place.imageLink} alt={place.name} className="place-image" />
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
                {copySuccess ? 'Copied!' : 'Copy Coords'}
              </button>
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default createPopup;
