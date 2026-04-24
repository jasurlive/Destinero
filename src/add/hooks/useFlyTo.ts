import { useMap } from "react-leaflet";

type FlyOptions = { zoom?: number; duration?: number };

export const useFlyTo = () => {
  const map = useMap();

  const flyTo = (
    coords: [number, number],
    options: FlyOptions = { zoom: 15, duration: 0.6 }
  ) => {
    const zoom = options.zoom ?? map.getZoom();

    const point = map.project(coords, zoom);
    const target = map.unproject(point.subtract([0, 120]), zoom);

    map.flyTo(target, zoom, {
      animate: true,
      duration: options.duration ?? 0.6,
    });
  };

  return { flyTo };
};