import { useMap } from "react-leaflet";
import { useMapLock } from "../hooks/useLock";

type MapLockProps = {
  locked: boolean;
};

const MapLock = ({ locked }: MapLockProps) => {
  const map = useMap();
  useMapLock(map, locked);
  return null;
};
export default MapLock;
