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
  const hasAutoOpened = useRef(false);
  const [places, setPlaces] = useState<PlaceWithAutoOpen[]>([]);

  const basePlaces = useMemo<PlaceWithAutoOpen[]>(() => {
    const mapPlace = (place: any, type: string, icon: React.ReactNode) => ({
      place: { ...place, type, icon },
      autoOpen: false,
    });
    return [
      ...visitedPlaces.map((p) =>
        mapPlace(
          p,
          "visited",
          <PiFlagPennantFill className="custom-marker-icon-visited" />
        )
      ),
      ...plannedPlaces.map((p) =>
        mapPlace(
          p,
          "planned",
          <BiSolidPlaneAlt className="custom-marker-icon-planned" />
        )
      ),
      ...highlightedPlaces.map((p) =>
        mapPlace(
          p,
          "highlighted",
          <ImHeartBroken className="custom-marker-icon-highlighted" />
        )
      ),
    ];
  }, [visitedPlaces, plannedPlaces, highlightedPlaces]);

  useEffect(() => {
    if (hasAutoOpened.current || basePlaces.length === 0) {
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
    setPlaces(
      basePlaces.map((p, i) => ({ ...p, autoOpen: i === selectedIndex }))
    );
    hasAutoOpened.current = true;
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
