import React, { useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { zoomLiveToLocation } from './zoomlive'; // Import the new zoomLiveToLocation function

const LiveLocation = ({ mapRef, handleCopyClick, copySuccess }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isActive, setIsActive] = useState(false); // Track if location is active

    const handleLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const coords = [latitude, longitude];
                    setCurrentLocation(coords);
                    setErrorMsg('');
                    setIsActive(true); // Change image to active (red) when location is found

                    // Use zoomLiveToLocation for zoom-in behavior
                    if (mapRef.current) {
                        zoomLiveToLocation(mapRef.current, coords, 15); // Calls the custom zoomLiveToLocation function
                    }
                },
                () => {
                    setErrorMsg('Unable to retrieve your location');
                }
            );
        } else {
            setErrorMsg('Geolocation is not supported by your browser');
        }
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleCopy = () => {
        if (currentLocation) {
            const formattedCoords = `coords: [${currentLocation[0]}, ${currentLocation[1]}]`;
            navigator.clipboard.writeText(formattedCoords);
            handleCopyClick(); // Trigger state change or feedback for copy success
        }
    };

    // Define inline styles for the glow effect
    const glowStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        boxShadow: isActive
            ? '0 0 20px rgba(0, 0, 255, 0.7), 0 0 5px rgba(255, 255, 255, 0.5)' // Blue glow when active
            : '0 0 20px rgba(255, 0, 0, 0.7), 0 0 5px rgba(255, 255, 255, 0.5)', // Red glow when not active
        transition: 'box-shadow 1.5s ease-in-out',
    };

    return (
        <>
            {/* Image button for getting live location */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '10px',
                    zIndex: 1000,
                    cursor: 'pointer',
                }}
                onClick={handleLocationClick}
                title="Click to get your current location"
            >
                <img
                    src={isActive ? `${process.env.PUBLIC_URL}/img/live_red.png` : `${process.env.PUBLIC_URL}/img/live.png`} // Change image based on active status
                    alt="Live Location"
                    style={glowStyle} // Apply inline styles for glow
                />
            </div>

            {/* Marker and Popup for live location */}
            {currentLocation && (
                <Marker
                    position={currentLocation}
                    icon={L.divIcon({
                        html: `<span class="unicode-icon">⛳</span>`,
                        className: 'custom-div-icon',
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                    })}
                >
                    <Popup>
                        <div className="cont">
                            <h2>Your Current Location</h2>
                            <br />
                            <a href="https://jasurgraduate.blogspot.com/" target="_blank" rel="noopener noreferrer"> {/* Static link */}
                                <img
                                    src={`${process.env.PUBLIC_URL}/img/live.png`} // Replace with your image link for the popup
                                    alt="Your Location"
                                    className="place-image"
                                    onLoad={handleImageLoad}
                                    style={{ display: imageLoaded ? 'block' : 'none' }}
                                />
                            </a>
                            <br />
                            {`Latitude: ${currentLocation[0]}, Longitude: ${currentLocation[1]}`}
                            <br />
                            <button
                                className={`copy-button ${copySuccess ? 'copied' : ''}`}
                                onClick={handleCopy}
                            >
                                {copySuccess ? 'Copied 😁!' : 'Copy Coords 🏌🏻‍♂️'}
                            </button>
                        </div>
                    </Popup>
                </Marker>
            )}

            {/* Error message if geolocation fails */}
            {errorMsg && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '60px',
                        right: '10px',
                        padding: '8px',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '5px',
                        zIndex: 1000,
                    }}
                >
                    {errorMsg}
                </div>
            )}
        </>
    );
};

export default LiveLocation;
