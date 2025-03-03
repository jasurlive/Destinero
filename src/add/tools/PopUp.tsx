import { useState } from 'react';
import { Marker, Popup, MarkerProps } from 'react-leaflet';
import '../css/popup.css';
import { FaSpinner } from 'react-icons/fa';
import { getCountryFlag } from './Flags';
import here_pic from '../media/img/here.jpg';
import { GrFlagFill } from "react-icons/gr";
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
          {place.type === 'current' && (
            <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={here_pic}
                alt="Your Location"
                className="place-image-live"
              />
            </a>
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
