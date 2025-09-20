import { useCallback, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import { useZoom } from "../hooks/useZoom";

interface LiveLocationProps {
  map: any;
  setLiveCoords: (coords: [number, number]) => void;
}

const LiveLocation: React.FC<LiveLocationProps> = ({ map, setLiveCoords }) => {
  const { zoomToLocation } = useZoom(map);

  // 🔹 Local flag for immediate feedback
  const [isRequesting, setIsRequesting] = useState(false);

  // Request browser geolocation
  const getUserLocation = useCallback((e) => {
    e.stopPropagation();
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    setIsRequesting(true); // show spinner immediately

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setLiveCoords(coords); // 🔹 send coords up instead of handling popup here
        zoomToLocation(coords, 15); // zoom in
        setIsRequesting(false); // stop spinner after coords received
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        setIsRequesting(false); // stop spinner on error
      }
    );
  }, [setLiveCoords, zoomToLocation]);

  return (
    <div
      className="location-icon-container"
      onMouseEnter={(e) => e.currentTarget?.classList.add("hovered")}
      onMouseLeave={(e) => e.currentTarget?.classList.remove("hovered")}
      onClick={getUserLocation}
      onTouchStart={getUserLocation}
      title="🟢 Live location"
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
