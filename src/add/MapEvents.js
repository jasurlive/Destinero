import { useMapEvents } from 'react-leaflet';

const MapEvents = ({ onClick }) => {
  useMapEvents({
    click: (event) => {
      const { lat, lng } = event.latlng;
      onClick([lat, lng]);
    },
  });
  return null;
};

export default MapEvents;
