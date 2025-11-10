import React from "react";
import CreatePopup from "./PopupWindow";
import { PiFlagPennantFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { ImHeartBroken } from "react-icons/im";
import { PlaceMarkersProps } from "../../../types/interface";
import { usePopupOptions } from "../hooks/usePopUpOptions";

const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
  visitedPlaces,
  plannedPlaces,
  highlightedPlaces = [],
}) => {
  const { copyToClipboard } = usePopupOptions();

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
    ...highlightedPlaces.map((place) => ({
      place: {
        ...place,
        type: "highlighted" as const,
        icon: <ImHeartBroken className="custom-marker-icon-highlighted" />,
      },
      autoOpen: false,
    })),
  ];

  /*  if (places.length > 0) {
    const randomIndex = Math.floor(Math.random() * places.length);
    places[randomIndex].autoOpen = true;
  } */

  if (places.length > 0) {
    const eligibleIndexes = places
      .map((p, i) =>
        ["highlighted", "visited"].includes(p.place.type) ? i : null
      )
      .filter((i) => i !== null) as number[];

    if (eligibleIndexes.length > 0) {
      places[
        eligibleIndexes[Math.floor(Math.random() * eligibleIndexes.length)]
      ].autoOpen = true;
    }
  }

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
