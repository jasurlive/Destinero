import { useState, useEffect, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet"; // ✅ import Leaflet's Marker type
import "../css/popup.css";
import { FaSpinner } from "react-icons/fa";
import { getCountryFlag } from "./Flags";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { CreatePopupProps } from "../../types/interface";

const CreatePopup: React.FC<CreatePopupProps & { autoOpen?: boolean }> = ({
  place,
  handleCopyClick,
  copySuccess,
  locationDetails,
  autoOpen = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const markerRef = useRef<LeafletMarker>(null); // ✅ ref is typed correctly

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCopy = () => {
    const formattedCoords = `[${place.coords[0]}, ${place.coords[1]}]`;
    navigator.clipboard.writeText(formattedCoords);
    handleCopyClick();
  };

  const getTitle = () => {
    switch (place.type) {
      case "current":
        return "You are here! 😍";
      case "searched":
        return "Searched Location 📍";
      case "clicked":
        return "Clicked Location 📌";
      case "visited":
      case "planned":
      case "highlighted":
        return place.name;
      default:
        return "Location";
    }
  };

  // ✅ Open popup automatically if requested
  useEffect(() => {
    if (autoOpen && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [autoOpen]);

  return (
    <Marker
      key={`${place.type}-${place.coords.join(",")}`}
      position={place.coords}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(place.icon),
        className: "custom-icon",
      })}
      ref={markerRef} // ✅ now correctly typed
    >
      <Popup>
        <div className="pop-up-container">
          <h2 className="place-name">{getTitle()}</h2>
          {locationDetails && (
            <>
              <p>{locationDetails.placeName}</p>
              <p className="city-name-popup">
                {locationDetails.city || "Unknown city"},{" "}
                {locationDetails.country?.trim() || "Unknown country"}{" "}
                {getCountryFlag(locationDetails.countryCode || "")}
              </p>
              <p>{`Latitude: ${place.coords[0]}, Longitude: ${place.coords[1]}`}</p>
              <button
                className={`copy-button ${copySuccess ? "copied" : ""}`}
                onClick={handleCopy}
              >
                {copySuccess ? "Copied 😁" : "Copy Coords 🏌🏻‍♂️"}
              </button>
            </>
          )}
          {place.imageLink && (
            <>
              {!imageLoaded && <FaSpinner className="spinner-popup" />}
              <img
                src={place.imageLink}
                alt={place.name}
                className={`place-image ${imageLoaded ? "loaded" : ""}`}
                onLoad={handleImageLoad}
              />
            </>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export default CreatePopup;
