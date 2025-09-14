import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { FaSpinner } from "react-icons/fa";
import { usePopupOptions } from "./hooks/usePopUpOptions";
import { CreatePopupProps } from "../../types/interface";
import { getCountryFlag } from "./components/getCountryFlags";
import "../css/popup.css";

const CreatePopup: React.FC<CreatePopupProps & { autoOpen?: boolean }> = ({
  place,
  locationDetails,
  handleCopyClick,
  autoOpen = false,
}) => {
  const {
    markerRef,
    copySuccess,
    copyToClipboard,
    imageLoaded,
    handleImageLoad,
  } = usePopupOptions({ autoOpen, handleCopyClick });

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
        return place.name;
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
      ref={markerRef}
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
