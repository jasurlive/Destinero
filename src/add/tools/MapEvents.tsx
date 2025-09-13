import { useMapEvents } from "react-leaflet";
import { MapEventsProps } from "../../types/interface";

const MapEvents = ({ onClick }: MapEventsProps) => {
  useMapEvents({
    click: ({ latlng: { lat, lng } }) => {
      onClick([lat, lng]);
    },
  });

  return null;
};

export default MapEvents;
