import React from "react";
import CreatePopup from "./components/PopupWindow";
import { MdLocationPin } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { PopupHandlerProps } from "../../types/interface";

const PopupHandler: React.FC<PopupHandlerProps> = ({
  popupCoords,
  searchCoords,
  locationDetails,
  copyCoordsToClipboard,
}) => {
  return (
    <>
      {/* Clicked Location Popup */}
      {popupCoords && (
        <CreatePopup
          place={{
            type: "clicked",
            coords: popupCoords,
            icon: <MdLocationPin className="custom-marker-icon-clicked" />,
          }}
          handleCopyClick={() => copyCoordsToClipboard(popupCoords)}
          locationDetails={locationDetails} // ✅ now using universal details
        />
      )}

      {/* Searched Location Popup */}
      {searchCoords && (
        <CreatePopup
          place={{
            type: "searched",
            coords: searchCoords,
            icon: <FaSearchLocation className="custom-marker-icon-searched" />,
          }}
          handleCopyClick={() => copyCoordsToClipboard(searchCoords)}
          locationDetails={locationDetails} // ✅ same here
        />
      )}
    </>
  );
};

export default PopupHandler;
