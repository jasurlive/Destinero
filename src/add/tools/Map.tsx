import { useRef, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import SearchBox from "./components/SearchBox";
import MapEvents from "./components/MapEvents";
import PlaceMarkers from "./components/PlaceMarkers";
import PopupHandler from "./PopupHandler";
import GeoHighlights from "./components/GeoHighlights";
import LockOverlay from "./components/LockOverlay";
import LiveLocation from "./components/LiveLocation";

import { usePopupOptions } from "./hooks/usePopUpOptions";
import { useFetchLocation } from "./hooks/useFetchLocation";
import { MapProps } from "../../types/interface";

import "../css/map.css";
import "leaflet/dist/leaflet.css";

const mapKey = import.meta.env["VITE_MapKey"];

const Map: React.FC<MapProps & { locked?: boolean }> = ({
  visitedPlaces,
  plannedPlaces,
  highlightedPlaces = [],
  searchCoords,
  setSearchCoords,
  locked = true,
}) => {
  const mapRef = useRef<L.Map | null>(null);

  const defaultCenter: [number, number] = [31.505, -0.09];
  const defaultZoom = 3.3;

  const {
    clickedCoords,
    liveCoords,
    setLiveCoords,
    copySuccess,
    copyToClipboard,
    handleMapClick,
  } = usePopupOptions();

  const { fetchCoordsData, getDetailsForCoords, loading } = useFetchLocation();

  useEffect(() => {
    const coordsToFetch = clickedCoords || searchCoords || liveCoords;
    if (coordsToFetch) fetchCoordsData(coordsToFetch);
  }, [clickedCoords, liveCoords, searchCoords, fetchCoordsData]);

  return (
    <div className="map-container">
      <MapContainer
        center={defaultCenter}
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
        fadeAnimation
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

        {mapRef.current && (
          <LiveLocation map={mapRef.current} setLiveCoords={setLiveCoords} />
        )}

        <PopupHandler
          popupCoords={clickedCoords}
          searchCoords={searchCoords}
          liveCoords={liveCoords}
          locationDetails={getDetailsForCoords(
            clickedCoords || searchCoords || liveCoords || null
          )}
          mapRef={mapRef}
          copyCoordsToClipboard={(coords: [number, number]) =>
            copyToClipboard(`${coords[0]}, ${coords[1]}`)
          }
          copySuccess={copySuccess}
          loading={loading}
        />
      </MapContainer>
    </div>
  );
};

export default Map;
