import { useState, useCallback, useEffect } from "react";
import { useMapEvents, useMap } from "react-leaflet";
import { AllPlaceTypes } from "../hooks/useFetchExcel";

export const useClickedMarker = () => {
  const [clickedMarker, setClickedMarkerState] = useState<AllPlaceTypes | null>(
    null
  );

  const setClickedMarker = useCallback(
    (coords: [number, number], name?: string) => {
      setClickedMarkerState({
        coords,
        type: "clicked",
        name: name ?? "Clicked Location",
      });
    },
    []
  );

  const clearClickedMarker = useCallback(() => {
    setClickedMarkerState(null);
  }, []);

  const ClickListener = () => {
    const map = useMap();

    useMapEvents({
      click: (e) => {
        const target = e.originalEvent.target as HTMLElement | null;

        if (
          target?.closest(".leaflet-control") ||
          target?.closest(".leaflet-marker-icon") ||
          target?.closest(".leaflet-popup") ||
          target?.closest("button") ||
          target?.closest("[role='button']") ||
          target?.closest("input") ||
          target?.closest("textarea") ||
          target?.closest("select")
        ) {
          return;
        }

        setClickedMarker([e.latlng.lat, e.latlng.lng]);
      },
    });

    useEffect(() => {
      const container = map.getContainer();

      const disableMap = () => {
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
      };

      const enableMap = () => {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
      };

      const onFocusIn = (e: FocusEvent) => {
        const target = e.target as HTMLElement | null;

        if (
          target?.closest("input") ||
          target?.closest("textarea") ||
          target?.closest("select")
        ) {
          disableMap();
        }
      };

      const onFocusOut = () => {
        enableMap();
      };

      container.addEventListener("focusin", onFocusIn);
      container.addEventListener("focusout", onFocusOut);

      return () => {
        container.removeEventListener("focusin", onFocusIn);
        container.removeEventListener("focusout", onFocusOut);
      };
    }, [map]);

    return null;
  };

  return {
    clickedMarker,
    setClickedMarker,
    clearClickedMarker,
    ClickListener,
  };
};
