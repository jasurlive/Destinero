import { useMap } from "react-leaflet";

type FlyOptions = { zoom?: number; duration?: number };

export const useFlyTo = () => {
  const map = useMap();

  const flyTo = (
    coords: [number, number],
    options: FlyOptions = { zoom: 15, duration: 3 }
  ) =>
    new Promise<void>((resolve) => {
      if (!map) return resolve();
      map.once("moveend", () => resolve());
      map.flyTo(coords, options.zoom ?? map.getZoom(), {
        duration: options.duration ?? 3,
      });
    });

  return { flyTo };
};
