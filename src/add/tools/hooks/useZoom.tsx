import { useCallback } from "react";
import L from "leaflet";

export const useZoom = (map: L.Map | null) => {
  const zoomToLocation = useCallback(
    (
      coords: [number, number],
      zoomLevel: number = 15,
      onZoomEnd?: () => void
    ) => {
      if (!map) return;

      const [lat, lng] = coords;
      if (typeof lat !== "number" || typeof lng !== "number") return;

      map.flyTo([lat, lng], zoomLevel, {
        animate: true,
        duration: 2,
        easeLinearity: 0.1,
      });

      if (onZoomEnd) {
        map.once("moveend", onZoomEnd);
      }
    },
    [map]
  );

  return { zoomToLocation };
};
