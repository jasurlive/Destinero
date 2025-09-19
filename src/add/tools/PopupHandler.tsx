import React, { useEffect } from "react";
import CreatePopup from "./components/PopupWindow";
import { MdLocationPin } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { BsPersonRaisedHand } from "react-icons/bs"; // 🔹 for live location popup
import { PopupHandlerProps } from "../../types/interface";
import { useLocationPopup } from "./hooks/useLocationPopup";

import "../css/popup.css";

const PopupHandler: React.FC<PopupHandlerProps> = ({
  popupCoords,
  searchCoords,
  liveCoords, // 🔹 live location support
  copyCoordsToClipboard,
}) => {
  const { setCoordsAndFetch, getDetailsForCoords } = useLocationPopup();

  // ✅ Single effect to trigger fetch for whichever coords are active
  useEffect(() => {
    const coords = popupCoords || searchCoords || liveCoords;
    if (coords) {
      setCoordsAndFetch(coords);
    }
  }, [popupCoords, searchCoords, liveCoords, setCoordsAndFetch]);

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
          locationDetails={getDetailsForCoords(popupCoords)} // 🔹 each popup uses its own details
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
          locationDetails={getDetailsForCoords(searchCoords)} // 🔹 separate details
          autoOpen
        />
      )}

      {/* 🔹 Live Location Popup */}
      {liveCoords && (
        <CreatePopup
          place={{
            type: "current",
            coords: liveCoords,
            icon: <BsPersonRaisedHand className="custom-marker-icon-live" />,
          }}
          handleCopyClick={() => copyCoordsToClipboard(liveCoords)}
          locationDetails={getDetailsForCoords(liveCoords)} // 🔹 separate details
          autoOpen
        />
      )}
    </>
  );
};

export default PopupHandler;
