import { useState } from 'react';
import { Marker, Popup, MarkerProps } from 'react-leaflet';
import '../css/popup.css';
import { FaSpinner } from 'react-icons/fa';
import { getCountryFlag } from './Flags';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

interface Place {
  type: string;
  coords: [number, number];
  name: string;
  imageLink?: string;
  icon: React.ReactElement;
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

const CustomMarker: React.FC<MarkerProps> = (props) => {
  return <Marker {...props} />;
};

const CreatePopup: React.FC<CreatePopupProps> = ({ place, mapRef, handleCopyClick, copySuccess, onPlaceClick, locationDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCopy = () => {
    const formattedCoords = `[${place.coords[0]}, ${place.coords[1]}]`;
    navigator.clipboard.writeText(formattedCoords);
    handleCopyClick();
  };

  return (
    <CustomMarker
      key={`${place.type}-${place.coords.join(',')}`}
      position={place.coords}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(place.icon),
        className: 'custom-icon',
      })}
    >
      <Popup>
        <div className="pop-up-container">
          <h2 className="place-name">{place.name}</h2>
          {locationDetails && (
            <>
              <p>{locationDetails.placeName}</p>
              <p className="city-name-popup">{locationDetails.city}, {locationDetails.country} {getCountryFlag(locationDetails.countryCode)}</p>
              <p>{`Latitude: ${place.coords[0]}, Longitude: ${place.coords[1]}`}</p>
              <button
                className={`copy-button ${copySuccess ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {copySuccess ? 'Copied 😁' : 'Copy Coords 🏌🏻‍♂️'}
              </button>
            </>
          )}
          {place.type === 'current' && (
            <a href="https://jasurlive.uz" target="_blank" rel="noopener noreferrer">
            </a>
          )}
          {place.imageLink && (
            <a href="https://jasurlive.uz" target="_blank" rel="noopener noreferrer">
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
