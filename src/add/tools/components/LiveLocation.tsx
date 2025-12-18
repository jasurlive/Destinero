import { useCallback, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import { useZoom } from "../hooks/useZoom";

interface LiveLocationProps {
  map?: L.Map | null;
  setLiveCoords?: (coords: [number, number]) => void;
}

const LiveLocation: React.FC<LiveLocationProps> = ({ map, setLiveCoords }) => {
  const { zoomToLocation } = useZoom(map ?? null);
  const [isRequesting, setIsRequesting] = useState(false);

  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    setIsRequesting(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setLiveCoords?.(coords);
        zoomToLocation(coords, 15);
        setIsRequesting(false);
      },
      () => setIsRequesting(false)
    );
  }, [setLiveCoords, zoomToLocation]);

  return (
    <div
      className="location-icon-container"
      onClick={getUserLocation}
      onTouchStart={getUserLocation}
      title="Live location"
    >
      {isRequesting ? (
        <FaSpinner className="spinner-live" />
      ) : (
        <MdOutlineMyLocation className="location-icon inactive-glow" />
      )}
    </div>
  );
};

export default LiveLocation;
