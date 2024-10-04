export const zoomLiveToLocation = (map, coords, zoomLevel = 15) => {
    console.log('zoomLiveToLocation called with', map, coords, zoomLevel);

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

    // Perform the zoom/flyTo action specifically for live location
    map.flyTo(coords, zoomLevel, {
        animate: true,
        duration: 1.5, // Slightly faster animation for live location (can be adjusted)
        easeLinearity: 0.3, // Make the animation smoother for live tracking
    });

    console.log('FlyTo for live location called');
};
