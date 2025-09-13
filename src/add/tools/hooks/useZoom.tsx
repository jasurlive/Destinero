import { useCallback } from "react";
import L from "leaflet";

export const useZoom = (map: L.Map | null) => {
  /**
   * Zooms the map to given coordinates with optional zoom level.
   */
  const zoomToLocation = useCallback(
    (
      coords: [number, number],
      zoomLevel: number = 15,
      onZoomEnd?: () => void // optional callback after zoom completes
    ) => {
      if (!map) {
        console.error("Map object is not defined");
        return;
      }

      if (
        !coords ||
        coords.length !== 2 ||
        typeof coords[0] !== "number" ||
        typeof coords[1] !== "number"
      ) {
        console.error("Coords are not defined or invalid", coords);
        return;
      }

      if (typeof zoomLevel !== "number") {
        console.error("Zoom level must be a number", zoomLevel);
        return;
      }

      map.flyTo(coords, zoomLevel, {
        animate: true,
        duration: 2,
        easeLinearity: 0.1,
      });

      if (onZoomEnd) {
        map.once("moveend", onZoomEnd); // call callback when animation ends
      }
    },
    [map]
  );

  return { zoomToLocation };
};
