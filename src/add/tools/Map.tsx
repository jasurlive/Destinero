import { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { FaSearchLocation } from "react-icons/fa";
import { PiFlagPennantFill } from "react-icons/pi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { BsFillPinFill } from "react-icons/bs";
import { useMediaQuery } from "@mui/material";
import { MapProps } from "../../types/types";
import SearchBox from "./SearchBox";
import MapEvents from "./MapEvents";
import CreatePopup from "./PopUp";
import { zoomToLocation } from "./Zoomin";

import "../css/map.css";
import "leaflet/dist/leaflet.css";

const mapKey = import.meta.env.VITE_MapKey;

const Map: React.FC<MapProps & { locked?: boolean }> = ({
  visitedPlaces,
  plannedPlaces,
  searchCoords,
  setSearchCoords,
  locked = true,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const defaultCenter: [number, number] = isMobile
    ? [41.505, -0.09]
    : [31.505, -0.09];
  const defaultZoom = isMobile ? 2.5 : 3.3;
  const adjustedCenter: [number, number] = [
    defaultCenter[0],
    defaultCenter[1] + (isMobile ? 22 : 70),
  ];
  const [locationDetails, setLocationDetails] = useState({
    placeName: "",
    city: "",
    country: "",
    countryCode: "",
  });
  const [popupCoords, setPopupCoords] = useState<[number, number] | null>(null);
  const [clickedLocationDetails, setClickedLocationDetails] = useState({
    placeName: "",
    city: "",
    country: "",
    countryCode: "",
  });

  const handleMapClickLocal = useCallback((coords: [number, number]) => {
    setPopupCoords(coords);
    fetchLocationDetails(coords).then((details) =>
      setClickedLocationDetails(details)
    );
  }, []);

  const handleCopyClick = useCallback(() => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  }, []);

  const copyCoordsToClipboard = useCallback(
    (coords: [number, number]) => {
      navigator.clipboard.writeText(`[${coords[0]}, ${coords[1]}]`);
      handleCopyClick();
    },
    [handleCopyClick]
  );

  useEffect(() => {
    if (searchCoords && mapRef.current) {
      zoomToLocation(mapRef.current, searchCoords);
      fetchLocationDetails(searchCoords).then((details) =>
        setLocationDetails(details)
      );
    }
  }, [searchCoords]);

  const fetchLocationDetails = async (coords: [number, number]) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&addressdetails=1`
    );
    const data = await response.json();
    return {
      placeName: data.display_name,
      city:
        data.address.city || data.address.town || data.address.village || "",
      country: data.address.country,
      countryCode: data.address.country_code.toUpperCase(),
    };
  };

  const places = [
    ...visitedPlaces.map((place) => ({
      ...place,
      type: "visited",
      icon: <PiFlagPennantFill className="custom-marker-icon-visited" />,
    })),
    ...plannedPlaces.map((place) => ({
      ...place,
      type: "planned",
      icon: <BiSolidPlaneAlt className="custom-marker-icon-planned" />,
    })),
  ];

  const handlePlaceClick = useCallback((coords: [number, number]) => {
    zoomToLocation(mapRef.current, coords);
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Always start locked on first mount
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
      map.on("click", (e: L.LeafletMouseEvent) => {
        handleMapClickLocal([e.latlng.lat, e.latlng.lng]);
      });
    }

    return () => {
      if (map) {
        map.off("click");
      }
    };
  }, [locked, handleMapClickLocal, mapRef.current]);

  return (
    <div className="map-container">
      <MapContainer
        center={adjustedCenter}
        zoom={defaultZoom}
        className="leaflet-map"
        ref={mapRef}
        zoomSnap={0.5}
        zoomDelta={0.5}
        zoomControl={false}
        worldCopyJump={true}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={0}
        fadeAnimation={true}
        attributionControl={false}
        minZoom={3}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${mapKey}`}
        />
        <SearchBox
          map={mapRef.current}
          onSearch={setSearchCoords}
          handleCopyClick={handleCopyClick}
          copySuccess={copySuccess}
        />
        {!locked && <MapEvents onClick={handleMapClickLocal} />}
        {places.map((place) => (
          <CreatePopup
            key={`${place.type}-${place.coords.join(",")}`}
            place={place}
            mapRef={mapRef}
            handleCopyClick={() => copyCoordsToClipboard(place.coords)}
            copySuccess={copySuccess}
            onPlaceClick={handlePlaceClick}
          />
        ))}
        {searchCoords && (
          <CreatePopup
            place={{
              type: "searched",
              coords: searchCoords,
              icon: (
                <FaSearchLocation className="custom-marker-icon-searched" />
              ),
            }}
            mapRef={mapRef}
            handleCopyClick={() => copyCoordsToClipboard(searchCoords)}
            copySuccess={copySuccess}
            onPlaceClick={handlePlaceClick}
            locationDetails={locationDetails}
          />
        )}
        {popupCoords && (
          <CreatePopup
            place={{
              type: "clicked",
              coords: popupCoords,
              icon: <BsFillPinFill className="custom-marker-icon-clicked" />,
            }}
            mapRef={mapRef}
            handleCopyClick={() => copyCoordsToClipboard(popupCoords)}
            copySuccess={copySuccess}
            onPlaceClick={handlePlaceClick}
            locationDetails={clickedLocationDetails}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
