import React from "react";
import CreatePopup from "./PopupWindow";
import { PiFlagPennantFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { ImHeartBroken } from "react-icons/im";
import { PlaceMarkersProps } from "../../../types/interface";
import { useLocationPopup } from "../hooks/useLocationPopup";

const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
  visitedPlaces,
  plannedPlaces,
  highlightedPlaces = [],
}) => {
  // ✅ use universal clipboard from hook
  const { copyToClipboard } = useLocationPopup();

  const places = [
    ...visitedPlaces.map((place) => ({
      place: {
        ...place,
        type: "visited" as const,
        icon: <PiFlagPennantFill className="custom-marker-icon-visited" />,
      },
      autoOpen: false,
    })),
    ...plannedPlaces.map((place) => ({
      place: {
        ...place,
        type: "planned" as const,
        icon: <BiSolidPlaneAlt className="custom-marker-icon-planned" />,
      },
      autoOpen: false,
    })),
    ...highlightedPlaces.map((place, index) => ({
      place: {
        ...place,
        type: "highlighted" as const,
        icon: <ImHeartBroken className="custom-marker-icon-highlighted" />,
      },
      autoOpen: index === 0,
    })),
  ];

  return (
    <>
      {places.map(({ place, autoOpen }) => (
        <CreatePopup
          key={`${place.type}-${place.coords.join(",")}`}
          place={place}
          handleCopyClick={() =>
            copyToClipboard(`[${place.coords[0]}, ${place.coords[1]}]`)
          }
          autoOpen={autoOpen}
        />
      ))}
    </>
  );
};

export default PlaceMarkers;
