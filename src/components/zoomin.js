// zoomin.js
export const zoomToLocation = (map, coords, zoomLevel = 15) => {
    console.log('zoomToLocation called with', map, coords, zoomLevel);
  
    if (map && coords) {
      map.flyTo(coords, zoomLevel, {
        animate: true,
        duration: 2, // Duration in seconds for the animation
        easeLinearity: 0.25, // Controls the easing of the animation, lower values provide a smoother animation
      });
      console.log('FlyTo called');
    } else {
      console.error('Map or coords not defined');
    }
  };
  