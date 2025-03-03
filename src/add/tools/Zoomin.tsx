import L from 'leaflet';

export const zoomToLocation = (map: L.Map | null, coords: [number, number], zoomLevel: number = 15) => {
  console.log('zoomToLocation called with', map, coords, zoomLevel);

  if (!map) {
    console.error('Map object is not defined');
    return;
  }

  if (!coords || coords.length !== 2 || typeof coords[0] !== 'number' || typeof coords[1] !== 'number') {
    console.error('Coords are not defined or invalid', coords);
    return;
  }

  if (typeof zoomLevel !== 'number') {
    console.error('Zoom level must be a number', zoomLevel);
    return;
  }

  map.flyTo(coords, zoomLevel, {
    animate: true,
    duration: 2, // Duration in seconds for the animation
    easeLinearity: 0.1, // Controls the easing of the animation, lower values provide a smoother animation
  });
  console.log('FlyTo called');
};
