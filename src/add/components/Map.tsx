import { MapContainer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/Map.css";
import "../css/leaflet.css";
import MapTiler from "../tools/MapTiler";

function Map() {
  return (
    <MapContainer
      center={[40, 62]}
      zoom={4}
      scrollWheelZoom
      zoomControl={false}
      attributionControl={false}
      className="map-container"
      zoomSnap={0.5}
      zoomDelta={0.5}
      maxBounds={[
        [-90, -200],
        [90, 250],
      ]}
      fadeAnimation
      minZoom={3}
    >
      <MapTiler />
    </MapContainer>
  );
}

export default Map;
