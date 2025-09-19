import { useCallback, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlineMyLocation } from "react-icons/md";
import { BsPersonRaisedHand } from "react-icons/bs";
import CreatePopup from "./PopupWindow";
import { useZoom } from "../hooks/useZoom";
import { useLocationPopup } from "../hooks/useLocationPopup";

interface LiveLocationProps {
  map: any;
  handleCopyClick: (coords: [number, number]) => void;
}

const LiveLocation: React.FC<LiveLocationProps> = ({
  map,
  handleCopyClick,
}) => {
  const { zoomToLocation } = useZoom(map);

  const {
    popupCoords: currentLocation,
    locationDetails,
    loading: isFetchingLocation,
    setCoordsAndFetch,
    copyToClipboard,
    copySuccess,
  } = useLocationPopup();

  // 🔹 Local flag for immediate feedback
  const [isRequesting, setIsRequesting] = useState(false);

  // Request browser geolocation
  const getUserLocation = useCallback(() => {
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
        setCoordsAndFetch(coords); // fetch reverse geocode + popup details
        zoomToLocation(coords, 15); // zoom in
        setIsRequesting(false); // stop spinner after coords received
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        setIsRequesting(false); // stop spinner on error
      }
    );
  }, [setCoordsAndFetch, zoomToLocation]);

  // Clipboard copy
  const handleCopy = useCallback(() => {
    if (currentLocation) {
      const coordsString = `[${currentLocation[0]}, ${currentLocation[1]}]`;
      copyToClipboard(coordsString);
      handleCopyClick(currentLocation);
    }
  }, [currentLocation, copyToClipboard, handleCopyClick]);

  const glowStyle = currentLocation ? "active-glow" : "inactive-glow";

  return (
    <div>
      {/* Live Location Button */}
      <div
        className="location-icon-container"
        onMouseEnter={(e) => e.currentTarget?.classList.add("hovered")}
        onMouseLeave={(e) => e.currentTarget?.classList.remove("hovered")}
        onClick={getUserLocation}
        onTouchStart={getUserLocation}
        title="🟢 Live location"
      >
        {isRequesting || isFetchingLocation ? (
          <FaSpinner className="spinner-live" />
        ) : (
          <MdOutlineMyLocation className={`location-icon ${glowStyle}`} />
        )}
      </div>

      {/* Live Location Popup */}
      {currentLocation && locationDetails && (
        <CreatePopup
          place={{
            type: "current",
            coords: currentLocation,
            icon: <BsPersonRaisedHand className="custom-marker-icon-live" />,
          }}
          handleCopyClick={handleCopy}
          locationDetails={locationDetails}
          autoOpen
          onPlaceClick={() => zoomToLocation(currentLocation, 15)}
        />
      )}
    </div>
  );
};

export default LiveLocation;
