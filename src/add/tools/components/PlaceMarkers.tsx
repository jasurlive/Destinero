// PlaceMarkers.tsx
import React, { useCallback } from "react";
import CreatePopup from "../PopUp";
import { PiFlagPennantFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { ImHeartBroken } from "react-icons/im";
import { PlaceMarkersProps } from "../../../types/interface";

const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
  visitedPlaces,
  plannedPlaces,
  highlightedPlaces = [],
  mapRef,
  copyCoordsToClipboard,
  copySuccess,
}) => {
  const places = [
    ...visitedPlaces.map((place) => ({
      ...place,
      type: "visited",
      icon: <PiFlagPennantFill className="custom-marker-icon-visited" />,
    })),
    ...plannedPlaces.map((place) => ({
      ...place,
      type: "planned",
      icon: <BiSolidPlaneAlt className="custom-marker-icon-planned" />,
    })),
    ...highlightedPlaces.map((place, index) => ({
      ...place,
      type: "highlighted",
      autoOpen: index === 0,
      icon: <ImHeartBroken className="custom-marker-icon-highlighted" />,
    })),
  ];

  return (
    <>
      {places.map((place) => (
        <CreatePopup
          key={`${place.type}-${place.coords.join(",")}`}
          place={place}
          mapRef={mapRef}
          handleCopyClick={() => copyCoordsToClipboard(place.coords)}
          copySuccess={copySuccess}
          autoOpen={place.autoOpen || false}
        />
      ))}
    </>
  );
};

export default PlaceMarkers;
