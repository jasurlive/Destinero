// PopupHandler.tsx
import React from "react";
import CreatePopup from "../PopUp";
import { MdLocationPin } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";

interface PopupHandlerProps {
  popupCoords: [number, number] | null;
  searchCoords: [number, number] | null;
  locationDetails: {
    placeName: string;
    city: string;
    country: string;
    countryCode: string;
  };
  clickedLocationDetails: {
    placeName: string;
    city: string;
    country: string;
    countryCode: string;
  };
  mapRef: React.RefObject<L.Map | null>;
  copyCoordsToClipboard: (coords: [number, number]) => void;
  copySuccess: boolean;
}

const PopupHandler: React.FC<PopupHandlerProps> = ({
  popupCoords,
  searchCoords,
  locationDetails,
  clickedLocationDetails,
  mapRef,
  copyCoordsToClipboard,
  copySuccess,
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
          mapRef={mapRef}
          handleCopyClick={() => copyCoordsToClipboard(popupCoords)}
          copySuccess={copySuccess}
          onPlaceClick={() => {}}
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
          mapRef={mapRef}
          handleCopyClick={() => copyCoordsToClipboard(searchCoords)}
          copySuccess={copySuccess}
          onPlaceClick={() => {}}
          locationDetails={locationDetails}
        />
      )}
    </>
  );
};

export default PopupHandler;
