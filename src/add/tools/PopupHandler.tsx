import React, { useEffect } from "react";
import CreatePopup from "./components/PopupWindow";
import { MdLocationPin } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { PopupHandlerProps } from "../../types/interface";
import { useLocationPopup } from "./hooks/useLocationPopup";

const PopupHandler: React.FC<PopupHandlerProps> = ({
  popupCoords,
  searchCoords,
  copyCoordsToClipboard,
}) => {
  const { setCoordsAndFetch, locationDetails } = useLocationPopup();

  // ✅ Single effect to handle both popupCoords & searchCoords
  useEffect(() => {
    const coords = popupCoords || searchCoords;
    if (coords) {
      setCoordsAndFetch(coords);
    }
  }, [popupCoords, searchCoords, setCoordsAndFetch]);

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
          locationDetails={locationDetails} // ✅ always fresh
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
          locationDetails={locationDetails} // ✅ always fresh
        />
      )}
    </>
  );
};

export default PopupHandler;
