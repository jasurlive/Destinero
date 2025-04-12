import { useState } from "react";
import { Marker, Popup, MarkerProps } from "react-leaflet";
import "../css/popup.css";
import { FaSpinner } from "react-icons/fa";
import { getCountryFlag } from "./Flags";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { CreatePopupProps } from "../../types/types";

const CustomMarker: React.FC<MarkerProps> = (props) => {
  return <Marker {...props} />;
};

const CreatePopup: React.FC<CreatePopupProps> = ({
  place,
  handleCopyClick,
  copySuccess,
  locationDetails,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

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
        return place.name;
      default:
        return "Location";
    }
  };

  return (
    <CustomMarker
      key={`${place.type}-${place.coords.join(",")}`}
      position={place.coords}
      icon={L.divIcon({
        html: ReactDOMServer.renderToString(place.icon),
        className: "custom-icon",
      })}
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
    </CustomMarker>
  );
};

export default CreatePopup;
