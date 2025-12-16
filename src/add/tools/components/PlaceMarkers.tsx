import React, { useEffect, useMemo, useRef, useState } from "react";
import CreatePopup from "./PopupWindow";
import { PiFlagPennantFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { ImHeartBroken } from "react-icons/im";
import { PlaceMarkersProps } from "../../../types/interface";
import { usePopupOptions } from "../hooks/usePopUpOptions";

type PlaceWithAutoOpen = {
  place: any;
  autoOpen: boolean;
};

const PlaceMarkers: React.FC<PlaceMarkersProps> = ({
  visitedPlaces,
  plannedPlaces,
  highlightedPlaces = [],
}) => {
  const { copyToClipboard } = usePopupOptions();
  const hasAutoOpenedRef = useRef(false);
  const [places, setPlaces] = useState<PlaceWithAutoOpen[]>([]);

  const basePlaces = useMemo<PlaceWithAutoOpen[]>(() => {
    return [
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
  }, [visitedPlaces, plannedPlaces, highlightedPlaces]);

  useEffect(() => {
    if (hasAutoOpenedRef.current) {
      setPlaces(basePlaces);
      return;
    }

    if (basePlaces.length === 0) {
      setPlaces(basePlaces);
      return;
    }

    const eligibleIndexes = basePlaces
      .map((p, i) =>
        p.place.type === "visited" || p.place.type === "highlighted" ? i : null
      )
      .filter((i): i is number => i !== null);

    if (eligibleIndexes.length === 0) {
      setPlaces(basePlaces);
      return;
    }

    const selectedIndex =
      eligibleIndexes[Math.floor(Math.random() * eligibleIndexes.length)];

    const updatedPlaces = basePlaces.map((p, i) => ({
      ...p,
      autoOpen: i === selectedIndex,
    }));

    hasAutoOpenedRef.current = true;
    setPlaces(updatedPlaces);
  }, [basePlaces]);

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
