import { useMapEvents } from 'react-leaflet';

interface MapEventsProps {
  onClick: (coords: [number, number]) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onClick }) => {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      onClick([lat, lng]);
    },
  });
  return null;
};

export default MapEvents;
