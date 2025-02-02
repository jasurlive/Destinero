import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { zoomToLocation } from './Zoomin';

const CreatePopup = ({ place, mapRef, handleCopyClick, copySuccess }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <Marker
      key={`${place.type}-${place.coords.join(',')}`}
      position={place.coords}
      icon={L.divIcon({
        html: `<span class="unicode-icon">${place.type === 'visited' ? '🚩' : '✈️'}</span>`,
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })}
    >
      <Popup
        onOpen={() => {

          if (mapRef.current) {
            zoomToLocation(mapRef.current, place.coords, 15);
          }
        }}
      >
        <div className="cont">
          <h2>{place.name}</h2>
          <br />
          {place.imageLink && (
            <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer"> {/* Static link */}
              <img
                src={place.imageLink}
                alt={place.name}
                className="place-image"
                onLoad={handleImageLoad}
                style={{ display: imageLoaded ? 'block' : 'none' }}
              />
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default CreatePopup;
