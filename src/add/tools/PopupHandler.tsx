import React, { useEffect } from "react";
import CreatePopup from "./components/PopupWindow";
import { MdLocationPin } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { BsPersonRaisedHand } from "react-icons/bs";
import { PopupHandlerProps } from "../../types/interface";

import { usePopupOptions } from "./hooks/usePopUpOptions";
import { useFetchLocation } from "./hooks/useFetchLocation";

const PopupHandler: React.FC<
  PopupHandlerProps & { mapRef?: React.RefObject<L.Map | null> }
> = ({
  popupCoords,
  searchCoords,
  liveCoords,
  copyCoordsToClipboard,
  mapRef,
}) => {
  const { setCoordsAndFetch } = usePopupOptions();
  const { fetchCoordsData, getDetailsForCoords } = useFetchLocation();

  const coordsList = [popupCoords, searchCoords, liveCoords].filter(
    Boolean
  ) as [number, number][];

  useEffect(() => {
    coordsList.forEach((coords) => {
      setCoordsAndFetch(coords);
      fetchCoordsData(coords);

      // Auto-center live/searched popups
      if (mapRef?.current && coords !== popupCoords) {
        mapRef.current.panTo(coords, { animate: true });
      }
    });
  }, [coordsList, fetchCoordsData, setCoordsAndFetch, mapRef, popupCoords]);

  const getIcon = (type: "clicked" | "searched" | "current") => {
    switch (type) {
      case "clicked":
        return <MdLocationPin className="custom-marker-icon-clicked" />;
      case "searched":
        return <FaSearchLocation className="custom-marker-icon-searched" />;
      case "current":
        return <BsPersonRaisedHand className="custom-marker-icon-live" />;
    }
  };

  return (
    <>
      {coordsList.map((coords) => {
        const type =
          coords === popupCoords
            ? "clicked"
            : coords === searchCoords
            ? "searched"
            : "current";

        return (
          <CreatePopup
            key={`${coords[0]},${coords[1]}`}
            place={{ type, coords, icon: getIcon(type) }}
            handleCopyClick={() => copyCoordsToClipboard(coords)}
            locationDetails={getDetailsForCoords(coords)}
            autoOpen={type !== "clicked"}
          />
        );
      })}
    </>
  );
};

export default PopupHandler;
