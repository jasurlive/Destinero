import React, { useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { FaSpinner } from "react-icons/fa";
import { useLocationPopup } from "../hooks/useLocationPopup";
import { CreatePopupProps } from "../../../types/interface";
import { getCountryFlag } from "./getCountryFlags";
import "../../css/popup.css";

const PopupWindow: React.FC<CreatePopupProps & { autoOpen?: boolean }> = ({
  place,
  locationDetails,
  handleCopyClick,
  autoOpen = false,
}) => {
  const {
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
    setCoordsAndFetch,
  } = useLocationPopup({ autoOpen, handleCopyClick });

  useEffect(() => {
    if (
      !locationDetails &&
      ["current", "searched", "clicked"].includes(place.type)
    ) {
      setCoordsAndFetch(place.coords);
    }
  }, [place.coords, place.type, locationDetails, setCoordsAndFetch]);

  const handleCopy = () =>
    copyToClipboard(`[${place.coords[0]}, ${place.coords[1]}]`);

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
        return place.name; // static title for these
      default:
        return "Location";
    }
  };

  return (
    <Marker
      key={`${place.type}-${place.coords.join(",")}`}
      position={place.coords}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(place.icon),
        className: "custom-icon",
      })}
    >
      <Popup>
        <div className={`pop-up-container ${place.type}-popup`}>
          <h2 className="place-name">{getTitle()}</h2>

          {/* current/searched/clicked */}
          {["current", "searched", "clicked"].includes(place.type) &&
            locationDetails && (
              <>
                <p>{locationDetails.placeName}</p>
                <p className="city-name-popup">
                  {locationDetails.city || "Unknown city"},{" "}
                  {locationDetails.country?.trim() || "Unknown country"}{" "}
                  {getCountryFlag(locationDetails.countryCode || "")}
                </p>
                <p>
                  Latitude: {place.coords[0]}, Longitude: {place.coords[1]}
                </p>
                <button
                  className={`copy-button ${copySuccess ? "copied" : ""}`}
                  onClick={handleCopy}
                >
                  {copySuccess ? "Copied 😁" : "Copy Coords 🏌🏻‍♂️"}
                </button>
              </>
            )}

          {/* visited / planned / highlighted styles */}
          {["visited", "planned", "highlighted"].includes(place.type)}

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

export default PopupWindow;
