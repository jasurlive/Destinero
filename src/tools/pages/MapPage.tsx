import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../css/map.css";
import Marker from "../map/Markers";
import Controls from "../map/Controls";
import { DEFAULT_VIEW, type Pin } from "../map/types";
import { usePlaces, type Place, type PlaceType } from "../hooks/usePlaces";
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

// clicking empty map drops a pin. Waits a moment first: a double-tap / pinch
// on phones also fires click, and dropping a pin mid-zoom made the map jump
function ClickPin({ onPin }: { onPin: (pin: Pin) => void }) {
  const timer = useRef(0);
  const lastZoom = useRef(0);
  const cancel = () => clearTimeout(timer.current);
  const zoomed = () => {
    cancel();
    lastZoom.current = Date.now();
  };

  useMapEvents({
    click: (e) => {
      cancel();
      if (Date.now() - lastZoom.current < 500) return; // tail of a pinch
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      timer.current = window.setTimeout(() => onPin({ type: "clicked", name: "Pinned", coords }), 300);
    },
    dblclick: zoomed,
    zoomstart: zoomed,
    zoomend: zoomed,
    dragstart: cancel,
  });

  useEffect(() => cancel, []);
  return null;
}

// opens one popup on arrival without moving the map afterwards:
// the focused place (view shifted down first to make room for its popup),
// or a random place whose popup already fits on screen
function AutoOpen({
  places,
  focus,
  onOpen,
}: {
  places: Place[];
  focus?: [number, number];
  onOpen: (key: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (focus) {
      const zoom = map.getZoom();
      const center = map.unproject(map.project(focus, zoom).subtract([0, 160]), zoom);
      map.setView(center, zoom, { animate: false });
      onOpen(focus.join());
      return;
    }

    const { x: w, y: h } = map.getSize();
    const fits = places.filter((p) => {
      const { x, y } = map.latLngToContainerPoint(p.coords);
      return x > 160 && x < w - 160 && y > 460 && y < h - 40; // popup is ~320px tall
    });
    if (fits.length) onOpen(fits[Math.floor(Math.random() * fits.length)].coords.join());
  }, [map, places, focus, onOpen]);

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

  const [openKey, setOpenKey] = useState<string | null>(null);

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
        <AutoOpen places={places} focus={focus} onOpen={setOpenKey} />
        <Controls addPin={addPin} />

        {shown.map((p) => (
          <Marker key={`${p.type}-${p.coords.join()}`} pin={p} autoOpen={p.coords.join() === openKey} still />
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
