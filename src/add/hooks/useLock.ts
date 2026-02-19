import { useEffect } from "react";
import { Map } from "leaflet";

export const useMapLock = (map: Map | null, locked: boolean) => {
  useEffect(() => {
    if (!map) return;

    if (locked) {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      map.touchZoom.disable();
      map.off("click");
    } else {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.touchZoom.enable();
    }
  }, [map, locked]);
};
