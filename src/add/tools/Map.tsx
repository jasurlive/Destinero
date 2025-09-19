import { useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useMediaQuery } from "@mui/material";

import SearchBox from "./components/SearchBox";
import MapEvents from "./components/MapEvents";
import PlaceMarkers from "./components/PlaceMarkers";
import PopupHandler from "./PopupHandler";
import GeoHighlights from "./components/GeoHighlights";
import LockOverlay from "./components/LockOverlay";
import LiveLocation from "./components/LiveLocation";

import { useLocationPopup } from "./hooks/useLocationPopup";
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
  const isMobile = useMediaQuery("(max-width:600px)");
  const defaultCenter: [number, number] = isMobile
    ? [41.505, -0.09]
    : [31.505, -0.09];
  const defaultZoom = isMobile ? 2.5 : 3.3;
  const adjustedCenter: [number, number] = [
    defaultCenter[0],
    defaultCenter[1] + (isMobile ? 22 : 70),
  ];

  // --- Unified hook for location popup and clipboard ---
  const {
    clickedCoords, // 🔹 renamed from popupCoords
    liveCoords, // 🔹 get live location coords
    setLiveCoords, // 🔹 setter for live location
    loading,
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
    handleMapClick, // 🔹 renamed from handleMapClick
    setCoordsAndFetch,
    getDetailsForCoords, // 🔹 fetch details when rendering PopupHandler
  } = useLocationPopup();

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
        worldCopyJump={false}
        maxBounds={[
          [-90, -200],
          [90, 250],
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

        <LockOverlay locked={locked} mapRef={mapRef} />
        {!locked && <MapEvents onClick={handleMapClick} />}

        <SearchBox
          map={mapRef.current}
          onSearch={setSearchCoords}
          handleCopyClick={copyToClipboard}
          copySuccess={copySuccess}
        />

        <PlaceMarkers
          visitedPlaces={visitedPlaces}
          plannedPlaces={plannedPlaces}
          highlightedPlaces={highlightedPlaces}
        />

        {/* 🔹 Live Location Button */}
        <LiveLocation map={mapRef.current} setLiveCoords={setLiveCoords} />

        {/* 🔹 Popup Handler now uses clickedCoords + liveCoords */}
        <PopupHandler
          popupCoords={clickedCoords} // ✅ updated
          searchCoords={searchCoords}
          liveCoords={liveCoords}
          locationDetails={getDetailsForCoords(
            clickedCoords || searchCoords || liveCoords || null
          )} // ✅ use hook’s resolver
          mapRef={mapRef}
          copyCoordsToClipboard={(coords: [number, number]) =>
            copyToClipboard(`${coords[0]}, ${coords[1]}`)
          }
          copySuccess={copySuccess}
        />
      </MapContainer>
    </div>
  );
};

export default Map;

/* 
  🔹 Updates after renaming:
    - popupCoords -> clickedCoords
    - handleMapClick -> handleMapClick
    - locationDetails is resolved using getDetailsForCoords()
  
  To revert:
    1. Rename clickedCoords -> popupCoords.
    2. Rename handleMapClick -> handleMapClick.
    3. Pass locationDetails directly from hook if you re-add it.
*/
