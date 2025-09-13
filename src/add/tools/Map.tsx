import { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { PiFlagPennantFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { ImHeartBroken } from "react-icons/im";
import { useMediaQuery } from "@mui/material";

import SearchBox from "./SearchBox";
import MapEvents from "./components/MapEvents";
import PlaceMarkers from "./components/PlaceMarkers";
import PopupHandler from "./components/PopupHandler";
import GeoHighlights from "./components/GeoHighlights";

import { useZoom } from "./hooks/useZoom";
import { useGeoHighlights } from "./hooks/useGeoHighlights";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";
import { MapProps } from "../../types/interface";

import "../css/map.css";
import "leaflet/dist/leaflet.css";

const mapKey = import.meta.env.VITE_MapKey;

const Map: React.FC<MapProps & { locked?: boolean }> = ({
  visitedPlaces,
  plannedPlaces,
  highlightedPlaces = [],
  searchCoords,
  setSearchCoords,
  locked = true,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const { zoomToLocation } = useZoom(mapRef.current);
  const geoData = useGeoHighlights();
  const isMobile = useMediaQuery("(max-width:600px)");
  const defaultCenter: [number, number] = isMobile
    ? [41.505, -0.09]
    : [31.505, -0.09];
  const defaultZoom = isMobile ? 2.5 : 3.3;
  const adjustedCenter: [number, number] = [
    defaultCenter[0],
    defaultCenter[1] + (isMobile ? 22 : 70),
  ];
  const [locationDetails, setLocationDetails] = useState({
    placeName: "",
    city: "",
    country: "",
    countryCode: "",
  });
  const [popupCoords, setPopupCoords] = useState<[number, number] | null>(null);
  const [clickedLocationDetails, setClickedLocationDetails] = useState({
    placeName: "",
    city: "",
    country: "",
    countryCode: "",
  });

  const handleMapClickLocal = useCallback((coords: [number, number]) => {
    setPopupCoords(coords);
    fetchLocationDetails(coords).then((details) =>
      setClickedLocationDetails(details)
    );
  }, []);

  const { copyToClipboard, copySuccess } = useCopyToClipboard();

  useEffect(() => {
    if (searchCoords) {
      zoomToLocation(searchCoords, 15, async () => {
        const details = await fetchLocationDetails(searchCoords);
        setLocationDetails(details);
      });
    }
  }, [searchCoords, zoomToLocation]);

  const fetchLocationDetails = async (coords: [number, number]) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`
    );
    const data = await response.json();
    return {
      placeName: data.display_name,
      city:
        data.address.city || data.address.town || data.address.village || "",
      country: data.address.country,
      countryCode: data.address.country_code.toUpperCase(),
    };
  };

  const handlePlaceClick = useCallback(
    (coords: [number, number]) => {
      zoomToLocation(coords);
    },
    [zoomToLocation]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Always start locked on first mount
    if (locked) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoom.disable();
      map.off("click");
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.touchZoom.enable();
      map.on("click", (e: L.LeafletMouseEvent) => {
        handleMapClickLocal([e.latlng.lat, e.latlng.lng]);
      });
    }

    return () => {
      if (map) {
        map.off("click");
      }
    };
  }, [locked, handleMapClickLocal, mapRef.current]);

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
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={0}
        fadeAnimation={true}
        attributionControl={false}
        minZoom={3}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${mapKey}`}
        />

        <GeoHighlights />

        <SearchBox
          map={mapRef.current}
          onSearch={setSearchCoords}
          handleCopyClick={copyToClipboard}
          copySuccess={copySuccess}
        />
        {!locked && <MapEvents onClick={handleMapClickLocal} />}

        <PlaceMarkers
          visitedPlaces={visitedPlaces}
          plannedPlaces={plannedPlaces}
          highlightedPlaces={highlightedPlaces}
          mapRef={mapRef}
          onPlaceClick={handlePlaceClick}
          copyCoordsToClipboard={copyToClipboard}
          copySuccess={copySuccess}
        />

        <PopupHandler
          popupCoords={popupCoords}
          searchCoords={searchCoords}
          locationDetails={locationDetails}
          clickedLocationDetails={clickedLocationDetails}
          mapRef={mapRef}
          copyCoordsToClipboard={copyToClipboard}
          copySuccess={copySuccess}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
