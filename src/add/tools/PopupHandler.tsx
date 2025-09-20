import React, { useEffect } from "react";
import CreatePopup from "./components/PopupWindow";
import { MdLocationPin } from "react-icons/md";
import { FaSearchLocation } from "react-icons/fa";
import { BsPersonRaisedHand } from "react-icons/bs";
import { PopupHandlerProps } from "../../types/interface";

import { usePopupOptions } from "./hooks/usePopUpOptions";
import { useFetchLocation } from "./hooks/useFetchLocation";

import "../css/popup.css";

const PopupHandler: React.FC<PopupHandlerProps> = ({
  popupCoords,
  searchCoords,
  liveCoords,
  copyCoordsToClipboard,
}) => {
  const { setCoordsAndFetch } = usePopupOptions();
  const { fetchCoordsData, getDetailsForCoords, loading } = useFetchLocation();

  // Unified coords array
  const coordsList = [popupCoords, searchCoords, liveCoords].filter(
    Boolean
  ) as [number, number][];

  useEffect(() => {
    coordsList.forEach((coords) => {
      setCoordsAndFetch(coords);
      fetchCoordsData(coords); // async fetch, don't block rendering
    });
  }, [coordsList, fetchCoordsData, setCoordsAndFetch]);

  return (
    <>
      {coordsList.map((coords) => {
        const type =
          coords === popupCoords
            ? "clicked"
            : coords === searchCoords
            ? "searched"
            : "current";

        const icon =
          type === "clicked" ? (
            <MdLocationPin className="custom-marker-icon-clicked" />
          ) : type === "searched" ? (
            <FaSearchLocation className="custom-marker-icon-searched" />
          ) : (
            <BsPersonRaisedHand className="custom-marker-icon-live" />
          );

        const locationDetails = getDetailsForCoords(coords);

        return (
          <CreatePopup
            key={`${coords[0]},${coords[1]}`}
            place={{ type, coords, icon }}
            handleCopyClick={() => copyCoordsToClipboard(coords)}
            locationDetails={locationDetails}
            autoOpen={type !== "clicked"} // clicked may remain manual
          />
        );
      })}
    </>
  );
};

export default PopupHandler;
