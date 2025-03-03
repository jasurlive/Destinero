import { useState, useCallback, useEffect, useRef } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { zoomToLocation } from './Zoomin';
import { FaSpinner } from 'react-icons/fa';
import { MdOutlineMyLocation } from 'react-icons/md';
import here_pic from '../media/img/here.jpg';
import '../css/searchbox.css';



interface SearchBoxProps {
  map: any;
  handleCopyClick: () => void;
  copySuccess: boolean;
  onSearch: (coords: [number, number]) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ map, handleCopyClick, copySuccess, onSearch }) => {
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [locationDetails, setLocationDetails] = useState({ placeName: '', city: '', country: '' });


  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      setIsWaiting(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coords: [number, number] = [latitude, longitude];
          setCurrentLocation(coords);
          setErrorMsg('');
          setSuccessMsg('');
          setIsWaiting(false);
          zoomToLocation(map, coords, 15);

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            setLocationDetails({
              placeName: data.display_name,
              city: data.address.city || data.address.town || data.address.village || '',
              country: data.address.country || '',
            });
          } catch (error) {
            console.error('Error fetching location details:', error);
          }
        },
        () => {
          setErrorMsg('Unable to retrieve your location');
          setIsWaiting(false);
        }
      );
    } else {
      setErrorMsg('Geolocation is not supported by your browser');
    }
  };

  const handleCopy = () => {
    if (currentLocation) {
      const formattedCoords = `[${currentLocation[0]}, ${currentLocation[1]}]`;
      navigator.clipboard.writeText(formattedCoords);
      handleCopyClick();
    }
  };

  const handleSearch = useCallback(async () => {
    if (searchTerm.trim() === '') return;

    setIsSearching(true);
    const provider = new OpenStreetMapProvider();
    try {
      const results = await provider.search({ query: searchTerm });
      if (results.length > 0) {
        const { x, y } = results[0];
        zoomToLocation(map, [y, x], 15);
        onSearch([y, x]);
        setSuccessMsg('The place was found');
        setErrorMsg('');
      } else {
        setErrorMsg('No results found');
        setSuccessMsg('');
      }
    } catch (error) {
      setErrorMsg('Error fetching geocoding data');
      setSuccessMsg('');
      console.error('Error fetching geocoding data:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, map, onSearch]);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value), []);

  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg('');
        setSuccessMsg('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  const handleLocationClickAnimation = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.currentTarget) {
      const targetElement = e.currentTarget as HTMLElement;
      targetElement.style.transform = 'scale(0.8)';
      setTimeout(() => targetElement.style.transform = 'scale(1)', 200);
      handleLocationClick();
    }
  };

  const glowStyle = currentLocation ? 'active-glow' : 'inactive-glow';

  return (
    <>
      <div className="search-box">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for a place..."
          className="search-input"
        />
        <button onClick={handleSearchClick} className="search-button">
          {isSearching ? <FaSpinner className="spinner-search-button" /> : 'Search'}
        </button>
      </div>

      <div
        className="location-icon-container"
        onMouseEnter={(e) => e.currentTarget?.classList.add('hovered')}
        onMouseLeave={(e) => e.currentTarget?.classList.remove('hovered')}
        onClick={(e) => {
          stopPropagation(e);
          handleLocationClickAnimation(e);
        }}
        onTouchStart={(e) => {
          stopPropagation(e);
          handleLocationClickAnimation(e);
        }}
        title="🟢 Live location"
      >
        {isWaiting ? (
          <FaSpinner className="spinner-live" />
        ) : (
          <MdOutlineMyLocation className={`location-icon ${glowStyle}`} />
        )}
      </div>

      {currentLocation && (
        <Marker position={currentLocation}>
          <Popup>
            <div className="pop-up-container">
              <h2 className="place-name">Your Current Location</h2>
              <p>{locationDetails.placeName}</p>
              <p>{locationDetails.city}, {locationDetails.country}</p>
              <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src={here_pic}
                  alt="Your Location"
                  className="place-image-live"
                />
              </a>
              {`Latitude: ${currentLocation[0]}, Longitude: ${currentLocation[1]}`}
              <button
                className={`copy-button ${copySuccess ? 'copied' : ''}`}
                onClick={(e) => {
                  stopPropagation(e);
                  handleCopy();
                }}
              >
                {copySuccess ? 'Copied 😁!' : 'Copy Coords 🏌🏻‍♂️'}
              </button>
            </div>
          </Popup>
        </Marker>
      )}

      {errorMsg && (
        <div className="message error-message">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="message success-message">
          {successMsg}
        </div>
      )}
    </>
  );
};

export default SearchBox;

