import { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import SearchBox from './SearchBox';
import MapEvents from './MapEvents';
import CreatePopup from './PopUp';
import { zoomToLocation } from './Zoomin';
import { useMediaQuery } from '@mui/material';
import '../css/map.css';
import 'leaflet/dist/leaflet.css';

interface Place {
  coords: [number, number];
  type: string;
  name: string;
  icon: L.DivIcon;
}

interface MapProps {
  visitedPlaces: Place[];
  plannedPlaces: Place[];
  searchCoords: [number, number] | null;
  setSearchCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

const Map: React.FC<MapProps> = ({ visitedPlaces, plannedPlaces, searchCoords, setSearchCoords }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const defaultCenter: [number, number] = isMobile ? [41.505, -0.09] : [31.505, -0.09];
  const defaultZoom = isMobile ? 2.5 : 4;
  const adjustedCenter: [number, number] = [defaultCenter[0], defaultCenter[1] + (isMobile ? 22 : 95.05)];
  const [locationDetails, setLocationDetails] = useState({ placeName: '', city: '', country: '', countryCode: '' });
  const [popupCoords, setPopupCoords] = useState<[number, number] | null>(null);
  const [clickedLocationDetails, setClickedLocationDetails] = useState({ placeName: '', city: '', country: '', countryCode: '' });

  const handleMapClickLocal = useCallback((coords: [number, number]) => {
    setPopupCoords(coords);
    fetchLocationDetails(coords).then(details => setClickedLocationDetails(details));
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        handleMapClickLocal([e.latlng.lat, e.latlng.lng]);
      });
    }
    return () => {
      if (map) {
        map.off('click');
      }
    };
  }, [handleMapClickLocal]);

  const handleCopyClick = useCallback(() => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  }, []);

  const copyCoordsToClipboard = useCallback((coords: [number, number]) => {
    navigator.clipboard.writeText(`[${coords[0]}, ${coords[1]}]`);
    handleCopyClick();
  }, [handleCopyClick]);

  useEffect(() => {
    if (searchCoords && mapRef.current) {
      zoomToLocation(mapRef.current, searchCoords);
      fetchLocationDetails(searchCoords).then(details => setLocationDetails(details));
    }
  }, [searchCoords]);

  const fetchLocationDetails = async (coords: [number, number]) => {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`);
    const data = await response.json();
    return {
      placeName: data.display_name,
      city: data.address.city || data.address.town || data.address.village || '',
      country: data.address.country,
      countryCode: data.address.country_code.toUpperCase()
    };
  };

  const places = [
    ...visitedPlaces.map((place) => ({
      ...place,
      type: 'visited',
      icon: L.divIcon({ className: 'visited-icon' })
    })),
    ...plannedPlaces.map((place) => ({
      ...place,
      type: 'planned',
      icon: L.divIcon({ className: 'planned-icon' })
    })),
  ];

  const handlePlaceClick = useCallback((coords: [number, number]) => {
    zoomToLocation(mapRef.current, coords);
  }, []);

  return (
    <div className="map-container">
      <MapContainer
        center={adjustedCenter}
        zoom={defaultZoom}
        className="leaflet-map"
        ref={mapRef}
        zoomSnap={0.5}
        zoomDelta={0.5}
        zoomControl={false}
        worldCopyJump={true}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        fadeAnimation={true}
        attributionControl={false}
        keyboard={true}
        touchZoom={true}
        scrollWheelZoom={true}
        minZoom={3}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=iQtt3mhP0bDaBKFSImNM"
        />
        <SearchBox
          map={mapRef.current}
          onSearch={setSearchCoords}
          handleCopyClick={handleCopyClick}
          copySuccess={copySuccess}
        />
        <MapEvents onClick={handleMapClickLocal} />
        {places.map((place) => (
          <CreatePopup
            key={`${place.type}-${place.coords.join(',')}`}
            place={place}
            mapRef={mapRef}
            handleCopyClick={handleCopyClick}
            copySuccess={copySuccess}
            onPlaceClick={handlePlaceClick}
          />
        ))}
        {searchCoords && (
          <CreatePopup
            place={{
              type: 'searched',
              coords: searchCoords,
              name: locationDetails.placeName,
              icon: L.divIcon({ className: 'searched-icon' })
            }}
            mapRef={mapRef}
            handleCopyClick={handleCopyClick}
            copySuccess={copySuccess}
            onPlaceClick={handlePlaceClick}
            locationDetails={locationDetails}
          />
        )}
        {popupCoords && (
          <CreatePopup
            place={{
              type: 'clicked',
              coords: popupCoords,
              name: clickedLocationDetails.placeName,
              icon: L.divIcon({ className: 'clicked-icon' })
            }}
            mapRef={mapRef}
            handleCopyClick={handleCopyClick}
            copySuccess={copySuccess}
            onPlaceClick={handlePlaceClick}
            locationDetails={clickedLocationDetails}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
