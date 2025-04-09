import { useMapEvents } from "react-leaflet";

interface MapEventsProps {
  onClick: (coords: [number, number]) => void;
}

const MapEvents = ({ onClick }: MapEventsProps) => {
  useMapEvents({
    click: ({ latlng: { lat, lng } }) => {
      onClick([lat, lng]);
    },
  });

  return null;
};

export default MapEvents;
