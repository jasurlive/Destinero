// PopupHandler.tsx
import React from "react";
import CreatePopup from "./components/PopupWindow";
import { MdLocationPin } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { PopupHandlerProps } from "../../types/interface";

const PopupHandler: React.FC<PopupHandlerProps> = ({
  popupCoords,
  searchCoords,
  locationDetails,
  clickedLocationDetails,
  mapRef, // ✅ keep in case you still need it elsewhere
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
          locationDetails={clickedLocationDetails}
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
          locationDetails={locationDetails}
        />
      )}
    </>
  );
};

export default PopupHandler;
