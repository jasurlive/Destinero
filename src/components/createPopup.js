import React, { useState } from 'react'; // Import useState from React
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const CreatePopup = (place, mapRef, handleCopyClick, copySuccess) => {
  const [imageLoaded, setImageLoaded] = useState(false); // State to track if image is loaded
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
          // Check if the image is loaded before adjusting the map view
          if (imageLoaded && mapRef.current) {
            // Get the popup element and calculate its height and width
            const popupElement = document.querySelector('.leaflet-popup');

            if (popupElement) {
              const popupHeight = popupElement.offsetHeight; // Get the height of the popup
              const popupWidth = popupElement.offsetWidth; // Get the width of the popup

              // Get the map instance and its dimensions
              const map = mapRef.current;
              const mapHeight = map.getSize().y;
              const mapWidth = map.getSize().x;

              // Calculate the offsets to center the popup
              const offsetLat = (popupHeight / mapHeight) * 180; // Calculate vertical offset
              const offsetLng = (popupWidth / mapWidth) * 360; // Calculate horizontal offset

              // Calculate the new center position to move the map
              const centerLatLng = [
                place.coords[0] - offsetLat / 2, // Adjust latitude
                place.coords[1] + offsetLng / 2 // Adjust longitude
              ];

              // Adjust the view to the new center with a smooth transition
              map.flyTo(centerLatLng, map.getZoom(), { animate: true });
            }
          }
        }}
      >
        <div className="cont">
          <h2>{isClicked ? 'Clicked Location' : place.name}</h2>
          <br />
          {!isClicked && place.imageLink && (
            <a
              href="https://jasurgraduate.blogspot.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src={place.imageLink} 
                alt={place.name} 
                className="place-image" 
                onLoad={() => setImageLoaded(true)} // Set image loaded state
                style={{ display: imageLoaded ? 'block' : 'none' }} // Hide image until loaded
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
