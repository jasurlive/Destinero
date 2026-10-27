import { useState } from "react";
import { useLocation } from "react-router";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/map.css";
import Marker from "../map/Markers";
import Controls from "../map/Controls";
import { DEFAULT_VIEW, type Pin } from "../map/types";
import { usePlaces, type PlaceType } from "../hooks/usePlaces";
import { useTheme } from "../hooks/useTheme";

const KEY = import.meta.env.VITE_MAPKEY;

// MapTiler when a key is set, free CARTO tiles otherwise
const tiles = (dark: boolean) =>
  KEY
    ? `https://api.maptiler.com/maps/${dark ? "streets-v2-dark" : "streets-v2"}/{z}/{x}/{y}.png?key=${KEY}`
    : `https://{s}.basemaps.cartocdn.com/${dark ? "dark_all" : "rastertiles/voyager"}/{z}/{x}/{y}{r}.png`;

// const ATTRIBUTION = KEY
//   ? '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; OpenStreetMap'
//   : '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap';

const LEGEND: { type: PlaceType; label: string }[] = [
  { type: "visited", label: "Visited" },
  { type: "planned", label: "Planned" },
  { type: "highlighted", label: "Highlighted" },
];

// clicking empty map drops a pin
function ClickPin({ onPin }: { onPin: (pin: Pin) => void }) {
  useMapEvents({
    click: (e) => onPin({ type: "clicked", name: "Pinned", coords: [e.latlng.lat, e.latlng.lng] }),
  });
  return null;
}

export default function MapPage() {
  const { places } = usePlaces();
  const { theme } = useTheme();
  // set by "Show on map" on the Places page
  const focus = (useLocation().state as { focus?: [number, number] } | null)?.focus;

  const [hidden, setHidden] = useState<PlaceType[]>([]);
  const [pins, setPins] = useState<Partial<Record<Pin["type"], Pin>>>({});
  const addPin = (pin: Pin) => setPins((prev) => ({ ...prev, [pin.type]: pin }));

  // open the focused place, or a random one on a plain visit
  const [seed] = useState(Math.random);
  const openKey = focus
    ? focus.join()
    : places[Math.floor(seed * places.length)]?.coords.join();

  const toggle = (type: PlaceType) =>
    setHidden((h) => (h.includes(type) ? h.filter((t) => t !== type) : [...h, type]));

  const shown = places.filter((p) => !hidden.includes(p.type));

  return (
    <div className="map-page">
      <MapContainer
        center={focus ?? DEFAULT_VIEW.center}
        zoom={focus ? 11 : DEFAULT_VIEW.zoom}
        minZoom={3}
        zoomSnap={0.5}
        zoomDelta={0.5}
        zoomControl={false}
        maxBounds={[
          [-90, -200],
          [90, 250],
        ]}
        className="map-container"
      >
        {/* key forces fresh tiles when the theme changes */}
        <TileLayer key={theme} url={tiles(theme === "dark")} />
        <ClickPin onPin={addPin} />
        <Controls addPin={addPin} />

        {shown.map((p) => (
          <Marker key={`${p.type}-${p.coords.join()}`} pin={p} autoOpen={p.coords.join() === openKey} />
        ))}
        {Object.values(pins).map((p) => (
          <Marker key={p.type} pin={p} autoOpen />
        ))}
      </MapContainer>

      <div className="map-legend">
        <span className="map-brand">Destinero</span>
        {LEGEND.map(({ type, label }) => (
          <button
            key={type}
            type="button"
            className={`legend-item badge-${type} ${hidden.includes(type) ? "off" : ""}`}
            onClick={() => toggle(type)}
            title={`Show / hide ${label.toLowerCase()}`}
          >
            <span className="legend-dot" />
            {label}
            <b>{places.filter((p) => p.type === type).length}</b>
          </button>
        ))}
      </div>
    </div>
  );
}
