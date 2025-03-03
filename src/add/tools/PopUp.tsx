import { useState } from 'react';
import { Marker, Popup, MarkerProps } from 'react-leaflet';
import L, { DivIcon } from 'leaflet';
import '../css/popup.css';
import { FaSpinner } from 'react-icons/fa';
import { getCountryFlag } from './Flags';

interface Place {
  type: string;
  coords: [number, number];
  name: string;
  imageLink?: string;
  icon: L.DivIcon;
}

interface CreatePopupProps {
  place: Place;
  mapRef: React.RefObject<any>;
  handleCopyClick: () => void;
  copySuccess: boolean;
  onPlaceClick: (coords: [number, number]) => void;
  locationDetails?: {
    placeName: string;
    city: string;
    country: string;
    countryCode: string;
  };
}

interface CustomMarkerProps extends MarkerProps {
  icon: DivIcon;
}

const CustomMarker: React.FC<CustomMarkerProps> = (props) => {
  return <Marker {...props} />;
};

const CreatePopup: React.FC<CreatePopupProps> = ({ place, mapRef, handleCopyClick, copySuccess, onPlaceClick, locationDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  const getIcon = (type: string): L.DivIcon => {
    return L.divIcon({
      html: type === 'visited' ? '🚩' : type === 'planned' ? '✈️' : '📌',
      className: 'custom-icon'
    });
  };

  return (
    <CustomMarker
      key={`${place.type}-${place.coords.join(',')}`}
      position={place.coords}
      icon={getIcon(place.type)}
    >
      <Popup>
        <div className="pop-up-container">
          <h2 className="place-name">{place.name}</h2>
          {locationDetails && (
            <>
              <p>{locationDetails.placeName}</p>
              <p>{locationDetails.city}, {locationDetails.country} {getCountryFlag(locationDetails.countryCode)}</p>
              {`Latitude: ${place.coords[0]}, Longitude: ${place.coords[1]}`}
              <button
                className={`copy-button ${copySuccess ? 'copied' : ''}`}
                onClick={() => handleCopyClick()}
              >
                {copySuccess ? 'Copied 😁!' : 'Copy Coords 🏌🏻‍♂️'}
              </button>
            </>
          )}
          {place.imageLink && (
            <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer">
              {!imageLoaded && <FaSpinner className="spinner-popup" />}
              <img
                src={place.imageLink}
                alt={place.name}
                className={`place-image ${imageLoaded ? 'loaded' : ''}`}
                onLoad={handleImageLoad}
              />
            </a>
          )}
        </div>
      </Popup>
    </CustomMarker>
  );
};

export default CreatePopup;
