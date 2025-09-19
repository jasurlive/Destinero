// MapEvents.tsx
import { useMapEvents } from "react-leaflet";

interface MapEventsProps {
  onClick: (coords: [number, number]) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export default MapEvents;
